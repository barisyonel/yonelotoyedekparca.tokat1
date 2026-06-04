'use server';

import AdminsRepository from '@/lib/repositories/AdminsRepository';
import { generateToken } from '@/lib/auth/auth';
import {
  hasEnvAdminCredentials,
  verifyEnvAdminCredentials,
  getMissingAdminEnvVars,
} from '@/lib/auth/adminCredentials';
import { setAuthCookie, deleteAuthCookie } from '@/lib/auth/cookies';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

function isNextRedirect(error: unknown): boolean {
  return (
    error !== null &&
    typeof error === 'object' &&
    'digest' in error &&
    String((error as { digest?: string }).digest).startsWith('NEXT_REDIRECT')
  );
}

async function completeLogin(username: string) {
  const token = await generateToken({
    username,
    role: 'admin',
  });

  await setAuthCookie(token);
  revalidatePath('/admin');
  return { success: true as const };
}

function buildDbLoginError(dbError: unknown): string {
  const missingAdmin = getMissingAdminEnvVars();

  if (hasEnvAdminCredentials()) {
    return 'Kullanıcı adı veya şifre hatalı. (Vercel: ADMIN_USERNAME / ADMIN_PASSWORD kontrol edin)';
  }

  if (missingAdmin.length > 0 && process.env.VERCEL) {
    return (
      `Admin giriş bilgileri Vercel'de yüklü değil (eksik: ${missingAdmin.join(', ')}). ` +
      'Settings → Environment Variables → Production işaretleyip yeniden Deploy edin. ' +
      'Geçici olarak DB üzerinden giriş de denendi ancak bağlantı kurulamadı.'
    );
  }

  const hint =
    process.env.VERCEL && !process.env.DB_PORT
      ? ' Vercel için DB_PORT (hosting TCP portu) eklemeniz gerekebilir; DB_SERVER içindeki \\INSTANCE serverless ortamda çalışmayabilir.'
      : '';

  return (
    'Veritabanına bağlanılamadı.' +
    hint +
    ' Vercel ortam değişkenlerinde DB_* ve ADMIN_USERNAME / ADMIN_PASSWORD tanımlayıp redeploy edin.'
  );
}

// POST - Login
export async function login(formData: FormData) {
  try {
    const username = (formData.get('username') as string)?.trim();
    const password = formData.get('password') as string;

    if (!username || !password) {
      return { success: false, error: 'Kullanıcı adı ve şifre gerekli.' };
    }

    // 1) Vercel env: ADMIN_USERNAME + ADMIN_PASSWORD (deploy için — DB gerekmez)
    if (hasEnvAdminCredentials()) {
      if (verifyEnvAdminCredentials(username, password)) {
        return await completeLogin(username);
      }
      return { success: false, error: 'Kullanıcı adı veya şifre hatalı.' };
    }

    if (process.env.VERCEL) {
      console.error(
        '[login] Vercel ortamında ADMIN_USERNAME/ADMIN_PASSWORD okunamadı. Eksik:',
        getMissingAdminEnvVars().join(', ') || '(bilinmiyor)',
      );
    }

    // 2) Veritabanındaki Admins tablosu (localhost / tam kurulum)
    try {
      const admin = await AdminsRepository.findByUsername(username);
      if (!admin) {
        return { success: false, error: 'Kullanıcı adı veya şifre hatalı.' };
      }

      const isValid = await AdminsRepository.verifyPassword(password, admin.PasswordHash);
      if (!isValid) {
        return { success: false, error: 'Kullanıcı adı veya şifre hatalı.' };
      }

      return await completeLogin(admin.Username);
    } catch (dbError) {
      if (isNextRedirect(dbError)) throw dbError;

      console.error('Login DB error:', dbError);

      return {
        success: false,
        error: buildDbLoginError(dbError),
      };
    }
  } catch (error) {
    if (isNextRedirect(error)) throw error;

    console.error('Login error:', error);
    return { success: false, error: 'Giriş yapılamadı. JWT_SECRET tanımlı mı kontrol edin.' };
  }
}

// POST - Register
export async function register(formData: FormData) {
  try {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const passwordRepeat = formData.get('passwordRepeat') as string;
    const secretKey = formData.get('secretKey') as string;

    // Validation
    if (!username || !password || !passwordRepeat || !secretKey) {
      return { success: false, error: 'Tüm alanlar zorunludur.' };
    }

    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      return { success: false, error: 'Geçersiz secret key.' };
    }

    if (password !== passwordRepeat) {
      return { success: false, error: 'Şifreler aynı olmalı.' };
    }

    // Check if username exists
    const existing = await AdminsRepository.findByUsername(username);
    if (existing) {
      return { success: false, error: 'Bu kullanıcı adı zaten kullanılıyor.' };
    }

    // Create admin
    await AdminsRepository.create({ Username: username, Password: password });

    return { success: true, message: 'Admin başarıyla kaydedildi. Giriş yapabilirsiniz.' };
  } catch (error) {
    console.error('Register error:', error);
    return { success: false, error: 'Kayıt olunamadı.' };
  }
}

// POST - Logout
export async function logout() {
  await deleteAuthCookie();
  revalidatePath('/');
  redirect('/auth/login');
}
