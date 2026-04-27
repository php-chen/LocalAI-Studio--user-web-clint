# LocalAI Studio - ユーザークライアント

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node バージョン](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)](package.json)
[![React バージョン](https://img.shields.io/badge/react-18.2-blue.svg)](package.json)

---

## 🌐 言語切り替え

| 言語 | リンク |
|------|------|
| 🇨🇳 简体中文 | [简体中文](README_zh.md) |
| 🇺🇸 English | [English](README_en.md) |
| 🇯🇵 日本語 | [このドキュメント](README_ja.md) |
| 🇰🇷 한국어 | [한국어](README_ko.md) |

---

## 📖 プロジェクト紹介

**LocalAI Studio - ユーザークライアント** は、AI支援コンテンツ創作のための最新のWebアプリケーションです。テキストプロンプトから画像や動画を生成できます。Vite + React + TypeScriptで構築され、直感的で使いやすい創作インターフェースを提供します。

### 主な機能

- 🎨 **AI画像生成** - 様々なAIモデルを使用してテキストプロンプトから画像を生成
- 🎬 **AI動画生成** - カスタマイズ可能なパラメータで動画を生成
- 📁 **作品管理** - すべての創作物を整理・管理
- 📚 **マテリアルライブラリ** - クリエイティブアセットの保存与管理
- 💎 **ポイントシステム** - クレジットベースの使用量追跡
- 🔐 **セキュア認証** - Canvas検証を備えたRSA-OAEP暗号化ログイン

### 技術スタック

| カテゴリ | 技術 |
|----------|------|
| フレームワーク | React 18.2 + TypeScript 5.5 |
| ビルドツール | Vite 5.0 |
| ルーティング | React Router DOM 6.14 |
| UIライブラリ | Ant Design 5.10 |
| 状態管理 | Zustand 4.4 |
| HTTPクライアント | Axios 1.15 |
| スタイリング | Tailwind CSS 3.4 |
| 暗号化 | node-forge (RSA-OAEP) |

---

## 🚀 クイックスタート

### 必要環境

- Node.js >= 18.0.0
- pnpm (推奨) または npm

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/your-username/LocalAI-Studio-User-Client.git
cd LocalAI-Studio-User-Client

# 依存関係をインストール
pnpm install

# 開発サーバーを起動
pnpm dev
```

### 本番環境ビルド

```bash
pnpm build
pnpm preview
```

---

## 📁 プロジェクト構造

```
src/
├── api/                    # APIクライアントと定義
│   ├── index.ts           # Axiosインスタンス、インターセプタ、認証API
│   └── openapi.json       # バックエンドAPIドキュメント
├── components/            # 再利用可能なUIコンポーネント
│   ├── CanvasVerify.tsx   # Canvasスライダーキャプチャ
│   ├── Header.tsx         # ナビゲーションヘッダー
│   ├── Footer.tsx         # ページフッター
│   ├── WorksManagement.tsx # 作品管理カード
│   ├── MaterialLibrary.tsx # マテリアルライブラリカード
│   ├── ProgressBoard.tsx   # 進捗ダッシュボード
│   └── StyleRecommendation.tsx # スタイル推奨
├── layouts/
│   └── MainLayout.tsx     # メインレイアウトラッパー
├── pages/                 # ページコンポーネント
│   ├── Home.tsx          # ホームページ
│   ├── ImageLab.tsx       # AI画像生成ラボ
│   ├── VideoEngine.tsx    # AI動画生成エンジン
│   ├── Works.tsx          # 作品管理中心
│   ├── Materials.tsx      # マテリアルライブラリ
│   ├── Login.tsx         # ログインページ
│   ├── Register.tsx       # 登録ページ
│   ├── Agreement.tsx      # 利用規約
│   └── Privacy.tsx       # プライバシーポリシー
├── routes/
│   └── index.tsx         # ルーター設定
├── store/
│   ├── authStore.ts      # 認証状態
│   └── verifyStore.ts    # キャプチャロックアウト論理
└── utils/
    └── passwordEncryptor.ts # RSA-OAEPパスワード暗号化
```

---

## 🔌 APIドキュメント

バックエンドAPIドキュメントは [openapi.json](src/api/openapi.json) にあります。主要なAPIエンドポイント:

### 認証
- `POST /api/auth/login` - ユーザーログイン
- `POST /api/auth/logout` - ユーザーlogout
- `POST /api/auth/refresh` - アクセストークンの更新

### 作品
- `POST /api/work/create` - 新規作品を作成
- `POST /api/work/list` - 作品リストを取得
- `POST /api/work/detail` - 作品詳細を取得

### AIモデル
- `POST /api/ai-model/list` - 利用可能なAIモデルのリストを取得

### ポイント
- `POST /api/point/balance` - ユーザーのポイント残高を取得

---

## 🔒 セキュリティ機能

1. **入力検証** - SQLインジェクション検出とHTMLエスケープ
2. **パスワード暗号化** - SHA-256によるRSA-OAEP
3. **Canvasキャプチャ** - 順序クリック検証
4. **ログインロックアウト** - 異常行動を検出し、一時的にアカウントをロック
5. **トークン更新** - 401時に自動的にアクセストークンを更新

---

## 🤝 コントリビューション

コントリビューションを歓迎します！Pull Requestを送信してください。

1. リポジトリをFork
2. 機能ブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'Add some AmazingFeature'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. Pull Requestを開く

---

## 📄 ライセンス

このプロジェクトはMITライセンスで公開されています - 詳細は [LICENSE](LICENSE) ファイルを参照してください。

---

## 👨‍💻 著者

**Your Name** - [GitHub](https://github.com/your-username)

---

<p align="center">
  <strong>⭐ このプロジェクトが役に立った場合は、starをつけてください！</strong>
</p>
