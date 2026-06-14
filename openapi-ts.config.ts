import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  // 固定到指定 commit SHA，确保代码生成结果可复现。
  // 需要更新上游规范时，手动替换此 SHA。
  input:
    'https://raw.githubusercontent.com/bangumi/api/32339d1fa26fecef235b00ae02aef1fae6f1ad45/open-api/v0.yaml',
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
