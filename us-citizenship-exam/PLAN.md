# Citizenship Prep — 完整项目计划 (Duolingo 风格)

## 视觉方向

```
参考: Duolingo
调性: 友好、彩色、圆润、游戏感、教育
核心色: #58cc02 (Duolingo 绿)
辅助色:  蓝 (#1cb0f6), 橙 (#ff9600), 粉 (#ff4b4b), 紫 (#ce82ff)
背景:    白色为主, 浅灰卡片
字体:    Geist (保留), 大号、粗体、友好
圆角:    super round — 16px-24px
图标:    lucide-react, 粗线条
动效:    弹跳弹簧动画 (spring physics)
```

## 调色板

```
Primary:    #58cc02 (Duolingo 绿)
Primary BG: #e5f5d0 (浅绿背景)
Secondary:  #1cb0f6 (蓝)
Danger:     #ff4b4b (红)
Warning:    #ff9600 (橙)
Accent:     #ce82ff (紫)
Success:    #58a700 (深绿)
Bg:         #ffffff
Bg Alt:     #f7f7f7 (浅灰)
Card:       #ffffff
Text:       #4b4b4b (深灰, 非纯黑)
Text Dim:   #afafaf (浅灰)
Border:     #e5e5e5

Dark mode: 不需要 (Duolingo 没有深色模式, 保持明亮友好)
```

## 布局结构

### 导航 (Navbar)
- 顶部固定, 白色背景, 底部绿色 2px border
- 左: C logo (绿底白字圆角方块)
- 中: 导航链接 (Home, Quiz, Flashcards, Grammar, Resources)
- 右: 语言切换 dropdown + 设置
- Mobile: 汉堡菜单

### 首页 Hero
- 大号圆角绿色板块, 白色文字
- 标题: "Your Path to Citizenship" (大、粗、白)
- 副标题: "Free practice for the U.S. naturalization civics test"
- 大号白色 CTA 按钮: "Start Practicing →" (绿底)
- 3 个统计数字: 10K+ learners · 100 questions · 3 languages
- 背景: 绿色渐变, 带简单的 SVG 装饰 (星星/条纹图案)

### 功能卡片区 (取代之前的 bento)
- 简洁的 4 格 grid (2x2)
- 每格: 圆角卡片, 左边图标 (彩色圆形 bg), 标题, 描述
- 点击跳转
- 没有图片, 纯卡片+图标 (Duolingo 风格)

### CTA 区域
- 紫色 (#ce82ff) 背景板块
- "Ready to start?" 白色标题
- 白色按钮

### Footer
- 简单, 浅灰背景
- 三栏: Brand + Links + Built with
- 置灰文字

## 页面清单

### 现有可复用的 (不要重写)
- `lib/questions.ts` — 题库加载逻辑
- `lib/grammar.ts` — 语法数据
- `lib/store.ts` — Zustand state
- `lib/useTTS.ts` — 语音合成
- `lib/utils.ts` — 工具函数
- `data/` — 所有 JSON 数据
- `messages/` — 翻译文件 (需要更新 key?)

### 需要新写的

**配置文件:**
- `app/globals.css` — Duolingo 风格调色板
- `app/layout.tsx` — 根 layout
- `app/page.tsx` — 语言选择页
- `middleware.ts` — next-intl 路由

**布局组件:**
- `app/[locale]/layout.tsx` — Geist font, Navbar, Footer
- `components/layout/Navbar.tsx`
- `components/layout/Footer.tsx`
- `components/layout/LanguageSwitcher.tsx`

**首页:**
- `app/[locale]/page.tsx` — Server component
- `components/sections/HeroSection.tsx` — 绿底 Hero
- `components/sections/FeatureGrid.tsx` — 2x2 卡片

**内页:**
- `app/[locale]/quiz/page.tsx`
- `components/quiz/QuizRunner.tsx`
- `app/[locale]/flashcards/page.tsx`
- `components/flashcards/FlashcardViewer.tsx`
- `app/[locale]/glossary/page.tsx`
- `components/glossary/GlossaryViewer.tsx`
- `app/[locale]/grammar/page.tsx`
- `components/grammar/GrammarViewer.tsx`
- `components/grammar/GrammarPractice.tsx`
- `app/[locale]/resources/page.tsx`
- `components/FeedbackForm.tsx` (keep existing)

## 构建顺序

```
Phase 1: Design System (globals.css + colors)
Phase 2: Layout Shell (layout, navbar, footer)
Phase 3: Homepage (hero + feature cards)
Phase 4: Quiz page + runner
Phase 5: Flashcards
Phase 6: Glossary
Phase 7: Grammar
Phase 8: Resources
Phase 9: Polish + verify
```

开始前确认这个方向。如果 OK，我从 Phase 1 开始。
