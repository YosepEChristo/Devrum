# DevRum — Developer Productivity Measurement Platform for Scrum Teams

**DevRum** adalah aplikasi berbasis web untuk mengukur produktivitas developer dalam tim **Scrum** menggunakan data dari **Azure DevOps**. Aplikasi ini dibangun dengan **Next.js** dan terintegrasi dengan API Azure DevOps melalui OAuth 2.0.

DevRum dirancang untuk memudahkan Scrum Master, Project Manager, atau tim pengembang dalam memantau capaian story point per sprint secara otomatis dan terpusat.


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

kredensial untuk .env.local sebagai beriut:
AZURE_AD_CLIENT_ID=           # Client ID dari Azure App Registration
AZURE_AD_CLIENT_SECRET=       # Client Secret dari Azure App Registration
AZURE_AD_TENANT_ID=           # Tenant ID organisasi Azure
REDIRECT_URI=http://localhost:3000/api/auth/callback  #Value bisa disesuaikan jika dideploy
LOGOUT_REDIRECT_URI=http://localhost:3000/            #Value bisa disesuaikan jika dideploy

# 4. Jalankan lokal
npm run dev
```

## 📚 Dokumentasi Terkait

Berikut referensi dokumentasi resmi dari masing-masing teknologi utama yang digunakan dalam proyek ini:

- 📘 **Next.js Documentation**  
  https://nextjs.org/docs

- 📘 **Next.js Environment Variables Guide**  
  https://nextjs.org/docs/app/building-your-application/configuring/environment-variables

- 📘 **Azure DevOps REST API Reference**  
  https://learn.microsoft.com/en-us/rest/api/azure/devops

- 📘 **Azure App Registration (OAuth 2.0)**  
  https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app

- 📘 **OAuth 2.0 Authorization Code Flow (Microsoft Identity Platform)**  
  https://learn.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow

- 📘 **Tailwind CSS Documentation**  
  https://tailwindcss.com/docs

- 📘 **Vercel Documentation**  
  https://vercel.com/docs

- 📘 **GitHub Actions Documentation**  
  https://docs.github.com/en/actions
