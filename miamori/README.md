# 🌿 みまもり / Miamori

> 高齢の家族を見守るためのウェブアプリ  
> A web app to help families look after elderly loved ones

---

## 📱 スクリーンショット / Screenshot

```
┌─────────────────────┐
│   みまもり          │
│   Care & Connect    │
│──────────────────── │
│ 🏠 ホーム           │
│ 💊 健康記録         │
│ 📍 位置情報         │
│ 🆘 緊急             │
└─────────────────────┘
```

---

## ✨ 機能 / Features

| 機能 | 説明 | Feature | Description |
|------|------|---------|-------------|
| 👋 安否確認 | 「元気です！」ボタンで家族に通知 | Check-in | Notify family with a single tap |
| 💊 健康記録 | 体調・食事・メモを記録 | Health Log | Track condition, meals, and notes |
| 📍 位置情報 | 現在地と行動履歴を表示 | Location | View current location and activity history |
| 🚨 緊急SOS | 緊急連絡先に一括通知 | Emergency SOS | Alert all emergency contacts at once |

---

## 🚀 セットアップ / Getting Started

### 必要環境 / Requirements

- Node.js 18+
- npm または yarn

### インストール / Installation

```bash
# リポジトリをクローン / Clone the repository
git clone https://github.com/YOUR_USERNAME/miamori-app.git
cd miamori-app

# 依存パッケージをインストール / Install dependencies
npm install

# 開発サーバーを起動 / Start the development server
npm run dev
```

ブラウザで `http://localhost:5173` を開いてください。  
Open `http://localhost:5173` in your browser.

### ビルド / Build

```bash
# 本番用ビルド / Production build
npm run build

# ビルドのプレビュー / Preview the build
npm run preview
```

---

## 🗂 ディレクトリ構成 / Project Structure

```
miamori-app/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx          # メインコンポーネント / Main component
│   ├── App.module.css   # スタイル / Styles (CSS Modules)
│   ├── main.jsx         # エントリーポイント / Entry point
│   └── index.css        # グローバルスタイル / Global styles
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## 🛠 技術スタック / Tech Stack

- **React 18** — UIライブラリ / UI library
- **Vite 5** — ビルドツール / Build tool
- **CSS Modules** — スコープ付きスタイル / Scoped styles

---

## 🔮 今後の追加予定 / Roadmap

- [ ] バックエンドAPI連携（実際の通知送信）/ Backend API integration (real notifications)
- [ ] GPS位置情報の連携 / Real GPS tracking
- [ ] プッシュ通知 / Push notifications
- [ ] 複数ユーザー対応 / Multi-user support
- [ ] ダークモード / Dark mode

---

## 📄 ライセンス / License

MIT License — 自由にお使いください / Free to use and modify.

---

## 🙏 コントリビューション / Contributing

プルリクエスト・issueはお気軽にどうぞ！  
Pull requests and issues are welcome!
