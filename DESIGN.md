# DESIGN.md - 界面设计规范与 Anti-AI-Slop 准则

本项目将**《人机界面指南》（Human Interface Guidelines）八大核心设计原则**作为根本基石（完整沉淀文件详见 [`DESIGN_PRINCIPLES.md`](./DESIGN_PRINCIPLES.md)），并结合国际开源社区倡导的 **Anti-AI-Slop（反模板化 AI 设计）** 与 Savee 冷峻极简美学，构建高屏效、克制且具物理真实质感的极简数字工具。

---

## 1. 核心设计原则 (HIG Foundational Principles)

更成功且经久不衰的设计基于对用户如何思考、感受和与世界交互的深刻理解：

1. **目标感 (Purpose)**：创造有意义的产品。保持专注，优先最核心功能，杜绝功能堆砌。
2. **能动性 (Agency)**：让用户随心所欲。不妨碍工作，支持自由探索与轻松容错。
3. **责任感 (Accountability)**：以用户最佳利益为核心。透明真诚，纯本地安全存储，不滥取数据。
4. **熟悉感 (Familiarity)**：基于生活认知。遵循自然一日三餐习惯与烹饪逻辑，反馈即时清晰。
5. **灵活 (Flexibility)**：为所有人设计。坚持 WCAG AA 与 44px 最小触控热区，兼顾多设备与可访问性。
6. **简洁 (Simplicity)**：清晰直接。纯白卡片底色 (`#FFFFFF`)、0.5px 极细浅灰边框 (`#E0E0E0`)，扁平无阴影。
7. **匠心 (Craft)**：重视每一个细节。严苛把控微小排版对齐与代码质量，保持高标准。
8. **愉悦感 (Delight)**：融入人文关怀。用自然体贴的生活化语言取代工程黑话，将关怀化于无形。

---

## 2. 核心设计哲学 (Core Philosophy)

- **去噪与信息亲密度**：去除无意义的装饰性渐变与夸张发光投影，用精确的留白、比例与微妙分割线替代繁琐的层叠容器。
- **物理极细边框**：全站卡片采用 `#FFFFFF` 底色搭配 0.5px 极轻微浅灰描边，平铺在 `#FAFAFA` 的柔和低对比画布上。
- **模块绝对隔离**：食谱库（烹饪指南）与饮食记录（日常记账）严格保持独立边界，杜绝强行跨域联动。

---

## 2. 社区 Anti-AI-Slop 严禁清单与本工程自查表 (Audit Checklist)

| 序号 | 社区最火 AI Slop 模式 | 本项目规范与执行状态 |
| :--- | :--- | :--- |
| **01** | **滥用紫蓝渐变与暗色霓虹发光 (Purple/Neon Glow)** | ✅ **已规避**：严格采用单色系黑、白与中性灰（`#FAFAFA` / `#FFFFFF` / `#000000`），无任何渐变文字或彩色阴影。 |
| **02** | **套娃卡片与卡片汤 (Nested Cards / Card Soup)** | ✅ **已优化规避**：去除容器内嵌套的灰底圆角框，数据模块改用极细轻量分割线（`divide-x`）横向平铺，信息层级完全扁平化。 |
| **03** | **左侧单边加粗彩条 (Colored Left-Border Accent)** | ✅ **已规避**：全站禁止在卡片单侧使用 3~4px 彩色装饰条，保持几何对称与干净边缘。 |
| **04** | **无意义的营销口号 (Generic Buzzwords)** | ✅ **已规避**：全站文案杜绝 "Supercharge"、"Empower" 等空洞字眼，均为直观的烹饪与营养学名词（如克重、千卡、三大营养素）。 |
| **05** | **缺失交互与空状态盲区 (Empty State Blindness)** | ✅ **已规避**：具备完善的搜索无结果空状态、自建食谱删除确认、表单必填校验、无记录时的清晰引导。 |
| **06** | **移动端可触控性不达标 (<44px Touch Target)** | ✅ **已规避**：底部 Tab、分类标签与操作按钮最小点击热区均满足 44px WCAG AA 规范。 |
| **07** | **技术黑话与空洞修饰词 (Technical Jargon & Buzzwords)** | ✅ **已规避**：去除 UI 上的工程术语（如 Database、JSON、模式等）及虚夸词（如 Precise、Instant），所有提示文案均改用以人为本、温暖清晰的自然口吻。 |
| **08** | **阴影装饰泛滥与发光 (Unsolicited Shadows)** | ✅ **已规避**：全站彻底移除所有阴影装饰 (`shadow-*`)，全卡片背景纯白 (`#FFFFFF`) 并统一应用 0.5px 极细浅灰边框 (`#E0E0E0`)，底部导航栏同为纯白无阴影，回归 Savee 冷峻极简质感。 |

---

## 3. 设计代币 (Design Tokens)

```yaml
colors:
  canvas: "#FAFAFA"
  card_surface: "#FFFFFF"
  card_border: "#E0E0E0" # 0.5px ultra-crisp hairline
  text_primary: "#0A0A0A"
  text_secondary: "#525252"
  text_tertiary: "#A3A3A3"
  accent_primary: "#000000"
  accent_contrast: "#FFFFFF"

typography:
  font_sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  scale:
    title: "16px / font-bold"
    body: "14px / line-height-1.6"
    caption: "12px / font-medium"
    metric: "16px / font-bold / tabular-nums"

layout:
  max_width: "600px" # 手机端优化的紧凑居中宽度
  card_radius: "12px"
  card_padding: "16px"
  inner_divider: "0.5px solid #E0E0E0"
```
