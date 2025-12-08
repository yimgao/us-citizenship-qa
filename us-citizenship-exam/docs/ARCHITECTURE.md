# 架构文档

## 概述

本项目采用模块化架构设计，将功能按模块组织，提高代码的可维护性、可扩展性和可复用性。

## 目录结构

```
us-citizenship-exam/
├── src/
│   ├── core/              # 核心基础设施
│   │   ├── types/         # 共享类型定义
│   │   ├── constants/     # 应用常量
│   │   ├── services/      # 数据和服务层
│   │   └── store/         # 状态管理（Zustand）
│   ├── shared/            # 共享资源
│   │   ├── hooks/         # 可复用的 React hooks
│   │   ├── utils/         # 工具函数
│   │   └── ui/            # 共享 UI 组件
│   └── modules/           # 功能模块
│       ├── quiz/          # Quiz 模块
│       ├── flashcards/    # Flashcards 模块
│       ├── glossary/      # Glossary 模块
│       └── grammar/       # Grammar 模块
├── app/                   # Next.js App Router 页面
├── components/            # 遗留组件（布局、UI）
├── lib/                   # 适配层（向后兼容）
└── data/                  # 静态 JSON 数据文件
```

## 核心层 (Core)

### 类型系统 (`src/core/types/`)

定义应用程序的基础类型：

- `common.types.ts`: 通用类型（Locale, Category 等）
- `question.types.ts`: 问题相关类型
- `store.types.ts`: 状态管理类型

### 常量 (`src/core/constants/`)

- `quiz.constants.ts`: Quiz 相关常量（PASS_THRESHOLD 等）
- `routes.constants.ts`: 路由常量

### 服务层 (`src/core/services/`)

- `data/questionService.ts`: 问题数据加载服务
- `storage/storageService.ts`: localStorage 封装服务

### 状态管理 (`src/core/store/`)

使用 Zustand 进行状态管理：

- `slices/quizSlice.ts`: Quiz 状态切片
- `slices/userSlice.ts`: 用户状态切片（预留）
- `index.ts`: Store 组合和导出

## 共享层 (Shared)

### Hooks (`src/shared/hooks/`)

- `useTTS.ts`: 文本转语音 hook
- `useLocalStorage.ts`: localStorage 通用 hook

### 工具函数 (`src/shared/utils/`)

- `cn.ts`: Tailwind CSS 类名合并工具

### UI 组件 (`src/shared/ui/`)

共享的 UI 组件（预留）

## 模块层 (Modules)

每个功能模块都是自包含的，包含：

- `types/`: 模块特定类型
- `services/`: 模块特定服务（如果需要）
- `hooks/`: 模块特定 hooks
- `components/`: 模块组件
- `index.ts`: 模块统一导出

### Quiz 模块

提供 Quiz 练习和测试功能。

**主要组件：**
- `QuizRunner`: 主组件
- `QuizQuestion`: 问题显示
- `QuizResults`: 结果展示
- `QuizNavigation`: 导航控制
- `QuizProgress`: 进度条

**主要 Hooks：**
- `useQuiz`: 主业务逻辑 hook
- `useQuizProgress`: 进度和分数计算
- `useQuizStorage`: 存储持久化

### Flashcards 模块

提供闪卡学习功能。

**主要组件：**
- `FlashcardViewer`: 主组件
- `FlashcardCard`: 卡片组件（带翻转动画）
- `FlashcardFilters`: 过滤器
- `FlashcardNavigation`: 导航控制

**主要 Hooks：**
- `useFlashcards`: 主业务逻辑 hook
- `useFlashcardSwipe`: 滑动手势处理

### Glossary 模块

提供词汇表查看功能。

**主要组件：**
- `GlossaryViewer`: 主组件
- `GlossaryCard`: 卡片组件（多语言显示）
- `GlossaryNavigation`: 导航控制

**主要 Hooks：**
- `useGlossary`: 主业务逻辑 hook

**服务：**
- `GlossaryService`: 词汇表数据加载

### Grammar 模块

提供语法学习和练习功能。

**主要组件：**
- `GrammarViewer`: 语法规则查看器
- `GrammarRuleCard`: 规则卡片
- `GrammarPractice`: 练习组件
- `ExerciseCard`: 练习卡片

**主要 Hooks：**
- `useGrammar`: 语法查看器逻辑 hook

**服务：**
- `GrammarService`: 语法数据加载

## 适配层 (Adapter Layer)

`lib/` 目录下的文件作为向后兼容适配层：

- `lib/questions.ts`: 重新导出 QuestionService
- `lib/store.ts`: 重新导出 useAppStore
- `lib/useTTS.ts`: 重新导出 useTTS hook
- `lib/utils.ts`: 工具函数（如果仍在使用）
- `lib/i18n.ts`: next-intl 配置（必须保留）

## 设计原则

1. **模块化**: 每个功能独立成模块，便于维护和扩展
2. **类型安全**: 完整的 TypeScript 类型覆盖
3. **可复用性**: 共享 hooks、工具和组件
4. **关注点分离**: UI、逻辑和数据清晰分离
5. **向后兼容**: 适配层确保旧代码继续工作

## 导入路径约定

### 核心基础设施

```typescript
import { QuestionService } from '@/core/services/data/questionService';
import { StorageService } from '@/core/services/storage/storageService';
import { useAppStore } from '@/core/store';
import type { Locale, Question } from '@/core/types';
```

### 共享资源

```typescript
import { useTTS } from '@/shared/hooks/useTTS';
import { cn } from '@/shared/utils/cn';
```

### 功能模块

```typescript
import { QuizRunner } from '@/modules/quiz';
import { FlashcardViewer } from '@/modules/flashcards';
import { GlossaryViewer } from '@/modules/glossary';
import { GrammarViewer, GrammarPractice } from '@/modules/grammar';
```

## 状态管理

使用 Zustand 进行客户端状态管理：

- **Quiz 状态**: 答案、收藏、错误记录
- **用户状态**: 预留用于未来用户功能

状态通过 `StorageService` 持久化到 localStorage。

## 数据流

1. **页面层** (`app/[locale]/*/page.tsx`): 加载数据，传递给组件
2. **模块组件**: 使用 hooks 管理状态和逻辑
3. **服务层**: 处理数据加载和存储
4. **状态管理**: 全局状态通过 Zustand 管理

## 扩展指南

### 添加新模块

1. 在 `src/modules/` 下创建新模块目录
2. 按照标准结构创建 `types/`, `hooks/`, `components/` 等
3. 在模块根目录创建 `index.ts` 统一导出
4. 在页面中使用新模块

### 添加新共享资源

1. 根据类型添加到 `src/shared/` 相应目录
2. 如果是 hook，添加到 `src/shared/hooks/`
3. 如果是工具函数，添加到 `src/shared/utils/`

## 迁移历史

本项目从传统的组件结构迁移到模块化架构：

- **阶段 1**: 创建核心基础设施
- **阶段 2**: 创建向后兼容适配层
- **阶段 3**: 迁移所有功能模块
- **阶段 4**: 清理旧文件，更新文档

旧组件文件已删除，但适配层保留以确保兼容性。
