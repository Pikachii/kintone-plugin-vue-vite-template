# 使用方法 / Usage Guide

## クイックスタート / Quick Start

### 1. リポジトリのクローン / Clone Repository

```bash
git clone https://github.com/Pikachii/kintone-plugin-vue-vite-template.git
cd kintone-plugin-vue-vite-template
```

### 2. 依存関係のインストール / Install Dependencies

```bash
npm install
```

### 3. 開発 / Development

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開いて、開発中のプラグインを確認できます。

### 4. ビルド / Build

```bash
npm run build
```

`dist/` ディレクトリにビルド成果物が生成されます。

### 5. パッケージング / Package

```bash
npm run package
```

kintone プラグイン形式の `plugin.zip` が生成されます。

### 6. kintone へアップロード / Upload to kintone

#### 手動アップロード / Manual Upload

1. `plugin.zip` をダウンロード
2. kintone 管理画面 > システム管理 > プラグイン
3. 「読み込む」ボタンから `plugin.zip` をアップロード

#### 自動アップロード / Automatic Upload

環境変数を設定してアップロード:

```bash
KINTONE_BASE_URL=https://your-domain.cybozu.com \
KINTONE_USERNAME=your-username \
KINTONE_PASSWORD=your-password \
npm run upload
```

または `.env.local` ファイルに設定:

```
KINTONE_BASE_URL=https://your-domain.cybozu.com
KINTONE_USERNAME=your-username
KINTONE_PASSWORD=your-password
```

```bash
npm run upload
```

## プロジェクト構造 / Project Structure

```
.
├── src/
│   ├── domain/                    # ドメイン層
│   │   └── repositories.ts        # リポジトリインターフェース
│   │
│   ├── application/               # アプリケーション層
│   │   ├── RecordService.ts       # レコード操作サービス
│   │   ├── ConfigService.ts       # 設定サービス
│   │   └── __tests__/             # ユニットテスト
│   │
│   ├── infrastructure/            # インフラ層
│   │   ├── KintoneRecordRepository.ts   # kintone API実装
│   │   └── KintoneConfigRepository.ts   # プラグイン設定実装
│   │
│   ├── desktop/                   # デスクトップ画面
│   │   ├── index.ts              # エントリポイント
│   │   └── components/           # Vue コンポーネント
│   │
│   ├── mobile/                    # モバイル画面
│   │   └── index.ts              # エントリポイント
│   │
│   └── config/                    # 設定画面
│       ├── index.html            # HTML エントリポイント
│       ├── main.ts               # JS エントリポイント
│       └── components/           # Vue コンポーネント
│
├── scripts/
│   ├── update-manifest.js        # マニフェスト更新スクリプト
│   ├── package-plugin.js         # パッケージングスクリプト
│   └── upload-plugin.js          # アップロードスクリプト
│
├── public/                        # 静的ファイル
│   └── icon.png                  # プラグインアイコン (48x48 PNG)
│
├── manifest.json                  # プラグインマニフェスト
├── vite.config.ts                # Vite 設定
├── vitest.config.ts              # Vitest 設定
├── tsconfig.json                 # TypeScript 設定
└── package.json                  # npm パッケージ設定
```

## Clean Architecture の使い方 / Using Clean Architecture

### 1. 新しいリポジトリの定義 / Define New Repository

`src/domain/repositories.ts` にインターフェースを追加:

```typescript
export interface UserRepository {
  getCurrentUser(): Promise<User>
  getUser(userId: string): Promise<User>
}

export interface User {
  id: string
  name: string
  email: string
}
```

### 2. サービスの実装 / Implement Service

`src/application/UserService.ts` を作成:

```typescript
import type { UserRepository, User } from '../domain/repositories'

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async fetchCurrentUser(): Promise<User> {
    return await this.userRepository.getCurrentUser()
  }
}
```

### 3. インフラ層の実装 / Implement Infrastructure

`src/infrastructure/KintoneUserRepository.ts` を作成:

```typescript
import type { UserRepository, User } from '../domain/repositories'

declare const kintone: any

export class KintoneUserRepository implements UserRepository {
  async getCurrentUser(): Promise<User> {
    const user = kintone.getLoginUser()
    return {
      id: user.id,
      name: user.name,
      email: user.email
    }
  }

  async getUser(userId: string): Promise<User> {
    // kintone API を使用してユーザー情報を取得
    // ...
  }
}
```

### 4. エントリポイントで使用 / Use in Entry Point

`src/desktop/index.ts`:

```typescript
import { KintoneUserRepository } from '../infrastructure/KintoneUserRepository'
import { UserService } from '../application/UserService'

const userRepository = new KintoneUserRepository()
const userService = new UserService(userRepository)

// Vue コンポーネントに渡す
const app = createApp(MyComponent, {
  userService
})
```

## テストの書き方 / Writing Tests

### ユニットテスト例 / Unit Test Example

`src/application/__tests__/UserService.test.ts`:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { UserService } from '../UserService'
import type { UserRepository, User } from '../../domain/repositories'

describe('UserService', () => {
  it('should fetch current user', async () => {
    const mockUser: User = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com'
    }

    const mockRepository: UserRepository = {
      getCurrentUser: vi.fn().mockResolvedValue(mockUser),
      getUser: vi.fn()
    }

    const service = new UserService(mockRepository)
    const result = await service.fetchCurrentUser()

    expect(result).toEqual(mockUser)
    expect(mockRepository.getCurrentUser).toHaveBeenCalled()
  })
})
```

### Vue コンポーネントテスト例 / Vue Component Test Example

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MyComponent from '../MyComponent.vue'

describe('MyComponent', () => {
  it('should render correctly', () => {
    const wrapper = mount(MyComponent, {
      props: {
        message: 'Hello'
      }
    })

    expect(wrapper.text()).toContain('Hello')
  })
})
```

## カスタマイズ / Customization

### プラグイン情報の変更 / Change Plugin Information

`manifest.json` を編集:

```json
{
  "name": {
    "ja": "あなたのプラグイン名",
    "en": "Your Plugin Name"
  },
  "description": {
    "ja": "プラグインの説明",
    "en": "Plugin description"
  }
}
```

### アイコンの追加 / Add Icon

`public/icon.png` に 48x48 ピクセルの PNG 画像を配置してください。

### 新しいエントリポイントの追加 / Add New Entry Point

1. `src/` 配下に新しいディレクトリを作成
2. `vite.config.ts` の `build.rollupOptions.input` に追加
3. ビルド後、`manifest.json` が自動的に更新されます

## CI/CD

### GitHub Actions

`.github/workflows/ci.yml` により、以下が自動実行されます:

- リント
- 型チェック
- テスト
- ビルド
- パッケージング

プルリクエストや `main`/`develop` ブランチへのプッシュ時に自動実行されます。

## トラブルシューティング / Troubleshooting

### ビルドエラー / Build Errors

```bash
# node_modules を削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

### 型エラー / Type Errors

```bash
# 型チェックを実行
npm run type-check
```

### テスト失敗 / Test Failures

```bash
# テストを詳細モードで実行
npm test -- --reporter=verbose
```

## 参考資料 / References

- [kintone プラグイン開発ガイド](https://cybozu.dev/ja/kintone/tips/development/plugins/development-plugin/development-kintone-plugin/)
- [Vue 3 ドキュメント](https://ja.vuejs.org/)
- [Vite ドキュメント](https://ja.vitejs.dev/)
- [Vitest ドキュメント](https://vitest.dev/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
