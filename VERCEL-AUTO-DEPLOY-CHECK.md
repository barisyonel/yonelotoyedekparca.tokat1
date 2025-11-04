# 🔍 Vercel Otomatik Deployment Kontrolü

## ✅ Vercel Otomatik Algılayacak mı?

**CEVAP:** Eğer Vercel projeniz GitHub'a bağlıysa ve ayarlar doğruysa **EVET**, otomatik algılayacak!

## 📋 Kontrol Listesi

### 1. Vercel Projesi GitHub'a Bağlı mı?

**Kontrol Etmek İçin:**
1. Vercel Dashboard'a gidin: https://vercel.com/dashboard
2. Project'inizi seçin
3. **Settings > Git** sekmesine gidin
4. **Repository** bölümünde `barisyonel/YonelTicaret` görünmeli
5. ✅ Bağlıysa → **Otomatik algılayacak**
6. ❌ Bağlı değilse → **Manuel bağlamanız gerekiyor**

### 2. Auto-Deploy Aktif mi?

**Kontrol Etmek İçin:**
1. Vercel Dashboard > Project Settings > Git
2. **"Auto-deploy"** seçeneği **AÇIK** olmalı
3. ✅ Açıksa → **Otomatik deploy edecek**
4. ❌ Kapalıysa → **Manuel deploy etmeniz gerekiyor**

### 3. Production Branch Doğru mu?

**Kontrol Etmek İçin:**
1. Vercel Dashboard > Project Settings > Git
2. **Production Branch:** `main` olmalı
3. ✅ Doğruysa → **Main branch push'larını deploy edecek**
4. ❌ Yanlışsa → **Ayarları değiştirin**

## 🚀 İlk Kez Bağlıyorsanız

Eğer Vercel projesi henüz GitHub'a bağlı değilse:

1. **Vercel Dashboard > Add New Project**
2. **Import Git Repository** seçin
3. `barisyonel/YonelTicaret` repository'sini seçin
4. **Framework:** Next.js (otomatik algılanacak)
5. **Root Directory:** `./` (varsayılan)
6. **Production Branch:** `main`
7. **Environment Variables** ekleyin (önemli!)
8. **Deploy** butonuna tıklayın

## ⏱️ Ne Zaman Algılanacak?

**GitHub'a push yaptıktan sonra:**
- ✅ **Anında:** Vercel webhook ile push'u algılar
- ✅ **1-2 dakika içinde:** Build başlar
- ✅ **3-7 dakika içinde:** Deployment tamamlanır

## 🔍 Deployment Durumunu Kontrol Etme

### Vercel Dashboard'da:
1. Project'inize gidin
2. **Deployments** sekmesine tıklayın
3. En üstteki deployment'ı kontrol edin:
   - **Status:** "Building" veya "Ready"
   - **Branch:** `main`
   - **Commit:** Son commit mesajınız
   - **Time:** Az önce

### GitHub'da:
1. Repository'nize gidin
2. **Settings > Webhooks** sekmesine bakın
3. Vercel webhook'u görünmeli
4. Son delivery'yi kontrol edin

## ⚠️ Sorun Olursa

### Vercel Push'u Algılamıyorsa:

1. **Webhook Kontrolü:**
   - GitHub > Settings > Webhooks
   - Vercel webhook'u var mı?
   - Son delivery başarılı mı?

2. **Manuel Deploy:**
   - Vercel Dashboard > Deployments
   - "Redeploy" butonuna tıklayın
   - Veya "Deploy" > "Deploy from Git" seçin

3. **Repository Yeniden Bağlama:**
   - Settings > Git > Disconnect
   - Tekrar Connect edin

## ✅ Şu Anki Durum

**Main Branch:** ✅ Güncel ve push edildi  
**GitHub:** ✅ Değişiklikler var  
**Vercel:** ⏳ Kontrol edilmeli (Dashboard'da bakın)

## 🎯 Sonuç

**Eğer Vercel projeniz GitHub'a bağlıysa:**
- ✅ **EVET**, otomatik algılayacak
- ✅ 1-2 dakika içinde build başlayacak
- ✅ 3-7 dakika içinde production'da olacak

**Eğer bağlı değilse:**
- ⚠️ Manuel olarak bağlamanız gerekiyor
- ⚠️ İlk deployment'ı manuel yapmanız gerekiyor

---

**Kontrol için:** https://vercel.com/dashboard

