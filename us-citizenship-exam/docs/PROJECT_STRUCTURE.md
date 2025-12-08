# 项目结构文档

本文档详细说明最终的项目目录结构和各文件/目录的作用。

## 根目录结构

```
us-citizenship-exam/
├── app/                    # Next.js App Router 页面
├── components/             # 遗留组件（布局、UI、反馈表单）
├── data/                   # 静态 JSON 数据文件
├── docs/                   # 项目文档
├── e2e/                    # E2E 测试文件
├── lib/                    # 适配层（向后兼容）
├── messages/               # 国际化消息文件
├── public/                 # 静态资源
├── scripts/                # 构建脚本
├── src/                    # 新模块化架构源代码
├── types/                  # 全局类型定义
├── __mocks__/              # Jest Mock 文件
├── i18n/                   # next-intl 配置文件
└── [配置文件]              # 各种配置文件
```

## 核心目录说明

### app/ - Next.js 页面

Next.js App Router 的页面目录，包含所有路由页面。

```
app/
├── [locale]/              # 国际化路由
│   ├── page.tsx          # 首页
│   ├── quiz/             # Quiz 页面
│   ├── flashcards/       # Flashcards 页面
│   ├── glossary/         # Glossary 页面
│   ├── grammar/          # Grammar 页面
│   └── resources/        # Resources 页面
├── layout.tsx            # 根布局
├── error.tsx             # 错误页面
└── not-found.tsx         # 404 页面
```

### src/ - 模块化架构源代码

新的模块化架构，按功能组织代码。

```
src/
├── core/                 # 核心基础设施
│   ├── types/           # 共享类型定义
│   ├── constants/       # 应用常量
│   ├── services/        # 数据和服务层
│   └── store/           # 状态管理（Zustand）
├── shared/              # 共享资源
│   ├── hooks/          # 可复用的 React hooks
│   ├── utils/          # 工具函数
│   └── ui/             # 共享 UI 组件（预留）
└── modules/            # 功能模块
    ├── quiz/           # Quiz 模块
    ├── flashcards/     # Flashcards 模块
    ├── glossary/       # Glossary 模块
    └── grammar/        # Grammar 模块
```

### components/ - 遗留组件

保留的组件，包括布局、UI 和反馈表单。

```
components/
├── layout/              # 布局组件
│   ├── Navbar.tsx      # 导航栏
│   ├── Footer.tsx      # 页脚
│   └── LanguageSwitcher.tsx  # 语言切换器
├── ui/                  # shadcn/ui 组件
│   ├── button.tsx      # 按钮组件
│   ├── card.tsx        # 卡片组件
│   └── progress.tsx    # 进度条组件
└── FeedbackForm.tsx    # 反馈表单组件
```

### lib/ - 适配层

向后兼容适配层，重新导出新架构的代码。

```
lib/
├── utils.ts            # 工具函数适配层（重新导出 @/shared/utils/cn）
├── questions.ts        # 问题服务适配层（重新导出 QuestionService）
├── store.ts           # 状态管理适配层（重新导出 useAppStore）
├── useTTS.ts          # TTS hook 适配层（重新导出 useTTS）
└── i18n.ts            # next-intl 配置
```

**为什么保留适配层？**

- 确保向后兼容性
- shadcn/ui 组件依赖 `@/lib/utils`
- 其他可能仍在使用旧路径的代码可以继续工作
- 作为过渡期的安全网

### data/ - 静态数据

JSON 格式的静态数据文件。

```
data/
├── questions/          # 问题数据
│   ├── en/           # 英文问题
│   ├── es/           # 西班牙文问题
│   └── zh/           # 中文问题
├── glossary/         # 词汇表数据
└── grammar/          # 语法数据
```

### docs/ - 项目文档

项目相关文档。

```
docs/
├── ARCHITECTURE.md    # 架构文档
├── MODULES.md         # 模块文档
├── TESTING.md         # 测试文档
└── PROJECT_STRUCTURE.md  # 项目结构文档（本文件）
```

### e2e/ - E2E 测试

Playwright E2E 测试文件。

```
e2e/
├── quiz.spec.ts       # Quiz 功能测试
├── flashcards.spec.ts # Flashcards 功能测试
├── i18n.spec.ts       # 多语言功能测试
├── fixtures/          # 测试数据（预留）
└── utils/             # 测试工具（预留）
```

### __mocks__/ - Jest Mock

Jest 测试的 Mock 文件。

```
__mocks__/
├── next/
│   └── navigation.js  # Mock next/navigation
└── next-intl.js       # Mock next-intl
```

### i18n/ - 国际化配置

next-intl 的配置文件。

```
i18n/
└── request.ts         # next-intl 请求配置（必需）
```

## 配置文件

### 根目录配置文件

- `package.json` - 项目依赖和脚本
- `tsconfig.json` - TypeScript 配置
- `next.config.ts` - Next.js 配置
- `next-intl.config.ts` - next-intl 路由配置
- `jest.config.js` - Jest 测试配置
- `jest.setup.js` - Jest 测试设置
- `playwright.config.ts` - Playwright E2E 测试配置
- `components.json` - shadcn/ui 配置
- `eslint.config.mjs` - ESLint 配置
- `.gitignore` - Git 忽略文件

## 文件用途分类

### 必须保留的文件

#### 核心架构文件
- `src/core/` - 核心基础设施
- `src/shared/` - 共享资源
- `src/modules/` - 功能模块

#### 适配层文件
- `lib/utils.ts` - shadcn/ui 组件依赖
- `lib/questions.ts` - 向后兼容
- `lib/store.ts` - 向后兼容
- `lib/useTTS.ts` - 向后兼容
- `lib/i18n.ts` - next-intl 配置

#### 配置文件
- `i18n/request.ts` - next-intl 必需
- `next-intl.config.ts` - next-intl 路由配置
- `components.json` - shadcn/ui 配置

#### 组件文件
- `components/layout/` - 布局组件
- `components/ui/` - shadcn/ui 组件
- `components/FeedbackForm.tsx` - 反馈表单

#### 数据文件
- `data/` - 所有 JSON 数据文件
- `messages/` - 国际化消息文件

#### 测试文件
- `e2e/` - E2E 测试
- `src/**/__tests__/` - 单元测试
- `__mocks__/` - Jest Mock

### 可以删除的文件（已删除）

- `types/next-auth.d.ts` - 空文件，项目未使用 next-auth（已删除）

## 导入路径约定

### 新架构路径（推荐）

```typescript
// 核心基础设施
import { QuestionService } from '@/core/services/data/questionService';
import { StorageService } from '@/core/services/storage/storageService';
import { useAppStore } from '@/core/store';
import type { Locale, Question } from '@/core/types';

// 共享资源
import { useTTS } from '@/shared/hooks/useTTS';
import { cn } from '@/shared/utils/cn';

// 功能模块
import { QuizRunner } from '@/modules/quiz';
import { FlashcardViewer } from '@/modules/flashcards';
import { GlossaryViewer } from '@/modules/glossary';
import { GrammarViewer, GrammarPractice } from '@/modules/grammar';
```

### 适配层路径（向后兼容）

```typescript
// 这些路径仍然可用，但内部使用新架构
import { loadQuestions } from '@/lib/questions';
import { useQuizStore } from '@/lib/store';
import { useTTS } from '@/lib/useTTS';
import { cn } from '@/lib/utils';
```

## 目录组织原则

1. **模块化**: 每个功能独立成模块
2. **分层清晰**: core → shared → modules
3. **向后兼容**: 适配层确保平滑迁移
4. **类型安全**: 所有代码使用 TypeScript
5. **测试覆盖**: 单元测试和 E2E 测试

## 迁移历史

- **阶段 1**: 创建核心基础设施
- **阶段 2**: 创建向后兼容适配层
- **阶段 3**: 迁移所有功能模块
- **阶段 4**: 清理旧文件
- **阶段 5**: 添加测试和质量保证
- **阶段 6**: 最终清理和整理

## 维护指南

### 添加新功能

1. 在 `src/modules/` 下创建新模块
2. 按照标准结构组织（types, hooks, components, services）
3. 在模块根目录创建 `index.ts` 统一导出
4. 在页面中使用新模块

### 修改现有功能

1. 优先修改 `src/modules/` 中的新架构代码
2. 适配层会自动反映更改
3. 逐步迁移使用旧路径的代码

### 添加新共享资源

1. 根据类型添加到 `src/shared/` 相应目录
2. 如果是 hook，添加到 `src/shared/hooks/`
3. 如果是工具函数，添加到 `src/shared/utils/`

## 注意事项

- 不要直接修改 `lib/` 中的适配层实现，它们只是重新导出
- 新代码应该使用 `@/core/*`, `@/shared/*`, `@/modules/*` 路径
- 保持模块独立性，避免模块间直接依赖
- 所有公共 API 应该有完整的类型定义和 JSDoc 注释
