/**
 * Vercel/deploy ortamında DB erişilemezken veya hızlı kurulum için
 * ADMIN_USERNAME + ADMIN_PASSWORD ile giriş (server-only env).
 */

function readAdminUsername(): string | undefined {
  return process.env.ADMIN_USERNAME?.trim() || undefined;
}

function readAdminPassword(): string | undefined {
  const pass = process.env.ADMIN_PASSWORD;
  if (pass === undefined || pass === null) return undefined;
  return pass;
}

export function verifyEnvAdminCredentials(
  username: string,
  password: string,
): boolean {
  const envUser = readAdminUsername();
  const envPass = readAdminPassword();

  if (!envUser || envPass === undefined) {
    return false;
  }

  return username.trim() === envUser && password === envPass;
}

export function hasEnvAdminCredentials(): boolean {
  const user = readAdminUsername();
  const pass = readAdminPassword();
  return Boolean(user && pass !== undefined && pass.length > 0);
}

/** Vercel log / hata mesajı için (değer sızdırmaz) */
export function getMissingAdminEnvVars(): string[] {
  const missing: string[] = [];
  if (!readAdminUsername()) missing.push('ADMIN_USERNAME');
  if (readAdminPassword() === undefined || readAdminPassword() === '') {
    missing.push('ADMIN_PASSWORD');
  }
  return missing;
}
