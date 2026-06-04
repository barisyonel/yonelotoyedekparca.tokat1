// MSSQL Connection - Vercel optimized
import sql from 'mssql';

const isProductionBuild = process.env.NEXT_PHASE === 'phase-production-build';

/** Build/deploy sırasında uzun DB beklemesi static page timeout'a yol açar */
function resolveDbTimeout(envKey: string, buildMs: number, defaultMs: number): number {
  const fromEnv = process.env[envKey];
  if (fromEnv) return parseInt(fromEnv, 10);
  if (isProductionBuild) return buildMs;
  return defaultMs;
}

const connectTimeoutMs = resolveDbTimeout('DB_CONNECT_TIMEOUT', 8000, 30000);
const requestTimeoutMs = resolveDbTimeout('DB_REQUEST_TIMEOUT', 8000, 30000);
const connectionTimeoutMs = resolveDbTimeout('DB_CONNECTION_TIMEOUT', 8000, 30000);

const config: sql.config = {
  server: process.env.DB_SERVER || '',
  database: process.env.DB_NAME || '',
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '1433'),
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true,
    connectTimeout: connectTimeoutMs,
    requestTimeout: requestTimeoutMs,
    instanceName: process.env.DB_INSTANCE || undefined,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
    acquireTimeoutMillis: connectionTimeoutMs,
    createTimeoutMillis: connectionTimeoutMs,
  },
  connectionTimeout: connectionTimeoutMs,
};

let pool: sql.ConnectionPool | null = null;

export async function getConnection(): Promise<sql.ConnectionPool> {
  // Check if database credentials are available
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
  
  if (!pool) {
    try {
      console.log('🔄 SQL Server\'a bağlanılıyor...');
      console.log('📍 Server:', config.server);
      console.log('📂 Database:', config.database);
      
      pool = await sql.connect(config);
      console.log('✅ SQL Server bağlantısı başarılı!');
    } catch (error) {
      console.error('❌ SQL Server bağlantı hatası:', error);
      console.error('🔍 Config:', {
        server: config.server,
        database: config.database,
        user: config.user,
        hasPassword: !!config.password,
      });
      
      // Connection hatası detayları
      if (error instanceof Error) {
        console.error('📋 Hata mesajı:', error.message);
        
        // Yaygın hatalar için öneriler
        if (error.message.includes('ESOCKET') || error.message.includes('connect')) {
          console.error('💡 Öneri: SQL Server firewall\'unda Vercel IP\'lerini whitelist edin:');
          console.error('   - 76.76.21.0/24');
          console.error('   - 76.76.19.0/24');
          console.error('   Veya Azure SQL kullanıyorsanız:');
          console.error('   1. Azure Portal > SQL Server > Firewalls and virtual networks');
          console.error('   2. "Allow Azure services and resources to access this server" açın');
          console.error('   3. Vercel IP aralıklarını ekleyin');
        }
      }
      
      throw error;
    }
  }
  return pool;
}

export { sql };

