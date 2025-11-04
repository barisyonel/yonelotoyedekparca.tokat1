# 🔗 Vercel GitHub Bağlantısı Kontrolü

## 📊 Şu Anki Durum

✅ **GitHub'a Push Edildi:**
- Main branch güncel
- Tüm değişiklikler GitHub'da
- Repository: https://github.com/barisyonel/YonelTicaret

## 🔍 Vercel Görecek mi?

### CEVAP: **Eğer Vercel projeniz GitHub'a bağlıysa EVET, görecek!**

## ⚠️ ÖNEMLİ: Vercel GitHub'a Bağlı mı?

Vercel'in GitHub'a bağlı olması gerekiyor. Kontrol etmek için:

### 1. Vercel Dashboard'a Gidin
https://vercel.com/dashboard

### 2. Project'inizi Seçin
- Projenizi bulun ve tıklayın

### 3. Settings > Git Sekmesine Gidin
- Project Settings'e tıklayın
- "Git" sekmesine gidin

### 4. Repository Kontrolü
**Şunlardan biri görünmeli:**
- ✅ **"Connected to GitHub"** → Bağlı! Vercel görecek
- ❌ **"Not connected"** veya **"Import Git Repository"** → Bağlı değil! Bağlamanız gerekiyor

## ✅ Eğer Bağlıysa (İdeal Durum)

Vercel **otomatik olarak**:
1. ✅ GitHub push'unu algılayacak (webhook sayesinde)
2. ✅ 1-2 dakika içinde build başlatacak
3. ✅ 3-7 dakika içinde production'a deploy edecek

**Kontrol Etmek İçin:**
- Vercel Dashboard > Deployments
- Yeni bir deployment görünmeli
- Status: "Building" veya "Ready"

## ❌ Eğer Bağlı Değilse (Manuel Bağlama Gerekli)

### Nasıl Bağlanır?

1. **Vercel Dashboard > Add New Project**
2. **"Import Git Repository"** seçin
3. **Repository Seçin:** `barisyonel/YonelTicaret`
4. **Framework:** Next.js (otomatik algılanacak)
5. **Root Directory:** `./` (varsayılan)
6. **Production Branch:** `main`
7. **Environment Variables** ekleyin (ÇOK ÖNEMLİ!)
8. **Deploy** butonuna tıklayın

### Environment Variables (Zorunlu!)

**Project Settings > Environment Variables** bölümüne şunları ekleyin:

```bash
DB_SERVER=your-server
DB_NAME=your-database
DB_USER=your-user
DB_PASSWORD=your-password
DB_PORT=1433
JWT_SECRET=your-secret-key-min-32-chars
JWT_ISSUER=https://yonelotoyedekparca.com
JWT_AUDIENCE=https://yonelotoyedekparca.com
ADMIN_SECRET_KEY=your-admin-secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_WHATSAPP_NUMBER=905542597273
NODE_ENV=production
```

⚠️ **Her variable'ı Production, Preview ve Development için ekleyin!**

## 🔄 Webhook Kontrolü

GitHub'da webhook'un aktif olduğunu kontrol edin:

1. **GitHub Repository:** https://github.com/barisyonel/YonelTicaret
2. **Settings > Webhooks** sekmesine gidin
3. **Vercel webhook'u görünmeli:**
   - URL: `https://api.vercel.com/v1/integrations/deploy/...`
   - Events: Push, Pull request
   - Status: Active ✅

## 📊 Sonuç

| Durum | Vercel Görecek mi? | Ne Yapmalı? |
|-------|-------------------|-------------|
| ✅ Bağlı | **EVET** | Hiçbir şey, otomatik deploy edecek |
| ❌ Bağlı Değil | **HAYIR** | Manuel olarak bağlamanız gerekiyor |

## 🎯 Şimdi Ne Yapmalısınız?

1. **Vercel Dashboard'a gidin:** https://vercel.com/dashboard
2. **Project'inizi kontrol edin**
3. **Settings > Git** sekmesine bakın
4. **Bağlı mı?** → Bekleyin, otomatik deploy edilecek
5. **Bağlı değil mi?** → Yukarıdaki adımları takip edin

---

**Kontrol Linkleri:**
- Vercel Dashboard: https://vercel.com/dashboard
- GitHub Repository: https://github.com/barisyonel/YonelTicaret
- Vercel Deployments: https://vercel.com/dashboard → Project → Deployments

