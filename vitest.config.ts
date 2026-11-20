import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    testTimeout: 15000,
    // 图片类用例会跟随 302 到外部 CDN，偶发网络抖动时重试一次
    retry: 1,
    env: Object.fromEntries(
      Object.entries(process.env)
        .filter(([k]) => k.startsWith('BGM_'))
        .map(([k, v]) => [k, v ?? '']),
    ),
    reporters: ['verbose'],
    fileParallelism: false,
  },
});
