# 《人机界面指南》无障碍设计精要与工程落地指南 (HIG Accessibility Guide)

> **“让每个人都能以适合自己的方式，独立、自信、愉悦地使用科技。”**  
> 本指南深度提炼自 Apple 官方《人机界面指南》（Human Interface Guidelines - Accessibility），结合现代 Web / 移动交互标准，沉淀为本项目从设计构思、视觉排版到代码实现的根本性无障碍实践规范。

---

## 目录

1. [无障碍设计的四大根本原则 (Core Principles)](#1-无障碍设计的四大根本原则-core-principles)
2. [四大感知与交互能力维度规范 (The 4 Dimensions)](#2-四大感知与交互能力维度规范-the-4-dimensions)
   - [2.1 视觉 (Vision)](#21-视觉-vision)
   - [2.2 动作与肢体机能 (Mobility & Motor)](#22-动作与肢体机能-mobility--motor)
   - [2.3 认知与专注 (Cognitive)](#23-认知与专注-cognitive)
   - [2.4 听觉与多通道反馈 (Hearing & Multi-Sensory)](#24-听觉与多通道反馈-hearing--multi-sensory)
3. [屏幕朗读器 (VoiceOver / 旁白) 与语义化工程规范](#3-屏幕朗读器-voiceover--旁白-与语义化工程规范)
4. [键盘导航与焦点管理规范 (Keyboard Navigation)](#4-键盘导航与焦点管理规范-keyboard-navigation)
5. [HIG 无障碍工程审查核对表 (Accessibility Audit Checklist)](#5-hig-无障碍工程审查核对表-accessibility-audit-checklist)
6. [本项目在代码中的具体落实方案](#6-本项目在代码中的具体落实方案)

---

## 1. 无障碍设计的四大根本原则 (Core Principles)

Apple HIG 指出，无障碍设计并非特定人群的“附加功能”，而是衡量整体设计成熟度与人本关怀的试金石。所有界面交互必须建立在以下四大基石之上：

### 1.1 简明 (Simplicity)
- **去除认知噪点**：界面去除不必要的装饰、阴影浮层与多层卡片嵌套，让用户视线与操作直达核心内容。
- **直白精准的表达**：避免抽象技术术语、生涩黑话或多义性缩写。每一个操作按钮、输入提示与错误信息均使用平实易懂的生活化用语。

### 1.2 直观 (Perceivability)
- **多通道信息传达**：绝不依赖单一感官通道传递信息。重要状态、警告或完成提示，必须通过视觉文字、高对比图标及触觉/动效等多途径同步表达。
- **符合物理与心理认知**：交互逻辑符合人类既有的现实认知习惯（如食物克数递增、三餐时间脉络、卡片自然展开与收起）。

### 1.3 易懂 (Understandability)
- **可预测的行为模式**：界面控件在全站保持统一的外观与行为逻辑。同一个交互动作（如点击保存、点击返回、键盘回车）在任何场景下产生一致且预期的结果。
- **宽容的容错机制 (Forgiving Design)**：允许用户自由探索，所有破坏性操作（如删除自建食谱）必须提供清晰的二次确认；误操作可轻松撤销或随时取消重填。

### 1.4 适应性 (Adaptability)
- **尊重用户系统偏好**：软件必须能自然响应并适配系统的各项无障碍个性化设置，包括：
  - **动态字体 (Dynamic Type)** 与大字号缩放
  - **减少动态效果 (Reduce Motion)**
  - **降低透明度 (Reduce Transparency)**
  - **增强对比度 (Increase Contrast)**
  - **深色/浅色外观自适应**

---

## 2. 四大感知与交互能力维度规范 (The 4 Dimensions)

### 2.1 视觉 (Vision)

#### 文本与排版 (Typography & Dynamic Type)
- **字号阶梯自适应**：支持文字缩放，当用户放大字号时，文本容器必须自适应折行或纵向延伸，**严禁截断 (truncate)、省略或容器文字溢出重叠**。
- **基线阅读舒适度**：正文行高保持在 `1.5 ~ 1.7` 倍，段落最大宽度控制在 `65 ~ 75` 个字符以内，避免单行过宽导致视线换行困难。
- **避免纯大写与全角空格**：正文排版避免滥用大写锁定或无意义排版字符，以免屏幕阅读器逐字母朗读破坏语义。

#### 颜色与对比度 (Color & Contrast)
- **WCAG AA 级对比度铁律**：
  - 常规文本（< 18pt 或加粗 < 14pt）与背景的对比度**必须 ≥ 4.5:1**。
  - 大文本（≥ 18pt 或加粗 ≥ 14pt）及关键功能控件边框与背景的对比度**必须 ≥ 3:1**。
- **严禁以颜色作为唯一状态指示 (Never rely on color alone)**：
  - 严禁单纯通过红/绿颜色区分对错、增减或健康达标状态；
  - 必须同时辅以**明确的文字描述**（如“已达标”、“超标”）或**具象图标**（如对勾、警告三角）。

#### 视觉边界与去阴影
- 采用清晰物理边界（如 0.5px 极细浅灰边框 `#E0E0E0`）界定元素边界，在弱视或低对比度显示环境下确保各区块界限一目了然。

---

### 2.2 动作与肢体机能 (Mobility & Motor)

#### 最小触控热区 (Minimum Touch Target Size)
- **44 × 44 pt / 44 × 44 px 黄金法则**：移动端所有可点击或可触摸的交互元素（包括按钮、Tab、选择框、图标链接），其有效点击热区**必须至少达到 44 × 44 px**。
- **视觉小图标的热区扩展**：若界面设计需要小尺寸图标（如 14px 叉号或 16px 垃圾桶），必须通过外层容器的内边距 (`padding`) 确保点击区域不小于 44px。

#### 控件间距 (Hit Target Spacing)
- 相互邻近的交互控件之间必须留有充足间距（建议间距 ≥ 8px），防止肢体抖动或单手拇指操作时发生误触。

#### 简化手势与替代途径 (Alternative Input)
- 杜绝强制使用多指手势、摇晃设备或复杂滑动；所有手势操作（如滑动删除）必须提供对应的基础点击按钮或键盘快捷操作作为等效替代。

---

### 2.3 认知与专注 (Cognitive)

#### 降低认知负荷 (Cognitive Load)
- **信息层级分明**：页面主要任务突出，单屏只专注解决一个核心任务（如选餐、记餐或看谱）。
- **扁平化结构**：杜绝深层嵌套卡片（卡片套卡片），利用严谨的物理分割线和文字粗细层级表达亲疏关联。

#### 即时、明确的情境反馈
- 用户每次保存、添加或删除操作，均在屏幕显著位置弹出温和清晰的状态通知（Toast），明确告知操作结果，并在 2.5 秒后自然退场。

#### 宽容的设计与防呆提醒
- 对于具有破坏性的不可逆操作（如删除自定义食谱），弹出语义化对话框 (`role="alertdialog"`) 进行二次确认，明确说明后果并提供明显的“取消”逃生通道。

---

### 2.4 听觉与多通道反馈 (Hearing & Multi-Sensory)

- **声效可替代性**：本应用任何操作反馈均不单纯依赖音频提示；全部提供屏幕视觉横幅与文字通知，确保听力受损或静音环境下的用户无障碍感知。
- **减弱动态效果支持 (prefers-reduced-motion)**：
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```

---

## 3. 屏幕朗读器 (VoiceOver / 旁白) 与语义化工程规范

Apple VoiceOver 及主流屏幕阅读器依赖结构健全的 DOM 树与 ARIA 规范：

### 3.1 原生语义元素优先 (Use Native Semantic HTML)
- 使用 `<button>` 而非 `<div onClick>`；
- 使用 `<input type="text">`、`<input type="number">`、`<select>`；
- 使用 `<main>`, `<nav>`, `<header>`, `<section>`, `<ul>`, `<li>` 组织页面文档地标。

### 3.2 无障碍标签的最佳撰写实践 (Accessibility Labels)
- **简短、具象、动词开头**：直接描述操作结果，如 `aria-label="删除第 2 种食材"`、`aria-label="返回健康食谱列表"`。
- **杜绝冗余类型词**：屏幕朗读器会自动朗读元素类型，**绝对不要在标签中包含“按钮”、“链接”字样**（错误示范：`aria-label="返回按钮"` 会被朗读成“返回按钮，按钮”）。
- **装饰性图标静音**：所有纯装饰性 SVG 图标必须显式标注 `aria-hidden="true"`，防止屏幕阅读器朗读无意义路径代码。

### 3.3 动态内容状态实时广播 (Live Regions)
- 动态变化的通知条、保存提示，使用 `role="status"` 与 `aria-live="polite"`，确保朗读器在用户操作停顿间隙优雅播报，不粗暴打断用户当前操作。

---

## 4. 键盘导航与焦点管理规范 (Keyboard Navigation)

### 4.1 全功能键盘可操作 (Full Keyboard Accessibility)
- 用户仅依靠键盘（`Tab`、`Shift + Tab`、`Enter`、`Space`、`Escape`）即可完整使用应用的所有核心功能：
  - 搜索食材、调整克数、添加三餐记录；
  - 浏览食谱列表、进入食谱详情、查看贴士；
  - 编写并保存自建私房食谱、删除食谱确认与取消。

### 4.2 醒目的焦点指示器 (Visible Focus Ring)
- 严禁全局重置 `outline: none` 而不提供替代样式。
- 必须通过 `:focus-visible` 针对键盘用户呈现高对比度、清晰的焦点轮廓：
  ```css
  button:focus-visible,
  input:focus-visible,
  select:focus-visible,
  textarea:focus-visible,
  a:focus-visible {
    outline: 2px solid #171717;
    outline-offset: 2px;
  }
  ```

### 4.3 跳转至主要内容 (Skip to Main Content)
- 页面最顶部必须提供“跳至主要内容”快捷锚点链接，默认屏幕阅读器与键盘聚焦时可见，方便屏幕阅读器用户快速跳过重复导航。

---

## 5. HIG 无障碍工程审查核对表 (Accessibility Audit Checklist)

在任何功能上线或重构前，逐项验证以下标准：

| 检查项 | 验证标准 | 状态 |
| :--- | :--- | :---: |
| **对比度 (Contrast)** | 所有文本对比度 ≥ 4.5:1，关键控件与分割线清晰辨识 | ✅ 已达标 |
| **无纯色依赖 (No Color-Only)** | 状态与数据变化辅以文字或图标，不单靠色彩区分 | ✅ 已达标 |
| **触控热区 (Hit Target)** | 移动端交互按钮最小尺寸 ≥ 44 × 44 px | ✅ 已达标 |
| **动效偏好 (Reduced Motion)** | 全局配置 `prefers-reduced-motion` 降级，避免眩晕晃动 | ✅ 已达标 |
| **屏幕朗读器 (Screen Reader)** | 图标按钮具备具象 `aria-label`，装饰图标标注 `aria-hidden` | ✅ 已达标 |
| **键盘无障碍 (Keyboard)** | 全流程键盘可触达，配备清晰的 `:focus-visible` 轮廓 | ✅ 已达标 |
| **实时通知 (Live Status)** | 保存与反馈消息配置 `role="status"` 与 `aria-live="polite"` | ✅ 已达标 |
| **安全跳过 (Skip Link)** | 页面顶部提供“跳至主要内容”快速跳跃链接 | ✅ 已达标 |
| **破坏操作防护 (Safeguards)** | 删除自建食谱提供二次确认对话框，允许轻松撤销 | ✅ 已达标 |

---

## 6. 本项目在代码中的具体落实方案

1. **`src/index.css`**：
   - 注入 `:focus-visible` 全局高对比度 2px 外轮廓；
   - 注入 `@media (prefers-reduced-motion: reduce)` 瞬时过渡兜底；
   - 物理 0.5px 高清极细边框，提供优于模糊阴影的物理边缘识别度。
2. **`src/App.tsx`**：
   - 顶部提供语义化 Skip Link (`跳至主要内容`)；
   - 浮动提示容器赋予 `role="status"` 与 `aria-live="polite"`；
   - 顶部导航赋予 `role="tablist"`，内容区域赋予 `role="tabpanel"`。
3. **`src/components/Navigation.tsx`**：
   - 底部两个主导航按钮均配置 `min-h-[44px]` 与 `min-w-[64px]`，满足移动触控热区要求；
   - 状态使用 `aria-selected` 明确标示当前选中的 Tab。
4. **`src/components/DietTracker.tsx` & `RecipeEditor.tsx`**：
   - 输入框具备关联的 `id` 与 `aria-label`（如“第 1 种食材名称”、“第 1 种食材克数”）；
   - 列表动态建议提供 `role="listbox"` 与 `role="option"`，支持键盘选择；
   - 所有关闭与删除按钮均设置显式的 `aria-label` 与 `min-w-[44px]` 触摸容器。
5. **`src/components/RecipeDetail.tsx`**：
   - 自建食谱删除提供模态确认弹窗，并配备 `aria-labelledby` 与清晰的“返回取消”操作，保护用户数据安全。
