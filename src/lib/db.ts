// MSSQL Connection - Vercel optimized
import sql from 'mssql';

const isProductionBuild = process.env.NEXT_PHASE === 'phase-production-build';

/** Vercel/Next build: static üretimde MSSQL'e bağlanma (15sn timeout loglarını önler) */
export function isDatabaseSkippedAtBuild(): boolean {
  return isProductionBuild;
}
/** Vercel Hobby: serverless fonksiyon ~10s; bağlantı + sorgu için pay bırak */
const MAX_SERVERLESS_DB_TIMEOUT_MS = 8_000;

type SqlGlobal = typeof globalThis & {
  __yonelMssqlPool?: sql.ConnectionPool | null;
};

const sqlGlobal = globalThis as SqlGlobal;

/** Build/deploy sırasında uzun DB beklemesi static page timeout'a yol açar */
function resolveDbTimeout(envKey: string, buildMs: number, defaultMs: number): number {
  const fromEnv = process.env[envKey];
  let ms = fromEnv ? parseInt(fromEnv, 10) : isProductionBuild ? buildMs : defaultMs;
  if (process.env.VERCEL && ms > MAX_SERVERLESS_DB_TIMEOUT_MS) {
    ms = MAX_SERVERLESS_DB_TIMEOUT_MS;
  }
  return ms;
}

const connectTimeoutMs = resolveDbTimeout('DB_CONNECT_TIMEOUT', 8000, 30000);
const requestTimeoutMs = resolveDbTimeout('DB_REQUEST_TIMEOUT', 8000, 30000);
const connectionTimeoutMs = resolveDbTimeout('DB_CONNECTION_TIMEOUT', 8000, 30000);

/** DB_SERVER=host\\INSTANCE veya host\INSTANCE → host + instanceName */
function parseDbServerConfig(): { server: string; instanceName?: string } {
  const raw = (process.env.DB_SERVER || '').trim();
  const explicitInstance = process.env.DB_INSTANCE?.trim();

  if (explicitInstance) {
    return { server: raw.replace(/\\+$/, ''), instanceName: explicitInstance };
  }

  const normalized = raw.replace(/\\\\/g, '\\');
  const slashIndex = normalized.indexOf('\\');
  if (slashIndex > 0) {
    return {
      server: normalized.slice(0, slashIndex),
      instanceName: normalized.slice(slashIndex + 1) || undefined,
    };
  }

  return { server: normalized };
}

const { server: dbHost, instanceName: parsedInstance } = parseDbServerConfig();
const explicitPort = process.env.DB_PORT?.trim();
const dbPort = explicitPort ? parseInt(explicitPort, 10) : 1433;

/**
 * Vercel serverless: SQL Browser (UDP 1434) çoğu zaman erişilemez.
 * DB_PORT tanımlıysa doğrudan TCP ile bağlan (instanceName kullanma).
 */
const useDirectTcpPort = Boolean(explicitPort);
const dbInstance = useDirectTcpPort ? undefined : parsedInstance;

/** Node 22+/Vercel: TLS SNI olarak IP yasak; IP ile bağlanırken placeholder serverName gerekir */
const dbHostIsIp = /^\d{1,3}(?:\.\d{1,3}){3}$/.test(dbHost);
const tlsServerName = process.env.DB_TLS_SERVERNAME?.trim() || (dbHostIsIp ? 'mssql' : undefined);

const config: sql.config = {
  server: dbHost,
  database: process.env.DB_NAME || '',
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  port: dbPort,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true,
    connectTimeout: connectTimeoutMs,
    requestTimeout: requestTimeoutMs,
    ...(tlsServerName ? { serverName: tlsServerName } : {}),
    ...(dbInstance ? { instanceName: dbInstance } : {}),
  },
  pool: {
    max: process.env.VERCEL ? 3 : 10,
    min: 0,
    idleTimeoutMillis: 30000,
    acquireTimeoutMillis: connectionTimeoutMs,
    createTimeoutMillis: connectionTimeoutMs,
  },
  connectionTimeout: connectionTimeoutMs,
};

function getPoolRef(): sql.ConnectionPool | null {
  if (process.env.VERCEL) {
    return sqlGlobal.__yonelMssqlPool ?? null;
  }
  return modulePool;
}

function setPoolRef(pool: sql.ConnectionPool | null): void {
  if (process.env.VERCEL) {
    sqlGlobal.__yonelMssqlPool = pool;
  } else {
    modulePool = pool;
  }
}

let modulePool: sql.ConnectionPool | null = null;

export async function getConnection(): Promise<sql.ConnectionPool> {
  if (isDatabaseSkippedAtBuild()) {
    throw new Error('DATABASE_SKIP_BUILD');
  }

  if (!config.server || !config.database || !config.user || !config.password) {
    const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';
    const missingVars = [];
    if (!config.server) missingVars.push('DB_SERVER');
    if (!config.database) missingVars.push('DB_NAME');
    if (!config.user) missingVars.push('DB_USER');
    if (!config.password) missingVars.push('DB_PASSWORD');

    console.error('❌ Eksik veritabanı environment variables:', missingVars.join(', '));

    if (isBuildTime) {
      console.error('⚠️  Build zamanında veritabanı bağlantısı yapılmamalı!');
      console.error('💡 Çözüm: Admin sayfalarında "export const dynamic = \'force-dynamic\'" kullanın');
    }

    throw new Error(`Database configuration incomplete. Missing: ${missingVars.join(', ')}`);
  }

  if (!getPoolRef()) {
    try {
      const isDev = process.env.NODE_ENV === 'development';
      if (isDev) {
        console.log('🔄 SQL Server\'a bağlanılıyor...', config.server);
      }
      if (process.env.VERCEL && dbInstance && !useDirectTcpPort) {
        console.warn(
          '⚠️ Vercel: DB_PORT tanımlayın (named instance SQL Browser çalışmaz).',
        );
      }

      const pool = await sql.connect(config);
      setPoolRef(pool);
      if (isDev) console.log('✅ SQL Server bağlantısı başarılı');
    } catch (error) {
      console.error('❌ SQL Server bağlantı hatası:', error);
      console.error('🔍 Config:', {
        server: config.server,
        database: config.database,
        user: config.user,
        hasPassword: !!config.password,
        port: dbPort,
        instanceName: dbInstance ?? '(direct TCP)',
        vercel: !!process.env.VERCEL,
      });

      if (error instanceof Error) {
        console.error('📋 Hata mesajı:', error.message);

        if (error.message.includes('ESOCKET') || error.message.includes('connect')) {
          console.error('💡 Öneri: SQL Server firewall\'unda Vercel IP aralıklarını whitelist edin.');
          console.error('   DB_PORT ile sabit TCP portu kullanın (named instance yerine).');
        }
      }

      setPoolRef(null);
      throw error;
    }
  }

  return getPoolRef()!;
}

/** Bağlantı koptuğunda sonraki istek yeni pool açar */
export function resetConnectionPool(): void {
  const pool = getPoolRef();
  if (pool) {
    pool.close().catch(() => undefined);
    setPoolRef(null);
  }
}

export { sql };
