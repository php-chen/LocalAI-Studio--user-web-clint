# LocalAI Studio - 用户端

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node 版本](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)](package.json)
[![React 版本](https://img.shields.io/badge/react-18.2-blue.svg)](package.json)

---

## 🌐 语言切换

| 语言 | 链接 |
|------|------|
| 🇨🇳 简体中文 | [本文档](README_zh.md) |
| 🇺🇸 English | [English](README_en.md) |
| 🇯🇵 日本語 | [日本語](README_ja.md) |
| 🇰🇷 한국어 | [한국어](README_ko.md) |

---

## 📖 项目简介

**LocalAI Studio - 用户端** 是一个现代化的人工智能内容创作平台,用户可以通过文本提示词生成图像和视频。基于 Vite + React + TypeScript 构建,提供直观易用的创作界面。

### 核心功能

- 🎨 **AI 图像生成** - 使用多种 AI 模型根据文本提示词创建图像
- 🎬 **AI 视频生成** - 生成可自定义参数的原创视频
- 📁 **作品管理** - 整理和管理您的所有创作
- 📚 **素材库** - 存储和管理创意素材
- 💎 **积分系统** - 基于积分的用量追踪
- 🔐 **安全认证** - 带有 Canvas 验证的 RSA-OAEP 加密登录

### 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 18.2 + TypeScript 5.5 |
| 构建工具 | Vite 5.0 |
| 路由 | React Router DOM 6.14 |
| UI 组件库 | Ant Design 5.10 |
| 状态管理 | Zustand 4.4 |
| HTTP 客户端 | Axios 1.15 |
| 样式 | Tailwind CSS 3.4 |
| 加密 | node-forge (RSA-OAEP) |

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm (推荐) 或 npm

### 安装步骤

```bash
# 克隆仓库
git clone https://github.com/php-chen/LocalAI-Studio-User-Client.git
cd LocalAI-Studio-User-Client

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 生产环境构建

```bash
pnpm build
pnpm preview
```

---

## 📁 项目结构

```
src/
├── api/                    # API 客户端和定义
│   ├── index.ts           # Axios 实例、拦截器、认证 API
│   └── openapi.json       # 后端 API 文档
├── components/            # 可复用 UI 组件
│   ├── CanvasVerify.tsx   # Canvas 滑块验证码
│   ├── Header.tsx         # 导航栏
│   ├── Footer.tsx         # 页脚
│   ├── WorksManagement.tsx # 作品管理卡片
│   ├── MaterialLibrary.tsx # 素材库卡片
│   ├── ProgressBoard.tsx   # 进度看板
│   └── StyleRecommendation.tsx # 风格推荐
├── layouts/
│   └── MainLayout.tsx     # 主布局包装器
├── pages/                 # 页面组件
│   ├── Home.tsx          # 首页
│   ├── ImageLab.tsx       # AI 图像实验室
│   ├── VideoEngine.tsx    # AI 视频引擎
│   ├── Works.tsx          # 作品中心
│   ├── Materials.tsx      # 素材库
│   ├── Login.tsx         # 登录页
│   ├── Register.tsx       # 注册页
│   ├── Agreement.tsx      # 用户协议
│   └── Privacy.tsx       # 隐私政策
├── routes/
│   └── index.tsx         # 路由配置
├── store/
│   ├── authStore.ts      # 认证状态
│   └── verifyStore.ts    # 验证码锁定逻辑
└── utils/
    └── passwordEncryptor.ts # RSA-OAEP 密码加密
```

---

## 🔌 API 文档

后端 API 文档位于 [openapi.json](src/api/openapi.json)。主要 API 端点:

### 认证
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `POST /api/auth/refresh` - 刷新访问令牌

### 作品
- `POST /api/work/create` - 创建新作品
- `POST /api/work/list` - 获取作品列表
- `POST /api/work/detail` - 获取作品详情

### AI 模型
- `POST /api/ai-model/list` - 获取可用 AI 模型列表

### 积分
- `POST /api/point/balance` - 获取用户积分余额

---

## 🔒 安全特性

1. **输入验证** - SQL 注入检测和 HTML 转义
2. **密码加密** - RSA-OAEP + SHA-256
3. **Canvas 验证码** - 顺序点击验证
4. **登录锁定** - 检测异常行为并临时锁定账户
5. **令牌刷新** - 收到 401 时自动刷新 access token

---

## 🤝 贡献代码

欢迎提交 Pull Request！

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

---

## 📄 开源协议

本项目采用 MIT 开源协议 - 详见 [LICENSE](LICENSE) 文件。

---

## 👨‍💻 作者

**php-chen** - [GitHub](https://github.com/php-chen)

---

<p align="center">
  <strong>⭐ 如果这个项目对您有帮助,请给一个 star!</strong>
</p>
