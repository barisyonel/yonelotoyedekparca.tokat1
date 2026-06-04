/**
 * Vercel/deploy ortamında DB erişilemezken veya hızlı kurulum için
 * ADMIN_USERNAME + ADMIN_PASSWORD ile giriş (server-only env).
 */
export function verifyEnvAdminCredentials(
  username: string,
  password: string,
): boolean {
  const envUser = process.env.ADMIN_USERNAME?.trim();
  const envPass = process.env.ADMIN_PASSWORD;

  if (!envUser || !envPass) {
    return false;
  }

  return username.trim() === envUser && password === envPass;
}

export function hasEnvAdminCredentials(): boolean {
  return Boolean(process.env.ADMIN_USERNAME?.trim() && process.env.ADMIN_PASSWORD);
}
