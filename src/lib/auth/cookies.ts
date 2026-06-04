import { cookies } from 'next/headers';

const TOKEN_NAME = 'auth_token';
const MAX_AGE = 60 * 60 * 24; // 1 day

// Set auth cookie
export async function setAuthCookie(token: string) {
  const isProd = process.env.NODE_ENV === 'production';
  (await cookies()).set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: MAX_AGE,
    path: '/',
    // www ve apex (yonelotoyedekparca.com) arasında oturum paylaşımı
    ...(isProd ? { domain: '.yonelotoyedekparca.com' } : {}),
  });
}

// Get auth cookie
export async function getAuthCookie(): Promise<string | undefined> {
  return (await cookies()).get(TOKEN_NAME)?.value;
}

// Delete auth cookie
export async function deleteAuthCookie() {
  const isProd = process.env.NODE_ENV === 'production';
  (await cookies()).delete({
    name: TOKEN_NAME,
    path: '/',
    ...(isProd ? { domain: '.yonelotoyedekparca.com' } : {}),
  });
}

