# 测试文档

本文档说明如何运行测试、测试策略和测试覆盖范围。

## 测试框架

### 单元测试

- **框架**: Jest + React Testing Library
- **配置文件**: `jest.config.js`
- **设置文件**: `jest.setup.js`

### E2E 测试

- **框架**: Playwright
- **配置文件**: `playwright.config.ts`
- **测试目录**: `e2e/`

## 运行测试

### 单元测试

```bash
# 运行所有测试
npm test

# 监视模式（自动重新运行）
npm run test:watch

# 生成覆盖率报告
npm run test:coverage
```

### E2E 测试

```bash
# 运行所有 E2E 测试
npm run test:e2e

# 使用 UI 模式运行（交互式）
npm run test:e2e:ui
```

## 测试结构

### 单元测试目录结构

```
src/
├── core/
│   └── services/
│       ├── storage/
│       │   └── __tests__/
│       │       └── storageService.test.ts
│       └── data/
│           └── __tests__/
│               └── questionService.test.ts
├── shared/
│   ├── hooks/
│   │   └── __tests__/
│   │       ├── useTTS.test.ts
│   │       └── useLocalStorage.test.ts
│   └── utils/
│       └── __tests__/
│           └── cn.test.ts
└── modules/
    ├── quiz/
    │   ├── hooks/
    │   │   └── __tests__/
    │   │       ├── useQuiz.test.ts
    │   │       ├── useQuizProgress.test.ts
    │   │       └── useQuizStorage.test.ts
    │   └── components/
    │       └── QuizRunner/
    │           └── __tests__/
    │               ├── QuizProgress.test.tsx
    │               └── QuizQuestion.test.tsx
    └── flashcards/
        └── components/
            └── FlashcardViewer/
                └── __tests__/
                    └── FlashcardCard.test.tsx
```

### E2E 测试目录结构

```
e2e/
├── quiz.spec.ts          # Quiz 功能测试
├── flashcards.spec.ts   # Flashcards 功能测试
├── i18n.spec.ts          # 多语言功能测试
├── fixtures/             # 测试数据
└── utils/                # 测试工具
```

## 测试策略

### 单元测试

#### 服务层测试

- **StorageService**: 测试所有 CRUD 操作、类型安全、错误处理
- **QuestionService**: 测试数据加载、过滤、分页功能

#### Hooks 测试

- 使用 `renderHook` 测试 hooks
- Mock 依赖（如 StorageService, useAppStore）
- 测试状态变化和副作用

#### 组件测试

- 使用 React Testing Library 测试组件渲染
- 测试用户交互（点击、输入等）
- 测试条件渲染和状态显示

### E2E 测试

#### 主要用户流程

- **Quiz**: 页面加载 → 选择答案 → 查看结果
- **Flashcards**: 页面加载 → 翻转卡片 → 导航
- **多语言**: 语言切换 → 内容翻译验证

#### 测试原则

- 测试真实用户场景
- 使用语义化选择器（getByRole, getByText）
- 避免测试实现细节

## Mock 配置

### Next.js 模块 Mock

在 `jest.setup.js` 中配置了以下 Mock：

- `next/navigation`: useRouter, usePathname, useSearchParams
- `next-intl`: useTranslations, useLocale
- `localStorage`: 浏览器存储 API
- `SpeechSynthesis`: TTS API

### 自定义 Mock

Mock 文件位于 `__mocks__/` 目录：

- `__mocks__/next-intl.js`
- `__mocks__/next/navigation.js`

## 测试覆盖率目标

- **核心服务**: 80%+
- **Hooks**: 70%+
- **组件**: 60%+
- **E2E**: 主要用户流程 100%

## 编写新测试

### 单元测试示例

```typescript
import { renderHook } from '@testing-library/react';
import { useQuizProgress } from '../useQuizProgress';

describe('useQuizProgress', () => {
  it('should calculate correct score', () => {
    const questions = [/* ... */];
    const answers = { '1': '0' };
    
    const { result } = renderHook(() => 
      useQuizProgress(questions, answers)
    );
    
    expect(result.current.correct).toBe(1);
  });
});
```

### 组件测试示例

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { QuizProgress } from '../QuizProgress';

describe('QuizProgress', () => {
  it('should render progress information', () => {
    render(<QuizProgress current={5} total={10} isTestMode={false} />);
    
    expect(screen.getByText(/5/)).toBeInTheDocument();
    expect(screen.getByText(/10/)).toBeInTheDocument();
  });
});
```

### E2E 测试示例

```typescript
import { test, expect } from '@playwright/test';

test('should load quiz page', async ({ page }) => {
  await page.goto('/en/quiz');
  await expect(page).toHaveTitle(/Quiz/i);
});
```

## 最佳实践

1. **测试行为，不测试实现**: 关注用户可见的行为，而不是内部实现
2. **使用语义化查询**: 优先使用 `getByRole`, `getByLabelText` 等
3. **保持测试独立**: 每个测试应该可以独立运行
4. **Mock 外部依赖**: 隔离测试，不依赖外部服务
5. **测试边界情况**: 包括错误处理、空值、边界值

## 调试测试

### Jest 调试

```bash
# 运行单个测试文件
npm test -- storageService.test.ts

# 运行匹配模式的测试
npm test -- --testNamePattern="should return"

# 详细输出
npm test -- --verbose
```

### Playwright 调试

```bash
# 使用 UI 模式
npm run test:e2e:ui

# 调试模式（暂停执行）
npm run test:e2e -- --debug

# 运行单个测试文件
npm run test:e2e -- quiz.spec.ts
```

## CI/CD 集成

项目已配置 GitHub Actions CI/CD 工作流，自动运行测试：

### CI 工作流 (`.github/workflows/ci.yml`)

CI 流程包括以下步骤：

1. **Lint 检查**: 运行 ESLint 代码质量检查
2. **单元测试**: 运行 Jest 测试套件并生成覆盖率报告
3. **构建验证**: 运行 Next.js 生产构建验证
4. **E2E 测试**: 运行 Playwright 端到端测试
5. **数据验证**: 验证 JSON 数据文件的格式和内容

### 覆盖率报告

CI 会自动上传测试覆盖率报告到 Codecov（如果配置）。

### 本地运行 CI 检查

```bash
# 运行所有 CI 检查
npm run lint
npm test
npm run build
npm run test:e2e
npm run data:check
```

## 常见问题

### 测试失败：找不到模块

确保 `jest.config.js` 中的 `moduleNameMapper` 配置正确，包含所有路径别名。

### E2E 测试超时

增加 `playwright.config.ts` 中的 `timeout` 设置，或检查服务器是否正常启动。

### Mock 不工作

确保 Mock 文件在正确的位置，并且 `jest.setup.js` 中正确配置。

## 参考资料

- [Jest 文档](https://jestjs.io/docs/getting-started)
- [React Testing Library 文档](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright 文档](https://playwright.dev/docs/intro)
