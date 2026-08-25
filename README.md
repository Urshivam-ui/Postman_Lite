# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

# ⚡ Postman Lite — Lightweight API Testing Tool

**Postman Lite** is a minimal, blazing-fast, browser-based API testing client designed as a lightweight alternative to heavy applications like Postman. Built for developers who need quick request and response inspection without the bloat.

🔗 **Live Preview:** [Add your deployed link here]  
📦 **GitHub Repository:** [github.com/Urshivam-ui/Postman_Lite](https://github.com/Urshivam-ui/Postman_Lite)

---

## ✨ Features

- **Fast Request Builder:** Quickly construct `GET`, `POST`, `PUT`, `DELETE`, and other HTTP requests.
- **Custom Headers & Params:** Easily append query parameters and authorization headers.
- **JSON Response Inspection:** Clean formatted output viewer for payload responses, status codes, and response times.
- **Minimalist UX:** Zero bloat, instant load times, and a modern dark UI.

---

## 🛠️ Tech Stack

- **Frontend:** React.js / Vanilla JS (depending on your setup)
- **Styling:** Tailwind CSS
- **Build Tool:** Vite
- **Language:** TypeScript / JavaScript

---

## 🚀 Getting Started Locally

Follow these steps to run Postman Lite on your local machine:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Urshivam-ui/Postman_Lite.git](https://github.com/Urshivam-ui/Postman_Lite.git)
   cd Postman_Lite
