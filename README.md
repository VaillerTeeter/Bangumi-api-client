# Bangumi-api-client

基于 [Bangumi API v0](https://github.com/bangumi/api) 的 TypeScript 封装库，提供类型安全的高层调用接口。覆盖全部 56 个接口，包含条目、章节、角色、人物、用户、收藏、编辑历史和目录八大资源模块。

## 特性

- **双层架构** — 底层由 `@hey-api/openapi-ts` 从官方 OpenAPI YAML 自动生成，顶层提供面向对象的高层封装
- **完整类型支持** — 所有请求参数与响应数据均有完整 TypeScript 类型，方法返回值统一为 `Promise<ClientResult<T>>`，开箱即用
- **ESM 优先** — 使用 `"type": "module"`，支持 Tree-shaking
- **认证支持** — 可选传入 Access Token，自动附加 `Authorization: Bearer` 头
- **User-Agent 合规** — 按 Bangumi API 要求自动设置 `User-Agent` 请求头
- **按资源分类** — `SubjectAPI` / `EpisodeAPI` / `CharacterAPI` / `PersonAPI` / `UserAPI` / `CollectionAPI` / `RevisionAPI` / `IndexAPI`

## 目录结构

```text
.
├── .clineignore
├── .clinerules/                               # Cline AI 编码规范（自动加载）
│   ├── api-rules.md                           # API 设计标准
│   ├── git-workflow.md                        # Git 操作约束
│   ├── project-identity.md                    # 项目身份与架构声明
│   └── typescript-rules.md                    # TypeScript 编码规范
├── .editorconfig                              # 编辑器通用格式规范（缩进/换行/编码）
├── .github/                                   # GitHub 仓库配置与文档
│   ├── ISSUE_TEMPLATE/                        # Issue 模板（中英文 bug/feature 各一份）
│   │   ├── bug_report_en.md
│   │   ├── bug_report_zh.md
│   │   ├── config.yml
│   │   ├── feature_request_en.md
│   │   └── feature_request_zh.md
│   ├── PULL_REQUEST_TEMPLATE.md               # PR 描述模板
│   ├── dependabot.yml                         # Dependabot 自动依赖更新配置
│   ├── docs/                                  # 项目文档
│   │   ├── api/                               # API 使用文档（各模块方法说明与示例）
│   │   │   ├── 01-subjects.md                 # SubjectAPI — 条目（8 个接口）
│   │   │   ├── 02-episodes.md                 # EpisodeAPI — 章节（2 个接口）
│   │   │   ├── 03-characters.md               # CharacterAPI — 角色（7 个接口）
│   │   │   ├── 04-persons.md                  # PersonAPI — 人物（7 个接口）
│   │   │   ├── 05-users.md                    # UserAPI — 用户（3 个接口）
│   │   │   ├── 06-collections.md              # CollectionAPI — 收藏（12 个接口）
│   │   │   ├── 07-revisions.md                # RevisionAPI — 编辑历史（8 个接口）
│   │   │   └── 08-indices.md                  # IndexAPI — 目录（9 个接口）
│   │   └── ci/
│   │       └── ci-checks.md                   # CI 检查规则说明
│   ├── scripts/
│   │   └── ai-review.mjs                      # AI 代码审查脚本
│   └── workflows/                             # GitHub Actions 工作流
│       ├── lint.yml                           # CI Lint 工作流（代码质量/格式/安全扫描）
│       ├── release.yml                        # CI Release 工作流（打 tag 时发布到 npm）
│       ├── review-command.yml                 # Review 命令工作流
│       └── test.yml                           # CI Test 工作流（集成测试）
├── .gitignore                                 # Git 忽略规则
├── .lintrc/                                   # 各工具 Lint 配置
│   ├── docs/
│   │   └── markdown/
│   │       └── .markdownlint.json             # Markdown lint 规则
│   ├── frontend/                              # 前端/TypeScript 相关
│   │   ├── knip.json                          # Knip 未使用导出检查配置
│   │   ├── prettier/
│   │   │   └── .prettierrc                    # Prettier 格式化配置
│   │   └── typescript/
│   │       ├── .eslintrc-ts.json              # ESLint TypeScript 规则
│   │       └── tsconfig-lint.json             # ESLint 专用 tsconfig
│   ├── general/                               # 通用规范
│   │   ├── .ls-lint.yml                       # 文件命名规范检查
│   │   ├── .yamllint.yml                      # YAML lint 规则
│   │   └── cspell.json                        # 拼写检查词典配置
│   ├── git/
│   │   └── .commitlintrc.cjs                  # Commit message 规范
│   └── security/
│       └── .gitleaks.toml                     # 密钥泄露扫描规则
├── .vscode/                                   # VS Code 工作区配置
│   ├── extensions.json                        # 推荐扩展列表
│   └── settings.json                          # 工作区设置（格式化/lint 等）
├── CODE_OF_CONDUCT.md                         # 行为准则
├── CONTRIBUTING.md                            # 贡献指南
├── LICENSE                                    # GPL-3.0 许可证
├── README.md                                  # 本文件
├── SECURITY.md                                # 安全漏洞披露政策
├── openapi-ts.config.ts                       # @hey-api/openapi-ts 代码生成配置
├── package.json                               # 包定义、scripts、依赖声明
├── scripts/
│   └── generate-version.js                    # 从 package.json 读取版本号并写入 src/version.ts
├── src/                                       # 源代码
│   ├── api/                                   # 高层手写封装（Layer 2）
│   │   ├── 01-subjects.ts                     # SubjectAPI — 条目（8 个接口）
│   │   ├── 02-episodes.ts                     # EpisodeAPI — 章节（2 个接口）
│   │   ├── 03-characters.ts                   # CharacterAPI — 角色（7 个接口）
│   │   ├── 04-persons.ts                      # PersonAPI — 人物（7 个接口）
│   │   ├── 05-users.ts                        # UserAPI — 用户（3 个接口）
│   │   ├── 06-collections.ts                  # CollectionAPI — 收藏（12 个接口）
│   │   ├── 07-revisions.ts                    # RevisionAPI — 编辑历史（8 个接口）
│   │   └── 08-indices.ts                      # IndexAPI — 目录（9 个接口）
│   ├── client.ts                              # createBangumiClient() 工厂函数、ClientResult<T>
│   └── index.ts                               # 库公共 API 入口
├── tests/                                     # 测试
│   ├── integration/                           # 集成测试（需联网访问 api.bgm.tv）
│   │   ├── 01-subjects.test.ts                # SubjectAPI 集成测试（8 个接口）
│   │   ├── 02-episodes.test.ts                # EpisodeAPI 集成测试（2 个接口）
│   │   ├── 03-characters.test.ts              # CharacterAPI 集成测试（7 个接口）
│   │   ├── 04-persons.test.ts                 # PersonAPI 集成测试（7 个接口）
│   │   ├── 05-users.test.ts                   # UserAPI 集成测试（3 个接口）
│   │   ├── 06-collections.test.ts             # CollectionAPI 集成测试（12 个接口）
│   │   ├── 07-revisions.test.ts               # RevisionAPI 集成测试（8 个接口）
│   │   └── 08-indices.test.ts                 # IndexAPI 集成测试（9 个接口）
│   └── tsconfig.json                          # 测试专用 TypeScript 配置
├── tsconfig.json                              # TypeScript 编译配置（ESM/NodeNext/ES2022）
├── vitest.config.ts                           # Vitest 测试配置
└── yarn.lock                                  # 依赖版本锁定文件
```

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

> 认证相关测试须在 `.env` 中配置 `BGM_TOKEN`。

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
- [OpenAPI v0.yaml](https://github.com/bangumi/api/blob/master/open-api/v0.yaml) — 本库底层代码生成所用的 OpenAPI 规范文件
- [Bangumi API 文档](https://bangumi.github.io/api/) — 在线 API 文档（Swagger UI）
- [Bangumi Personal Access Token](https://next.bgm.tv/demo/access-token) — 创建用于认证接口测试的 Access Token（`BGM_TOKEN`）

### 依赖

- [@hey-api/openapi-ts](https://github.com/hey-api/openapi-ts) — OpenAPI → TypeScript 代码生成器（开发依赖）
- [@hey-api/client-fetch](https://github.com/hey-api/openapi-ts/tree/main/packages/client-fetch) — 生成代码使用的 Fetch HTTP 客户端（运行时依赖）

### 作者

- [GitHub Profile](https://github.com/VaillerTeeter)
