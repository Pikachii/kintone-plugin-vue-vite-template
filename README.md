# kintone-plugin-vue-vite-template

kintoneのプラグインをVue 3 + Viteで保守性高く作成できるテンプレート

## 特徴

- ✅ **Vue 3** - 最新のVue 3を使用した画面開発
- ✅ **Vite** - 高速なビルドツール
- ✅ **TypeScript** - 型安全な開発環境
- ✅ **Clean Architecture** - 依存関係を整理した保守性の高いアーキテクチャ
- ✅ **複数エントリポイント** - デスクトップ、モバイル、設定画面に対応
- ✅ **自動テスト** - Vitestによる自動テスト環境
- ✅ **自動パッケージング** - kintoneプラグイン形式での自動パッケージング
- ✅ **自動アップロード** - ビルド成果物の自動アップロード機能

## プロジェクト構成

```
.
├── src/
│   ├── domain/              # ドメイン層（ビジネスロジック）
│   │   └── repositories.ts  # リポジトリインターフェース
│   ├── application/         # アプリケーション層（ユースケース）
│   │   ├── RecordService.ts
│   │   └── ConfigService.ts
│   ├── infrastructure/      # インフラ層（外部依存実装）
│   │   ├── KintoneRecordRepository.ts
│   │   └── KintoneConfigRepository.ts
│   ├── desktop/            # デスクトップ画面
│   │   ├── index.ts
│   │   └── components/
│   ├── mobile/             # モバイル画面
│   │   └── index.ts
│   └── config/             # 設定画面
│       ├── index.html
│       ├── main.ts
│       └── components/
├── scripts/
│   ├── package-plugin.js   # プラグインパッケージングスクリプト
│   └── upload-plugin.js    # アップロードスクリプト
├── manifest.json           # プラグインマニフェスト
├── vite.config.ts          # Vite設定
└── package.json

```

## Clean Architecture について

このテンプレートは、Clean Architectureの原則に基づいて構成されています：

### ドメイン層 (domain/)
- ビジネスロジックの中核
- 外部依存を持たない
- インターフェースの定義

### アプリケーション層 (application/)
- ユースケースの実装
- ドメイン層を使用
- ビジネスフローの調整

### インフラ層 (infrastructure/)
- 外部システムとの連携
- kintone APIの具体的な実装
- ドメイン層のインターフェースを実装

この構造により、kintone APIの実装を簡単に差し替えたり、モックに置き換えてテストすることが可能です。

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 開発

```bash
npm run dev
```

### 3. ビルド

```bash
npm run build
```

ビルドすると、`dist/` ディレクトリに以下のファイルが生成されます：
- `config.html`, `config.js`, `config.css` - 設定画面
- `desktop.js`, `desktop.css` - デスクトップ画面
- `mobile.js`, `mobile.css` - モバイル画面

### 4. パッケージング

```bash
npm run package
```

kintoneプラグイン形式（.zip）でパッケージングされ、`plugin.zip` が生成されます。

### 5. アップロード

```bash
# 環境変数を設定してアップロード
KINTONE_BASE_URL=https://example.cybozu.com \
KINTONE_USERNAME=your-username \
KINTONE_PASSWORD=your-password \
npm run upload
```

## テスト

### すべてのテストを実行

```bash
npm test
```

### テストをウォッチモードで実行

```bash
npm test -- --watch
```

### カバレッジを確認

```bash
npm run test:coverage
```

### UIでテストを実行

```bash
npm run test:ui
```

## Lint

```bash
npm run lint
```

## 型チェック

```bash
npm run type-check
```

## カスタマイズ

### プラグイン情報の変更

`manifest.json` を編集して、プラグインの名前や説明を変更できます。

### エントリポイントの追加

新しいエントリポイントを追加する場合：

1. `src/` 配下に新しいディレクトリを作成
2. `vite.config.ts` の `build.rollupOptions.input` に追加
3. `manifest.json` にエントリポイントを追加

### Clean Architectureの活用

新しい機能を追加する際は：

1. **domain/** にインターフェースを定義
2. **application/** にユースケースを実装
3. **infrastructure/** に具体的な実装を追加
4. **テスト** を作成してインターフェースをモックする

## ライセンス

MIT

## 参考資料

- [kintone プラグイン開発ガイド](https://cybozu.dev/ja/kintone/tips/development/plugins/development-plugin/development-kintone-plugin/)
- [Vue 3 ドキュメント](https://ja.vuejs.org/)
- [Vite ドキュメント](https://ja.vitejs.dev/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
