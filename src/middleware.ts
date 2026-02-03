// Middleware - Route Protection & SEO Redirects
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Trailing slash redirect - SEO için tutarlı URL yapısı
  // Sadece root ve dosya uzantılı URL'ler hariç
  if (
    pathname.length > 1 &&
    pathname.endsWith('/') &&
    !pathname.match(/\.(html|xml|json|txt|ico|png|jpg|jpeg|gif|svg|webp|css|js)$/i)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(0, -1);
    return NextResponse.redirect(url, 301);
  }

  // /admin/* yollarını koru
  if (pathname.startsWith('/admin')) {
    // Cookie'den token al
    const token = request.cookies.get('auth_token')?.value;

    // Token yoksa login'e yönlendir
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Token'ı doğrula
    const payload = await verifyToken(token);
    if (!payload) {
      // Geçersiz token, login'e yönlendir
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Role kontrolü - sadece admin girebilir
    if (payload.role !== 'admin') {
      // Yetkisiz erişim
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Her şey OK, devam et
    return NextResponse.next();
  }

  // /auth/login sayfasını kontrol et
  // Eğer zaten login olduysa /admin'e yönlendir
  if (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register')) {
    const token = request.cookies.get('auth_token')?.value;

    if (token) {
      const payload = await verifyToken(token);
      if (payload && payload.role === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    }
  }

  return NextResponse.next();
}

// Middleware'in hangi yollarda çalışacağını belirt
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)',
  ],
};
