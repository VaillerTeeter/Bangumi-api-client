import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  // 固定到指定 commit SHA，确保代码生成结果可复现。
  // 当前锁定：2026-07-23（a7055f2，上游 master 最新 v0.yaml）。
  // 需要更新上游规范时，手动替换此 SHA。
  input:
    'https://raw.githubusercontent.com/bangumi/api/a7055f2dca7286d6963aaa7928345eeca6293e2b/open-api/v0.yaml',
  output: {
    path: 'src/generated',
  },
  plugins: [
    // 生成 TypeScript 类型（types.gen.ts）
    '@hey-api/typescript',
    // 生成原始 SDK 函数（sdk.gen.ts），按 operationId 命名
    {
      name: '@hey-api/sdk',
      operations: { nesting: 'operationId' },
    },
    // 使用 @hey-api/client-fetch 作为 HTTP 客户端（client.gen.ts）
    '@hey-api/client-fetch',
  ],
});
