# Design: Güvenlik, Kategori SEO, Altyapı (kod/CI)

**Tarih:** 2026-07-17  
**Proje:** Yönel Oto Yedek Parça (`yonel-nextjs`)  
**Durum:** Onay bekliyor

## Kısıtlar (zorunlu)

- Mevcut mimari korunur: Next.js App Router, Server Actions, Repository + MSSQL, JWT cookie auth, Vercel.
- Arayüz / görünüm değişmez: komponent layout, CSS, admin UI, public sayfa tasarımı dokunulmaz.
- Hosting taşıma yok: Render / Railway / always-on migrate yapılmaz.
- Davranış bozulmaz: login, katalog, admin CRUD, Cloudinary, WhatsApp CTA aynı kalır.
- Sadece meta etiketleri, sunucu tarafı koruma, dokümantasyon, CI ve birim testler eklenir/düzeltilir.

## Hedefler

1. Admin Server Action ve hassas API yüzeylerini oturum doğrulamasıyla kilitlemek.
2. `/urunler/...` kategori sayfalarına dinamik, kategoriye özel SEO metadata vermek.
3. Altyapıyı kod/CI/docs/test ile sağlamlaştırmak (Vercel + mevcut MSSQL aynı kalır).

---

## 1. Güvenlik

### 1.1 Merkezi `requireAdmin`

**Yeni dosya:** `src/lib/auth/requireAdmin.ts`

- `getAuthCookie()` + `verifyToken()` kullanır.
- Token yok / geçersiz / `role !== 'admin'` → `{ ok: false, error: 'Yetkisiz' }` (veya throw edilen tutarlı sonuç).
- Başarılı → `{ ok: true, user: TokenPayload }`.

**Kullanım:** Aşağıdaki dosyalardaki tüm export edilen server action’ların başında:

- `src/app/admin/products/actions.ts`
- `src/app/admin/categories/actions.ts`
- `src/app/admin/sliders/actions.ts`
- `src/app/admin/home-sliders/actions.ts`

Mutasyon (create/update/delete) ve okuma (get*) action’ları dahil — admin paneli dışında çağrılmamalılar.

**UI etkisi:** Yok. Admin sayfaları zaten middleware ile korunuyor; ek kontrol yalnızca Server Action POST çağrılarını kapatır.

### 1.2 JWT secret (fail-hard)

**Dosya:** `src/lib/auth/auth.ts`

- Production (`NODE_ENV === 'production'` veya `VERCEL === '1'`) ortamında `JWT_SECRET` yoksa veya placeholder ise token üretme/doğrulama başlamadan hata.
- Development’ta mevcut fallback kalabilir (yerel DX bozulmasın) veya uyarı log’u; production’da asla hardcoded secret kullanılmaz.

### 1.3 Register

**Dosya:** `src/app/auth/actions.ts` — `register`

- `ADMIN_SECRET_KEY` boşsa register reddedilir.
- İsteğe bağlı: production’da register’ı tamamen kapat (`REGISTER_ENABLED=false` varsayılan veya sadece secret + env flag).
- Tercih: Production’da `register` yalnızca `ADMIN_SECRET_KEY` doğruysa çalışır (bugünkü gibi) + secret boşsa kesin red; UI eklenmez.

### 1.4 Login rate limit

**Dosya:** `src/app/auth/actions.ts` veya `src/lib/auth/loginRateLimit.ts`

- Basit in-memory map: username (normalize) + kısa pencere (örn. 15 deneme / 15 dk).
- Serverless’ta instance başına çalışır; mükemmel değildir ama brute-force’u yavaşlatır.
- UI mesajı: mevcut hata stilinde “Çok fazla deneme. Lütfen sonra tekrar deneyin.”

### 1.5 API route’lar

- `POST /api/admin/fill-product-descriptions` — mevcut `x-admin-key` kontrolü kalır; secret boşsa 401.
- `GET /api/health/db` — mevcut `?key=` kontrolü kalır; secret boşsa 401 (zaten var, dokümante edilir).
- Görünüm değişmez.

### 1.6 Bilinçli olarak yapılmayanlar

- Middleware matcher’a API ekleme (health/admin API key modeli ayrı kalır).
- Captcha / Redis rate limit (kapsam dışı).
- Cookie domain / admin UI değişikliği yok.

---

## 2. Kategori bazlı SEO metadata

### 2.1 Sorun

`src/app/urunler/[[...slug]]/page.tsx` içindeki `generateMetadata` slug okumuyor; tüm kategori URL’leri aynı generic title/description kullanıyor.

### 2.2 Çözüm

`generateMetadata({ params })`:

1. Kategori ağacını mevcut repository/cache yolundan al (mümkünse `fetchUrunlerPageData` veya hafif categories-only fetch — çift ağır ürün sorgusu istemiyorsak categories + `resolveCategoryFromSlug`).
2. `resolveCategoryFromSlug(params.slug, categories)` ile `activeCategory` / `parentCategory` çöz.
3. Metadata üret:

| Durum | Title (örnek) | Description (örnek) |
|-------|---------------|---------------------|
| Kök `/urunler` | Yönel Oto Yedek Parça Kataloğu | Mevcut / hafif iyileştirilmiş genel açıklama |
| Parent marka (örn. İveco) | İveco Yedek Parça \| Yönel Oto | `{Name} yedek parçaları. Orijinal ve uyumlu alternatifler, Türkiye geneli tedarik.` |
| Alt kategori (örn. Daily) | İveco Daily Yedek Parça \| Yönel Oto | `{Parent} {Child} için yedek parçalar...` |

Ek alanlar:

- `alternates.canonical` → path-only (`/urunler` veya `/urunler/{slug-path}`), querystring yok.
- `openGraph.title` / `openGraph.description` / `openGraph.url` aynı metinlerle.
- Arama (`?search=`) veya sayfa (`?page=`) canonical’ı değiştirmez.

### 2.3 Yardımcı

İsteğe bağlı küçük helper: `src/lib/catalog/buildUrunlerMetadata.ts` — title/description/canonical üretimi test edilebilir olsun.

### 2.4 UI etkisi

Yok. Sadece `<title>`, meta description, OG, canonical — sayfa layout/komponentleri değişmez. Breadcrumb görsel metni aynı kalır (istersek ileride ayrı iş).

### 2.5 Yapılmayanlar

- Categories tablosuna MetaTitle kolonları / admin SEO formu (ileri faz).
- Görsel redesign, yeni kartlar, hero değişikliği.

---

## 3. Altyapı (kod / CI / docs / test)

### 3.1 README + env.example

- README’deki bozuk env örneğini `env.example.txt` ile hizala.
- Yapı diyagramını gerçek klasörlere güncelle (`urunler`, API route’ların varlığı).
- Vercel + MSSQL notunu koru; Render/Railway’i “zorunlu migrate” olarak önerme — mevcut README alternatifleri bilgilendirme olarak kalabilir veya yumuşatılır.
- “API yok” ifadesini düzelt: asıl CRUD Server Actions; sağlık/admin yardımcı API’ler var.

### 3.2 CI

**Dosya:** `.github/workflows/vercel-deploy.yml`

- `npm run lint || true` → `npm run lint` (fail etsin).
- Workflow adı yanıltıcıysa “CI” / “Build Check” yapılabilir; Vercel deploy adımı eklenmez (mevcut Git→Vercel akışı bozulmaz).
- Build env: DB yokken build’in skip ettiği mevcut `isDatabaseSkippedAtBuild` davranışı korunur.

### 3.3 Testler (smoke)

- Vitest ekle (`npm test` script).
- Kapsam (UI/E2E yok):
  - `slugify` / `resolveCategoryFromSlug` birkaç senaryo
  - `buildUrunlerMetadata` (veya eşdeğeri) title/canonical
  - `requireAdmin` mantığı: mock cookie/token ile yetkisiz / yetkili
- Mevcut sayfa komponentlerine dokunulmaz.

### 3.4 DB / Vercel (kod içi, migrate yok)

- `db.ts` davranışını bozmadan: gerekirse sadece yorum / `env.example` netliği (`DB_PORT` zorunluluğu Vercel’de).
- Pool max / timeout değerlerini agresif değiştirme — stabilite riski; sadece dokümantasyon.

### 3.5 Bilinçli olarak yapılmayanlar

- Render / Railway / Docker host taşıma.
- `/products` büyük silme (riskli; SEO redirect’ler duruyor) — bu turda kapsam dışı veya yalnızca kullanılmayan dead import varsa minimal.
- Analytics, blog CMS, fiyat/stok.

---

## 4. Dosya değişim listesi (tahmini)

| Dosya | Değişiklik |
|-------|------------|
| `src/lib/auth/requireAdmin.ts` | Yeni |
| `src/lib/auth/loginRateLimit.ts` | Yeni (opsiyonel ayrı dosya) |
| `src/lib/auth/auth.ts` | Prod JWT_SECRET zorunluluğu |
| `src/app/admin/*/actions.ts` (4 dosya) | `requireAdmin()` |
| `src/app/auth/actions.ts` | Rate limit + register sıkılaştırma |
| `src/lib/catalog/buildUrunlerMetadata.ts` | Yeni |
| `src/app/urunler/[[...slug]]/page.tsx` | `generateMetadata` — sadece metadata fonksiyonu |
| `README.md`, `env.example.txt` | Düzeltme |
| `.github/workflows/vercel-deploy.yml` | Lint fail |
| `package.json` | `vitest`, `test` script |
| `src/**/*.test.ts` | Smoke testler |

## 5. Doğrulama planı

1. `npm run lint` geçer.
2. `npm test` geçer.
3. `npm run build` geçer (DB’siz build skip davranışı bozulmaz).
4. Manuel: `/auth/login` → `/admin` ürün ekleme/silme çalışır.
5. Manuel: oturumsuz Server Action çağrısı yetkisiz döner (mümkünse test ile).
6. Manuel: `/urunler/iveco/daily` sayfa kaynağında kategori title/description; görsel aynı.
7. Ana sayfa / ürün detay / WhatsApp butonu görsel regresyon yok.

## 6. Riskler ve azaltma

| Risk | Azaltma |
|------|---------|
| Admin action’larda yanlışlıkla UI kırılması | Sadece actions.ts; form komponentlerine dokunma |
| Metadata için ekstra DB yükü | Categories cache’li fetch; ürün listesini metadata’da çekme |
| Lint fail CI’ı kırmızıya çeker | Önce lokal lint; mevcut hataları minimal fix |
| Prod JWT_SECRET yoksa site login bozulur | Deploy öncesi env kontrolü; README uyarısı |

---

## Onay

Bu spec onaylandıktan sonra implementation plan yazılacak ve kod uygulanacak.

Onay kutuları:

- [ ] Güvenlik (requireAdmin + JWT + rate limit + register)
- [ ] Kategori SEO metadata (görünüm değişmez)
- [ ] Altyapı: README/CI/test (Render/Railway yok)
