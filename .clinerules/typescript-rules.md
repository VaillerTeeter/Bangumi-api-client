# TypeScript Coding Standards

<!-- Bangumi-api-client TypeScript 编码规范，操作 src/ 目录时自动加载 -->

## Module System

- ESM only — `"type": "module"` in `package.json`
- `NodeNext` module resolution
- Always write `.js` extension in relative imports
- Group imports in order: built-in → external → internal → sibling → index, alphabetized, separated by blank lines

```ts
import { writeFile } from 'node:fs/promises';

import { createClient } from './generated/client/index.js';
import { VERSION } from './version.js';

import type { Subject } from './generated/types.gen.js';
```

## Type System

- `strict: true` — no exceptions
- NEVER use `any` — `@typescript-eslint/no-explicit-any` is `"error"`
- Prefer `interface` for object shapes; use `type` for unions and lookup types
- Always use `import type` for type-only imports (`consistent-type-imports` with `inline-type-imports` fix style)
- Always use `export type` / `import type` — type re-exports must use `type` keyword
- Record-style (`Record<string, T>`) for index signatures; never `{ [k: string]: T }`
- Explicit return types on all functions (`explicit-function-return-type`)
- Explicit module boundary types on all exports (`explicit-module-boundary-types`)
- `strict-boolean-expressions` — no truthy/falsy checks on non-boolean types
- `switch-exhaustiveness-check` — all union variants must be handled
- `no-unnecessary-type-assertion` — no redundant casts

```ts
// ✅
interface ClientResult<T> {
  data: T | undefined;
  error: unknown;
  response: Response;
  request: Request;
}

type Animal = 'cat' | 'dog' | 'bird';

// ❌
type ClientResult<T> = { data: T | undefined; ... };

// ✅
import type { Subject } from './generated/types.gen.js';
export type { BangumiClient } from './client.js';

// ❌
import { SomeType } from './generated/types.gen.js';
```

## Naming

| Category | Convention | Example |
| ---------- | ----------- | --------- |
| Files | kebab-case, zero-padded prefix for ordering | `01-subjects.ts` |
| Classes | PascalCase | `SubjectAPI`, `CollectionAPI` |
| Interfaces | PascalCase (no `I` prefix) | `ClientResult`, `CalendarEntry` |
| Functions | camelCase | `createBangumiClient` |
| Variables | camelCase | `baseUrl`, `subjectId` |
| Type params | Single uppercase letter or PascalCase | `T`, `TData` |
| Unused args | underscore prefix | `_event`, `_error` |

## Functions

- Max 5 parameters (`max-params`). Use option objects for more.
- Max 60 lines per function (`max-lines-per-function`), skipping comments and blank lines
- Max 3 nesting depth (`max-depth`)
- Cyclomatic complexity ≤ 12 (`complexity`)
- Always use `async` / `await` with explicit `Promise<T>` return type
- Always use `const` (never `var`, never `let` unless reassigned)
- Use `??` for nullish coalescing, `?.` for optional chaining

```ts
// ✅
async getSubjectById(subjectId: number): Promise<ClientResult<Subject>> {
  const result = await this.client.get<Subject>({
    url: '/v0/subjects/{subject_id}',
    path: { subject_id: subjectId },
  });
  return result as unknown as ClientResult<Subject>;
}

// ❌ — too many params
async search(a: number, b: number, c: number, d: number, e: number, f: number) {}
```

## Style (Prettier)

- Single quotes (`'`)
- Semicolons required
- Trailing commas everywhere (`"all"`)
- 100 character print width
- 2 space indentation (no tabs)
- LF line endings
- Arrow parens always

## Control Flow

- `===` / `!==` always (never `==` / `!=`)
- Curly braces required on all blocks (`curly: "all"`)
- `no-param-reassign` — don't reassign function parameters
- `no-return-assign` — no assignment in return statements
- `prefer-const` — use `const` by default, `let` only when reassigned
- `guard-for-in` — `for...in` must have `hasOwnProperty` guard

```ts
// ✅
if (result.error !== null) {
  return handleError(result);
}

// ❌
if (result.error != null)
  return handleError(result);
```

## JSDoc

- All public API methods MUST have JSDoc (`jsdoc/require-jsdoc` on class methods)
- Include `@param` and `@returns` for all parameters and return values
- Docs in Chinese (project convention)
- Mark optional params with `@param name - description` (no brackets needed in description)

```ts
/**
 * 根据条目 ID 获取条目详情。
 *
 * `GET /v0/subjects/{subject_id}`
 *
 * @param subjectId - 条目 ID（正整数）
 * @returns `data` — 完整 `Subject` 对象；不存在时返回 HTTP 404
 */
async getSubjectById(subjectId: number): Promise<ClientResult<Subject>> { ... }
```

## Forbidden

- `any` — always an error
- `eval` / `new Function()` — never
- `console` — `no-console` is `"error"`. Use `// eslint-disable-next-line no-console` for `debug` mode logging.
- `debugger` — never in committed code
- `var` — always use `const` or `let`
- `@ts-ignore` — use `@ts-expect-error` with an explanatory comment instead
- Mutable exports — `export let` is forbidden; use `export const` only
- `forEach` — prefer `for...of`
- `null` — allowed where meaningful (e.g., API response normalization), but prefer `undefined` for absent values

## File Size

- Max 500 lines per file (`max-lines`)
- `src/generated/` files are exempt (auto-generated)
- If a hand-written file exceeds 500 lines, split it

## Error Handling

- API methods return `Promise<ClientResult<T>>` — never throw from API methods
- Use `??` for default values on optional fields
- Use `.map_err()` pattern in Rust; in TS, check `result.error` explicitly

```ts
const result = await api.getSubjectById(123);
if (result.error !== null && result.error !== undefined) {
  // handle error
}
// use result.data
