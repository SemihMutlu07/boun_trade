# 📦 boun_trade

**A student-to-student barter platform built for Boğaziçi University** students to easily exchange food, clothing, electronics, and more.

Built with **Next.js**, **Supabase**, and **Tailwind CSS**.

---

## ✨ Features

- 📄 User authentication (only @boun.edu.tr emails allowed)
- 📤 Product upload with image support (stored on Supabase)
- 🔍 Search and filter products by category and keyword
- 🔄 Offer system to propose trades between users
- 💬 Built-in chat per offer for negotiation
- ✅ Offer acceptance & rejection
- 🛡️ Row-level security for data protection

---

## 🚀 Live Demo

> _Add your Vercel link here once deployed._

---

## 🛠️ Tech Stack

- **Frontend**: Next.js (App Router, Client Components), Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **Auth**: Supabase Email Magic Link (@boun.edu.tr restricted)
- **Storage**: Supabase Public Buckets

---

## 🔧 Environment Setup

### 1. Clone the repo:
```bash
git clone https://github.com/SemihMutlu07/boun_trade.git
cd boun_trade
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

You can find these in Supabase → Settings → API.

### 4. Run locally:
```bash
npm run dev
```

---

## 📂 Project Structure

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

## 🤝 Contributing
This project is open to contributions by Boğaziçi students. If you'd like to improve it, feel free to fork, PR, or open issues.

---

## 📜 License
MIT

---

_Developed with ❤️ by Semih for the Boğaziçi community._
