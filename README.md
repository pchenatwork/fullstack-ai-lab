# AutoRepair AI

An AI-powered service manual assistant built with RAG (Retrieval-Augmented Generation). Ask natural language questions about your vehicle and get answers grounded in the actual service manual content.

🔗 **[Live Demo](https://polite-flower-0a8dd360f.7.azurestaticapps.net)**

![Azure](https://img.shields.io/badge/Azure-AI%20Foundry-0078D4?logo=microsoftazure)
![.NET](https://img.shields.io/badge/.NET-9.0-512BD4?logo=dotnet)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)

---

## Demo

Ask questions like:
- *"What is the torque spec for the cylinder head bolts?"*
- *"What does diagnostic code P2647 mean?"*
- *"Where is the fuse box located?"*

---

## Tech Stack

- **Frontend** — React 18 + Vite, hosted on Azure Static Web Apps
- **Backend** — C# ASP.NET Core 9 Web API, hosted on Render.com
- **AI** — Azure AI Foundry (GPT-4.1-mini + text-embedding-3-small)
- **Search** — Azure AI Search, Hybrid RAG (BM25 + Vector)
- **Storage** — Azure Blob Storage (PDF manuals)
- **Secrets** — Azure Key Vault

---

## Getting Started

### Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20 LTS](https://nodejs.org)
- Azure account with AI Foundry, AI Search, Blob Storage, and Key Vault provisioned

### Backend

```bash
cd AutoRepair.Api
cp appsettings.Development.json.example appsettings.Development.json
# Fill in your Azure credentials

dotnet run
# https://localhost:5001/scalar/v1
```

### Frontend

```bash
cd autorepair-ui
cp .env.example .env.local
# Set VITE_API_BASE_URL=https://localhost:5001

npm install
npm run dev
# http://localhost:5173
```

---

## License

MIT