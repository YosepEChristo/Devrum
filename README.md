# DevRum — Developer Productivity Measurement Platform

**DevRum** adalah aplikasi berbasis web untuk mengukur produktivitas developer dalam tim Scrum menggunakan data dari **Azure DevOps**. Aplikasi ini dibangun dengan **Next.js** dan terintegrasi dengan API Azure DevOps melalui OAuth 2.0.

---

## 🚀 Live Demo

Aplikasi dapat langsung diakses melalui link berikut:

[https://devrum.vercel.app](https://devrum.vercel.app)

---

## 📁 Struktur Teknologi

| Layer        | Teknologi                     |
| ------------ | ----------------------------- |
| Frontend     | Next.js (React), Tailwind CSS |
| Backend API  | Next.js API Routes (Node.js)  |
| OAuth & Data | Azure DevOps REST API         |
| Deployment   | Vercel                        |
| Repo & CI/CD | GitHub                        |

---

## 🛠️ Fitur Utama

- 🔐 Login via OAuth 2.0 ke Azure DevOps
- 📊 Visualisasi produktivitas berdasarkan story point per sprint
- 📂 Mengambil data dari Azure Boards (Work Items)
- 🔄 Integrasi langsung dengan organisasi & project Azure DevOps
- ⚡ Real-time processing dengan API routes Next.js

---

## 📦 Cara Menjalankan Lokal

```bash
# 1. Clone repo
git clone https://github.com/username/devrum.git
cd devrum

# 2. Install dependency
npm install

# 3. Buat file konfigurasi
cp .env.example .env.local
# Edit .env.local dengan kredensial Azure DevOps

AZURE_AD_CLIENT_ID=           # Client ID dari Azure App Registration
AZURE_AD_CLIENT_SECRET=       # Client Secret dari Azure App Registration
AZURE_AD_TENANT_ID=           # Tenant ID organisasi Azure
REDIRECT_URI=http://localhost:3000/api/auth/callback  #Value bisa disesuaikan jika dideploy
LOGOUT_REDIRECT_URI=http://localhost:3000/            #Value bisa disesuaikan jika dideploy

# 4. Jalankan lokal
npm run dev
```
