# DevRum — Developer Productivity Measurement Platform for Scrum Teams

**DevRum** is a web-based application for measuring developer productivity in **Scrum** teams using data from **Azure DevOps**. This application is built with **Next.js** and integrates with the Azure DevOps API via OAuth 2.0.

DevRum is designed to help Scrum Masters, Project Managers, or development teams monitor story point achievements per sprint automatically and centrally.

---

## 🚀 Live Demo

The application can be accessed directly via the following link:

[https://devrum.vercel.app](https://devrum.vercel.app)

---

## 📁 Technology Structure

| Layer        | Technology                     |
| ------------ | ----------------------------- |
| Frontend     | Next.js (React), Tailwind CSS |
| Backend API  | Next.js API Routes (Node.js)  |
| OAuth & Data | Azure DevOps REST API         |
| Deployment   | Vercel                        |
| Repo & CI/CD | GitHub                        |

---

## 🛠️ Main Features

- 🔐 Login via OAuth 2.0 to Azure DevOps
- 📊 Productivity visualization based on story points per sprint
- 📂 Retrieve data from Azure Boards (Work Items)
- 🔄 Direct integration with Azure DevOps organization & project
- ⚡ Real-time processing using Next.js API routes

---

## 📦 How to Run Locally

```bash
# 1. Clone repo
git clone https://github.com/username/devrum.git
cd devrum

# 2. Install dependencies
npm install

# 3. Create config file
cp .env.local
# Edit .env.local with Azure DevOps credentials

credentials for .env.local are as follows:
AZURE_AD_CLIENT_ID=           # Client ID from Azure App Registration
AZURE_AD_CLIENT_SECRET=       # Client Secret from Azure App Registration
AZURE_AD_TENANT_ID=           # Tenant ID of Azure organization
REDIRECT_URI=http://localhost:3000/api/auth/callback  #Value can be adjusted if deployed
LOGOUT_REDIRECT_URI=http://localhost:3000/            #Value can be adjusted if deployed

# 4. Run locally
npm run dev

```
---

## 📚 Related Documentation
Below are official documentation references for each core technology used in this project:

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


---
