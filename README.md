# Bangumi-api-client

基于 [Bangumi API v0](https://github.com/bangumi/api) 的 TypeScript 封装库，提供类型安全的高层调用接口。覆盖全部 56 个接口（其中 `getCalendar()` 对应 `GET /calendar`，为 v0 规范外接口），包含条目、章节、角色、人物、用户、收藏、编辑历史和目录八大资源模块。

## 特性

- **双层架构** — 底层由 `@hey-api/openapi-ts` 从官方 OpenAPI YAML 自动生成，顶层提供面向对象的高层封装
- **完整类型支持** — 所有请求参数与响应数据均有完整 TypeScript 类型，方法返回值统一为 `Promise<ClientResult<T>>`，开箱即用
- **ESM 优先** — 使用 `"type": "module"`，支持 Tree-shaking
- **认证支持** — 可选传入 Access Token，自动附加 `Authorization: Bearer` 头；写操作需 `write:collection` / `write:indices` scope
- **User-Agent 合规** — 按 Bangumi API 要求自动设置 `User-Agent` 请求头
- **按资源分类** — `SubjectAPI` / `EpisodeAPI` / `CharacterAPI` / `PersonAPI` / `UserAPI` / `CollectionAPI` / `RevisionAPI` / `IndexAPI`

## 开发工作流

### 初次克隆后

```bash
# 安装所有依赖
yarn install
```

之后直接运行任意命令即可，底层代码会在需要时**自动生成**（见下文说明）。

---

### 日常开发

`build` / `typecheck` / `test` 均配置了 `pre*` 钩子，执行前会自动调用 `yarn generate` 重新生成 `src/generated/`，无需手动触发：

```bash
yarn build        # 生成 → 编译 TypeScript 到 dist/
yarn typecheck    # 生成 → 仅类型检查，不输出产物
yarn test         # 生成 → 运行集成测试（需联网访问 api.bgm.tv）
```

> 认证相关测试需通过环境变量 `BGM_TOKEN` 提供 Access Token（`vitest.config.ts` 仅透传 `process.env` 中以 `BGM_` 开头的变量，不会读取 `.env` 文件）。

如果只想单独刷新生成代码（例如官方 OpenAPI YAML 有更新）：

```bash
yarn generate
```

> `src/generated/` 下所有文件均为自动生成产物，不要手动修改，每次执行后会被完全覆盖。

---

### 发布新版本

```bash
# 1. 更新 package.json 中的 version 字段（例如 "<version>"）
# 2. 提交版本号变更（commit message 可选包含 <version>；tag 中的 <version> 必须与 package.json 保持一致）
git add package.json && git commit -m "chore: bump version to <version>"
# 3. 打 tag（触发 CI 自动构建并发布到 npm）
git tag v<version>
git push origin HEAD
git push origin v<version>
```

> CI Release 工作流（[release.yml](.github/workflows/release.yml)）在检测到 `v*` tag 时自动执行 `npm publish`，无需手动操作。需在仓库 Settings → Secrets 中配置 `NPM_TOKEN`。

## API 使用文档

各模块的详细说明和示例代码已独立维护，请点击对应链接查阅：

| 模块 | 接口数 | 文档 |
| --- | --- | --- |
| SubjectAPI — 条目 | 8 | [01-subjects.md](.github/docs/api/01-subjects.md) |
| EpisodeAPI — 章节 | 2 | [02-episodes.md](.github/docs/api/02-episodes.md) |
| CharacterAPI — 角色 | 7 | [03-characters.md](.github/docs/api/03-characters.md) |
| PersonAPI — 人物 | 7 | [04-persons.md](.github/docs/api/04-persons.md) |
| UserAPI — 用户 | 3 | [05-users.md](.github/docs/api/05-users.md) |
| CollectionAPI — 收藏 | 12 | [06-collections.md](.github/docs/api/06-collections.md) |
| RevisionAPI — 编辑历史 | 8 | [07-revisions.md](.github/docs/api/07-revisions.md) |
| IndexAPI — 目录 | 9 | [08-indices.md](.github/docs/api/08-indices.md) |

## CI 检查说明

> 详细的 CI 检查规则文档已独立维护，请参阅 [ci-checks.md](.github/docs/ci/ci-checks.md)。

## 相关链接

### 本项目

- [Bangumi-api-client](https://github.com/VaillerTeeter/Bangumi-api-client) — 本仓库
- [模板仓库 Example-of-Github-Repo](https://github.com/VaillerTeeter/Example-of-Github-Repo) — CI 配置、lint 规则、Issue/PR 模板、行为准则等通用配置均继承自此仓库

### Bangumi

- [Bangumi 番组计划](https://bgm.tv) — 目标 API 所属平台
- [bangumi/api](https://github.com/bangumi/api) — Bangumi 官方 API 仓库
- [OpenAPI v0.yaml](https://github.com/bangumi/api/blob/master/open-api/v0.yaml) — 本库底层代码生成所用的 OpenAPI 规范文件（锁定 `a7055f2`，2026-07-23）
- [Bangumi API 文档](https://bangumi.github.io/api/) — 在线 API 文档（Swagger UI）
- [Bangumi Personal Access Token](https://next.bgm.tv/demo/access-token) — 创建用于认证接口测试的 Access Token（`BGM_TOKEN`）

### 依赖

- [@hey-api/openapi-ts](https://github.com/hey-api/openapi-ts) — OpenAPI → TypeScript 代码生成器（开发依赖）
- [@hey-api/client-fetch](https://github.com/hey-api/openapi-ts/tree/main/packages/client-fetch) — 生成代码使用的 Fetch 客户端；其代码由 `@hey-api/openapi-ts` 内联生成到 `src/generated/client` 与 `src/generated/core`，本包不单独安装该依赖

### 作者

- [GitHub Profile](https://github.com/VaillerTeeter)
