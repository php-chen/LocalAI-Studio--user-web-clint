# LocalAI Studio - User Client

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)](package.json)
[![React Version](https://img.shields.io/badge/react-18.2-blue.svg)](package.json)

---

## 🌐 Language / 语言 / 言語 / 언어

| Language | Link |
|----------|------|
| 🇨🇳 简体中文 | [README_zh.md](README_zh.md) |
| 🇺🇸 English | [README_en.md](README_en.md) |
| 🇯🇵 日本語 | [README_ja.md](README_ja.md) |
| 🇰🇷 한국어 | [README_ko.md](README_ko.md) |

---

## 📖 Project Description

**LocalAI Studio - User Client** is a modern web application for AI-powered content creation, enabling users to generate images and videos from text prompts. Built with Vite + React + TypeScript, it provides an intuitive interface for creative workflows.

### Key Features

- 🎨 **AI Image Generation** - Create images from text prompts using various AI models
- 🎬 **AI Video Generation** - Generate videos with customizable parameters
- 📁 **Works Management** - Organize and manage all your creations
- 📚 **Material Library** - Store and manage creative assets
- 💎 **Points System** - Credit-based usage tracking
- 🔐 **Secure Authentication** - RSA-OAEP encrypted login with canvas verification

### Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 18.2 + TypeScript 5.5 |
| Build Tool | Vite 5.0 |
| Routing | React Router DOM 6.14 |
| UI Library | Ant Design 5.10 |
| State Management | Zustand 4.4 |
| HTTP Client | Axios 1.15 |
| Styling | Tailwind CSS 3.4 |
| Encryption | node-forge (RSA-OAEP) |

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/php-chen/LocalAI-Studio-User-Client.git
cd LocalAI-Studio-User-Client

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Build for Production

```bash
pnpm build
pnpm preview
```

---

## 📁 Project Structure

```
src/
├── api/                    # API client and definitions
│   ├── index.ts           # Axios instance, interceptors, auth APIs
│   └── openapi.json       # Backend API documentation
├── components/            # Reusable UI components
│   ├── CanvasVerify.tsx   # Canvas slider captcha
│   ├── Header.tsx         # Navigation header
│   ├── Footer.tsx         # Page footer
│   ├── WorksManagement.tsx # Works management card
│   ├── MaterialLibrary.tsx # Material library card
│   ├── ProgressBoard.tsx   # Progress dashboard
│   └── StyleRecommendation.tsx # Style recommendations
├── layouts/
│   └── MainLayout.tsx     # Main layout wrapper
├── pages/                 # Page components
│   ├── Home.tsx          # Home page
│   ├── ImageLab.tsx       # AI image generation lab
│   ├── VideoEngine.tsx    # AI video generation engine
│   ├── Works.tsx          # Works management center
│   ├── Materials.tsx      # Material library
│   ├── Login.tsx         # Login page
│   ├── Register.tsx       # Registration page
│   ├── Agreement.tsx      # Terms of service
│   └── Privacy.tsx       # Privacy policy
├── routes/
│   └── index.tsx         # Route configuration
├── store/
│   ├── authStore.ts      # Authentication state
│   └── verifyStore.ts    # Captcha lockout logic
└── utils/
    └── passwordEncryptor.ts # RSA-OAEP password encryption
```

---

## 🔌 API Documentation

The backend API documentation is available in [openapi.json](src/api/openapi.json). Key API endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token

### Works
- `POST /api/work/create` - Create new work
- `POST /api/work/list` - List user works
- `POST /api/work/detail` - Get work details

### AI Models
- `POST /api/ai-model/list` - List available AI models

### Points
- `POST /api/point/balance` - Get user points balance

---

## 🔒 Security Features

1. **Input Validation** - SQL injection detection and HTML escaping
2. **Password Encryption** - RSA-OAEP with SHA-256
3. **Canvas Captcha** - Sequential click verification
4. **Login Lockout** - Detects abnormal behavior and temporarily locks accounts
5. **Token Refresh** - Automatic access token refresh on 401

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**php-chen** - [GitHub](https://github.com/php-chen)

---

<p align="center">
  <strong>⭐ If this project helps you, please give it a star!</strong>
</p>
