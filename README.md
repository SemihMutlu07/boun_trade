# 📦 boun_trade

**Boğaziçi Öğrencileri için Kolay ve Güvenli Takas Platformu**

Günümüzde birçok öğrenci için maddi kaynaklar kısıtlı olabilir. boun_trade, öğrencilerin para harcamadan ihtiyaçlarını karşılamaları için tasarlanmış bir **takas sistemidir**. Gıda, kıyafet, elektronik gibi ürünleri kolayca ilan vererek ve diğer öğrencilerle takas yaparak kullanabilirsiniz.

Giriş sadece **@boun.edu.tr** mail adresleriyle yapılabilir. Bu sayede yalnızca Boğaziçi öğrencileri platformda yer alabilir.

---

## ✨ Öne Çıkan Özellikler

- 📄 E-posta ile giriş (yalnızca `@boun.edu.tr`)
- 📅 Ürün ekleme (görsel destekli)
- 🔍 Kategori ve başlığa göre filtreleme
- 🔄 Takas teklifi gönderme
- 💬 Teklif içi yorum yapma (chat)
- ✅ Teklif kabul/red sistemleri
- 🛡️ RLS ile güvenli veritabanı

---

## 🚀 Canlı Sürüm

> _Deploy edildikten sonra buraya link eklenebilir_

---

## 💡 Teknolojiler

- **Frontend**: Next.js (App Router, Client Components), Tailwind CSS
- **Backend**: Supabase (Auth, DB, Storage)
- **Kimlik Doğrulama**: Supabase Email Magic Link
- **Depolama**: Supabase Public Buckets

---

## 🔧 Yerel Kurulum

### 1. Reposu Klonla:
```bash
git clone https://github.com/SemihMutlu07/boun_trade.git
cd boun_trade
```

### 2. Bağımlılıkları Yükle:
```bash
npm install
```

### 3. `.env.local` Oluştur:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```
(Supabase panelinden alabilirsiniz)

### 4. Uygulamayı Başlat:
```bash
npm run dev
```

---

## 📂 Proje Yapısı

```
src/
├─ app/
│  ├─ page.tsx
│  ├─ login/
│  ├─ add-product/
│  ├─ exchange/
│  ├─ my-offers/
├─ components/
│  ├─ ProductCard.tsx
│  ├─ OfferModal.tsx
│  ├─ OfferChat.tsx
├─ lib/
│  ├─ supabase.ts
```

---

## 👥 Katkıda Bulunmak

Proje Boğaziçi öğrencilerine açıktır. Katkıda bulunmak isterseniz, forklayarak PR gönderebilir veya issue açabilirsiniz.

---

## 📄 Lisans
MIT

---

_Sevgiyle geliştirildi ❤️ Boğaziçi topluluğu için - Semih_
