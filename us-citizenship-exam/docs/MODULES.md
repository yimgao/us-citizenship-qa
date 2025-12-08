# 模块文档

本文档详细说明各个功能模块的结构和使用方式。

## Quiz 模块

### 目录结构

```
src/modules/quiz/
├── types/
│   ├── quiz.types.ts      # Quiz 类型定义
│   └── index.ts
├── hooks/
│   ├── useQuiz.ts         # 主业务逻辑 hook
│   ├── useQuizProgress.ts # 进度和分数计算
│   ├── useQuizStorage.ts  # 存储持久化
│   └── index.ts
├── components/
│   └── QuizRunner/
│       ├── QuizRunner.tsx      # 主组件
│       ├── QuizQuestion.tsx    # 问题显示
│       ├── QuizResults.tsx     # 结果展示
│       ├── QuizNavigation.tsx   # 导航控制
│       ├── QuizProgress.tsx    # 进度条
│       └── index.tsx
└── index.ts               # 模块统一导出
```

### 使用示例

```typescript
import { QuizRunner } from '@/modules/quiz';
import { QuestionService } from '@/core/services/data/questionService';

// 在页面中
const questions = await QuestionService.loadQuestions(locale, category, mode);
<QuizRunner 
  questions={questions} 
  storageKey={`${locale}:${mode}:${category}`}
  mode="practice"
/>
```

### 主要类型

- `QuizMode`: 'practice' | 'test'
- `ReviewFilter`: 'all' | 'wrong' | 'starred'
- `QuizConfig`: 配置对象
- `QuizState`: 状态对象
- `QuizScore`: 分数对象

### 主要 Hooks

#### useQuiz

主业务逻辑 hook，管理整个 Quiz 流程。

```typescript
const {
  currentIndex,
  submitted,
  currentQuestion,
  score,
  handleAnswer,
  goToNext,
  goToPrevious,
  reset,
  tts,
} = useQuiz({ questions, storageKey, mode });
```

#### useQuizProgress

计算进度和分数。

```typescript
const score = useQuizProgress(questions, answers);
// 返回: { correct, total, percentage, passed }
```

#### useQuizStorage

处理 localStorage 持久化。

```typescript
useQuizStorage(storageKey, answers, onLoad);
```

## Flashcards 模块

### 目录结构

```
src/modules/flashcards/
├── types/
│   ├── flashcard.types.ts # Flashcard 类型定义
│   └── index.ts
├── hooks/
│   ├── useFlashcards.ts   # 主业务逻辑 hook
│   ├── useFlashcardSwipe.ts # 滑动手势处理
│   └── index.ts
├── components/
│   └── FlashcardViewer/
│       ├── FlashcardViewer.tsx    # 主组件
│       ├── FlashcardCard.tsx      # 卡片组件
│       ├── FlashcardFilters.tsx   # 过滤器
│       ├── FlashcardNavigation.tsx # 导航控制
│       └── index.tsx
└── index.ts
```

### 使用示例

```typescript
import { FlashcardViewer } from '@/modules/flashcards';
import { QuestionService } from '@/core/services/data/questionService';

const cards = await QuestionService.loadQuestions(locale, category);
<FlashcardViewer cards={cards} />
```

### 主要类型

- `Flashcard`: 与 Question 相同结构
- `FlashcardFilter`: 'all' | 'starred' | 'missed'

### 主要 Hooks

#### useFlashcards

管理 flashcard 状态和逻辑。

```typescript
const {
  currentIndex,
  showAnswer,
  currentCard,
  goToNext,
  goToPrevious,
  toggleFlip,
  toggleStar,
  tts,
} = useFlashcards({ cards, locale });
```

#### useFlashcardSwipe

处理滑动手势。

```typescript
const swipeHandlers = useFlashcardSwipe({
  onSwipeLeft: goToNext,
  onSwipeRight: goToPrevious,
  onSwipeUp: toggleFlip,
  onSwipeDown: toggleFlip,
});
```

## Glossary 模块

### 目录结构

```
src/modules/glossary/
├── types/
│   ├── glossary.types.ts  # Glossary 类型定义
│   └── index.ts
├── services/
│   ├── glossaryService.ts # 数据加载服务
│   └── index.ts
├── hooks/
│   ├── useGlossary.ts     # 主业务逻辑 hook
│   └── index.ts
├── components/
│   └── GlossaryViewer/
│       ├── GlossaryViewer.tsx    # 主组件
│       ├── GlossaryCard.tsx      # 卡片组件
│       ├── GlossaryNavigation.tsx # 导航控制
│       └── index.tsx
└── index.ts
```

### 使用示例

```typescript
import { GlossaryViewer, GlossaryService } from '@/modules/glossary';

const items = await GlossaryService.loadGlossary();
<GlossaryViewer items={items} locale={locale} />
```

### 主要类型

- `GlossaryItem`: 词汇项（包含多语言 term 和 definitions）
- `GlossaryState`: 状态对象

### 主要 Hooks

#### useGlossary

管理 glossary 状态和逻辑。

```typescript
const {
  currentIndex,
  showDefinition,
  currentItem,
  goToNext,
  goToPrevious,
  toggleFlip,
  speakInLang,
  swipeHandlers,
} = useGlossary({ items, locale });
```

### 服务

#### GlossaryService

```typescript
const items = await GlossaryService.loadGlossary();
```

## Grammar 模块

### 目录结构

```
src/modules/grammar/
├── types/
│   ├── grammar.types.ts   # Grammar 类型定义
│   └── index.ts
├── services/
│   ├── grammarService.ts  # 数据加载服务
│   └── index.ts
├── hooks/
│   ├── useGrammar.ts      # 语法查看器 hook
│   └── index.ts
├── components/
│   ├── GrammarViewer/
│   │   ├── GrammarViewer.tsx     # 主组件
│   │   ├── GrammarRuleCard.tsx   # 规则卡片
│   │   └── index.tsx
│   └── GrammarPractice/
│       ├── GrammarPractice.tsx   # 练习组件
│       ├── ExerciseCard.tsx      # 练习卡片
│       └── index.tsx
└── index.ts
```

### 使用示例

```typescript
import { GrammarViewer, GrammarPractice, GrammarService } from '@/modules/grammar';

// 查看模式
const rules = await GrammarService.getAllRules(locale, topicId);
<GrammarViewer rules={rules} locale={locale} />

// 练习模式
const exercises = await GrammarService.loadExercises(locale, topicId);
<GrammarPractice 
  exercises={exercises} 
  storageKey={`${locale}:grammar:practice:${topicId}`}
/>
```

### 主要类型

- `ExerciseType`: 'fill-blank' | 'multiple-choice' | 'sentence-reorder' | 'correction'
- `GrammarRule`: 语法规则
- `GrammarExercise`: 语法练习
- `GrammarTopic`: 语法主题
- `GrammarData`: 完整数据

### 主要 Hooks

#### useGrammar

管理语法查看器状态和逻辑。

```typescript
const {
  currentIndex,
  showExplanation,
  currentRule,
  goToNext,
  goToPrevious,
  toggleFlip,
  speakInLang,
  swipeHandlers,
} = useGrammar({ rules, locale });
```

### 服务

#### GrammarService

```typescript
// 加载所有主题
const topics = await GrammarService.getAllTopics(locale);

// 加载规则
const rules = await GrammarService.getAllRules(locale, topicId);

// 加载特定规则
const rule = await GrammarService.loadGrammarRule(locale, ruleId);

// 加载练习
const exercises = await GrammarService.loadExercises(locale, topicId, exerciseType);
```

## 模块开发指南

### 创建新模块

1. **创建目录结构**
   ```bash
   src/modules/[module-name]/
   ├── types/
   ├── hooks/
   ├── components/
   └── index.ts
   ```

2. **定义类型** (`types/[module].types.ts`)
   ```typescript
   export interface ModuleState {
     // 状态定义
   }
   ```

3. **创建 Hooks** (`hooks/use[Module].ts`)
   ```typescript
   export function useModule(options: UseModuleOptions) {
     // Hook 逻辑
   }
   ```

4. **创建组件** (`components/[Component]/[Component].tsx`)
   ```typescript
   export function Component(props: ComponentProps) {
     // 组件逻辑
   }
   ```

5. **统一导出** (`index.ts`)
   ```typescript
   export * from './components';
   export * from './hooks';
   export * from './types';
   ```

### 最佳实践

1. **类型优先**: 先定义类型，再实现逻辑
2. **Hook 提取**: 将业务逻辑提取到 hooks 中
3. **组件拆分**: 将大组件拆分为小组件
4. **统一导出**: 通过 `index.ts` 统一导出
5. **文档注释**: 为公共 API 添加 JSDoc 注释

## 模块间依赖

模块应该：
- ✅ 依赖 `@/core/*` 核心基础设施
- ✅ 依赖 `@/shared/*` 共享资源
- ❌ 避免直接依赖其他功能模块
- ❌ 避免依赖 `@/lib/*`（除非是适配层）

## 测试建议

每个模块应该包含：
- 类型测试（TypeScript 编译检查）
- Hook 测试（如果使用测试框架）
- 组件测试（如果使用测试框架）

## 未来扩展

- [ ] 添加单元测试
- [ ] 添加 Storybook 文档
- [ ] 性能优化和代码分割
- [ ] E2E 测试
