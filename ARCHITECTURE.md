# アーキテクチャ図 / Architecture Diagram

## システム構成 / System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Presentation Layer                      │
│                    (Vue 3 Components)                        │
├─────────────────────────────────────────────────────────────┤
│  Desktop View     │  Mobile View     │  Configuration View  │
│  - SamplePlugin   │  - SamplePlugin  │  - ConfigApp         │
└────────┬──────────┴────────┬─────────┴──────────┬───────────┘
         │                   │                     │
         ▼                   ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│                     (Use Cases)                              │
├─────────────────────────────────────────────────────────────┤
│  RecordService    │  ConfigService   │  [Custom Services]   │
│  - fetchRecords   │  - getConfig     │                      │
│  - createRecord   │  - setConfig     │                      │
│  - updateRecord   │                  │                      │
└────────┬──────────┴────────┬─────────┴──────────────────────┘
         │                   │
         ▼                   ▼
┌─────────────────────────────────────────────────────────────┐
│                      Domain Layer                            │
│               (Business Logic & Interfaces)                  │
├─────────────────────────────────────────────────────────────┤
│  RecordRepository Interface  │  ConfigRepository Interface   │
│  - getRecord()               │  - getConfig()                │
│  - getRecords()              │  - setConfig()                │
│  - createRecord()            │                               │
│  - updateRecord()            │                               │
└────────┬─────────────────────┴───────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Infrastructure Layer                       │
│                (External Dependencies)                       │
├─────────────────────────────────────────────────────────────┤
│  KintoneRecordRepository  │  KintoneConfigRepository        │
│  - kintone.api()          │  - kintone.plugin.app.*         │
└────────┬──────────────────┴─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                       kintone APIs                           │
│              (External System)                               │
└─────────────────────────────────────────────────────────────┘
```

## データフロー / Data Flow

### レコード取得の例 / Example: Fetching Records

```
User Action (Click button)
       │
       ▼
[Vue Component: SamplePlugin]
       │
       │ calls
       ▼
[Application: RecordService.fetchRecords()]
       │
       │ uses interface
       ▼
[Domain: RecordRepository Interface]
       │
       │ implemented by
       ▼
[Infrastructure: KintoneRecordRepository.getRecords()]
       │
       │ calls
       ▼
[kintone API]
       │
       │ returns data
       ▼
[Infrastructure: KintoneRecordRepository]
       │
       │ returns
       ▼
[Application: RecordService]
       │
       │ returns
       ▼
[Vue Component: SamplePlugin]
       │
       │ displays
       ▼
User sees records
```

## 依存関係の方向 / Dependency Direction

```
Presentation Layer ──depends on──> Application Layer
                                          │
Application Layer ──depends on──> Domain Layer
                                          │
Infrastructure Layer ──implements──> Domain Layer
                                          │
Infrastructure Layer ──depends on──> External APIs
```

### 重要な原則 / Key Principles

1. **依存関係逆転の原則 (Dependency Inversion Principle)**
   - 上位レイヤーは下位レイヤーに依存しない
   - 両方とも抽象(インターフェース)に依存する

2. **単一責任の原則 (Single Responsibility Principle)**
   - 各層は明確な責任を持つ
   - Domain: ビジネスロジック
   - Application: ユースケース
   - Infrastructure: 外部連携

3. **開放閉鎖の原則 (Open-Closed Principle)**
   - 拡張に対して開いている
   - 修正に対して閉じている

## ビルドプロセス / Build Process

```
Source Code (TypeScript + Vue)
       │
       ▼
[Vite Build Process]
       │
       ├──> Config Entry (config.html, config.js, config.css)
       │
       ├──> Desktop Entry (desktop.js, desktop.css, chunks)
       │
       └──> Mobile Entry (mobile.js, mobile.css, chunks)
       │
       ▼
[dist/ directory]
       │
       ▼
[update-manifest.js]
       │
       │ generates
       ▼
[dist/manifest.json with correct file references]
       │
       ▼
[package-plugin.js]
       │
       │ creates
       ▼
[plugin.zip]
       │
       ▼
[Ready for kintone upload]
```

## テスト戦略 / Testing Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                      Unit Tests                              │
│                      (Vitest)                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Application Layer Tests                                     │
│  - RecordService.test.ts                                     │
│  - ConfigService.test.ts                                     │
│  ├─> Mock RecordRepository                                   │
│  └─> Mock ConfigRepository                                   │
│                                                              │
│  Component Tests                                             │
│  - SamplePlugin.test.ts                                      │
│  └─> Mock Services                                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│                   Integration Tests                          │
│                   (Manual Testing)                           │
├─────────────────────────────────────────────────────────────┤
│  - Test in actual kintone environment                        │
│  - Verify plugin installation                                │
│  - Test all entry points                                     │
└─────────────────────────────────────────────────────────────┘
```

## CI/CD パイプライン / CI/CD Pipeline

```
Git Push
   │
   ▼
GitHub Actions Triggered
   │
   ├──> Install Dependencies (npm ci)
   │
   ├──> Lint Check (npm run lint)
   │
   ├──> Type Check (npm run type-check)
   │
   ├──> Run Tests (npm test)
   │
   ├──> Build (npm run build)
   │
   └──> Package (npm run package)
        │
        ▼
   Upload Artifact (plugin.zip)
```

## 拡張ポイント / Extension Points

### 新しいサービスの追加 / Adding New Service

1. Domain層にインターフェースを定義
2. Application層にサービスを実装
3. Infrastructure層に具体的な実装を追加
4. テストを作成
5. Vue ComponentやEntry pointから使用

### 新しいエントリポイントの追加 / Adding New Entry Point

1. `src/` に新しいディレクトリを作成
2. `vite.config.ts` の input に追加
3. ビルドして manifest.json が自動更新されることを確認
4. 必要に応じて manifest.json の順序を調整

### カスタムビジネスロジックの追加 / Adding Custom Business Logic

1. Domain層に型やインターフェースを定義
2. Application層にビジネスロジックを実装
3. 既存のリポジトリを活用または新規作成
4. Vue Componentで使用
