import { NextRequest, NextResponse } from 'next/server';
import { getConnection, resetConnectionPool } from '@/lib/db';
import {
  hasEnvAdminCredentials,
  getMissingAdminEnvVars,
} from '@/lib/auth/adminCredentials';

export const dynamic = 'force-dynamic';
export const maxDuration = 15;

/**
 * Deploy sonrası teşhis: ?key=ADMIN_SECRET_KEY
 * Gizli değerleri asla döndürmez.
 */
export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get('key');
  const expected = process.env.ADMIN_SECRET_KEY?.trim();

  if (!expected || key !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const dbEnvOk = Boolean(
    process.env.DB_SERVER?.trim() &&
      process.env.DB_NAME?.trim() &&
      process.env.DB_USER?.trim() &&
      process.env.DB_PASSWORD,
  );

  const adminEnvOk = hasEnvAdminCredentials();
  const missingAdmin = getMissingAdminEnvVars();

  let dbConnected = false;
  let dbError: string | undefined;

  if (dbEnvOk) {
    try {
      resetConnectionPool();
      const pool = await getConnection();
      await pool.request().query('SELECT 1 AS ok');
      dbConnected = true;
    } catch (e) {
      dbError = e instanceof Error ? e.message : 'Unknown error';
    }
  }

  return NextResponse.json({
    vercel: Boolean(process.env.VERCEL),
    vercelEnv: process.env.VERCEL_ENV ?? null,
    adminEnvConfigured: adminEnvOk,
    missingAdminEnv: missingAdmin,
    dbEnvConfigured: dbEnvOk,
    dbPortSet: Boolean(process.env.DB_PORT?.trim()),
    dbInstanceSet: Boolean(
      process.env.DB_INSTANCE?.trim() || process.env.DB_SERVER?.includes('\\'),
    ),
    dbConnected,
    dbError,
  });
}
