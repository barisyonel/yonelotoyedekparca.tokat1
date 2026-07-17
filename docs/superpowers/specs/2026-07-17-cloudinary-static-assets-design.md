# Design: Statik görselleri Cloudinary’ye taşıma

**Tarih:** 2026-07-17  
**Durum:** Onaylı (kullanıcı: devam)

## Kısıtlar

- Arayüz / layout / CSS değişmez; sadece görsel `src` kaynakları değişir.
- Mimari aynı: Next.js + MSSQL + mevcut Cloudinary ürün upload akışı.
- Hosting taşıma yok (Render/Railway yok).
- `favicon.ico`, `robots.txt`, Google doğrulama, `.htaccess`, `.well-known` yerelde kalır.
- Kullanılmayan `img/` (ekran görüntüleri) sitede yok; repodan temizlenebilir, Cloudinary’ye yüklenmez.

## Hedef

`public/` içindeki neredeyse tüm görselleri Cloudinary `yonel-static/` klasörüne taşımak; kodda merkezi map ile çekmek; repo ve deploy ağırlığını azaltmak; CDN + `f_auto,q_auto` ile daha hafif teslimat.

## Yaklaşım

1. Script ile signed upload (`CLOUDINARY_API_KEY` + `CLOUDINARY_API_SECRET`).
2. `src/lib/cloudinaryAssets.ts` — eski path → güvenli delivery URL.
3. Navbar, home brands, blog, slider defaults, layout icons/OG, manifest → map.
4. Doğrulama sonrası büyük yerel dosyaları silmek.

## Yerelde kalanlar

- `public/favicon.ico`
- `public/robots.txt`, `public/manifest.json` (icon URL’leri Cloudinary’ye güncellenir)
- `public/google*.html`, `public/.htaccess`, `public/.well-known/*`, `public/404.html`

## Doğrulama

- Ana sayfa logo + marka kartları + hero görünür.
- Blog kapak görselleri yüklenir.
- OG/twitter meta Cloudinary URL.
- `npm run build` geçer.
- `public` görsel boyutu belirgin düşer.
