# 🏷️ BetterKnitwear 产品标签管理指南

本文档说明如何为 BetterKnitwear 产品配置标签，以支持前端筛选功能。

## 📋 标签命名规范

所有标签必须使用**小写字母**和**连字符**格式，与前端筛选器配置保持一致。

## 🗂️ 标签分类

### 1. Style（款式）

| 标签值      | 显示名称  | 说明        |
| ----------- | --------- | ----------- |
| `crewneck`  | Crewneck  | 圆领毛衣    |
| `v-neck`    | V-Neck    | V 领毛衣    |
| `half-zip`  | Half Zip  | 半拉链毛衣  |
| `full-zip`  | Full Zip  | 全拉链毛衣  |
| `cardigan`  | Cardigan  | 开衫        |
| `polo-knit` | Polo Knit | Polo 针织衫 |

### 2. Warmth Level（保暖级别）⭐ 推荐使用

| 标签值       | 显示名称   | 说明                 |
| ------------ | ---------- | -------------------- |
| `light`      | Light      | 轻薄，适合室内或叠穿 |
| `medium`     | Medium     | 中等保暖，日常穿着   |
| `warm`       | Warm       | 保暖，适合寒冷天气   |
| `extra-warm` | Extra Warm | 超保暖，极寒天气     |

### 3. Material（材质）

| 标签值           | 显示名称       | 说明       |
| ---------------- | -------------- | ---------- |
| `merino-wool`    | Merino Wool    | 美利奴羊毛 |
| `lambswool`      | Lambswool      | 羔羊毛     |
| `wool-blend`     | Wool Blend     | 羊毛混纺   |
| `cotton-blend`   | Cotton Blend   | 棉混纺     |
| `cashmere-blend` | Cashmere Blend | 羊绒混纺   |

### 4. Gauge / Weight（针距/厚度）

| 标签值       | 显示名称   | 说明                      |
| ------------ | ---------- | ------------------------- |
| `fine-gauge` | Fine Gauge | 细针距（12gg+），轻薄贴身 |
| `mid-gauge`  | Mid Gauge  | 中等针距（7-10gg）        |
| `chunky`     | Chunky     | 粗针距（5gg 以下），厚实  |

### 5. Season（季节）

| 标签值         | 显示名称     | 说明             |
| -------------- | ------------ | ---------------- |
| `fall`         | Fall         | 秋季             |
| `winter`       | Winter       | 冬季             |
| `transitional` | Transitional | 过渡季节（春秋） |

### 6. Color（颜色）

| 标签值         | 显示名称     |
| -------------- | ------------ |
| `navy`         | Navy         |
| `charcoal`     | Charcoal     |
| `burgundy`     | Burgundy     |
| `forest-green` | Forest Green |
| `cream`        | Cream        |
| `camel`        | Camel        |
| `grey`         | Grey         |
| `black`        | Black        |

---

## 🛠️ 在 Medusa Admin 中添加标签

### 方法 1：通过 UI 添加

1. 登录 Medusa Admin：`http://localhost:9000/app`
2. 进入 **Settings** → **Product Tags**
3. 点击 **Create** 按钮
4. 输入标签值（如 `crewneck`）
5. 保存

### 方法 2：编辑产品时添加

1. 进入 **Products** → 选择产品
2. 在 **Organize** 部分找到 **Tags**
3. 输入标签值，如果不存在会自动创建
4. 可以添加多个标签

---

## 📦 为产品分配标签

### 示例：Classic Wool Sweater

一件经典圆领美利奴羊毛毛衣应该有以下标签：

```
Tags:
- crewneck      (Style)
- merino-wool   (Material)
- medium        (Warmth)
- mid-gauge     (Gauge)
- fall          (Season)
- winter        (Season)
- navy          (Color - 如有多个颜色可添加多个)
- charcoal      (Color)
```

### 示例：Chunky Cardigan

一件厚实羔羊毛开衫：

```
Tags:
- cardigan      (Style)
- lambswool     (Material)
- extra-warm    (Warmth)
- chunky        (Gauge)
- winter        (Season)
- cream         (Color)
```

---

## 🎯 标签使用建议

### ✅ 推荐做法

1. **每个产品至少添加以下标签：**

   - 1 个 Style 标签
   - 1 个 Material 标签
   - 1 个 Warmth 标签

2. **可选但推荐：**

   - Season 标签（帮助季节性推荐）
   - Gauge 标签（专业用户会关注）
   - Color 标签（如果颜色是关键卖点）

3. **保持一致性：**
   - 同类产品使用相同的标签命名
   - 定期审核产品标签

### ❌ 避免做法

1. 不要创建重复含义的标签
2. 不要使用大写或空格（如 `Crew Neck` ❌，使用 `crewneck` ✅）
3. 不要过度标记（每个类别选择最相关的 1-2 个）

---

## 🔗 前端筛选器映射

标签通过以下逻辑映射到前端筛选器：

```
URL参数: /store?style=crewneck,v-neck&material=merino-wool

↓ 解析为

过滤条件:
- style 包含 "crewneck" 或 "v-neck"
- material 包含 "merino-wool"

↓ 匹配产品标签

产品 A 标签: ["crewneck", "merino-wool", "warm"]
→ ✅ 匹配（同时满足 style 和 material）

产品 B 标签: ["v-neck", "lambswool", "light"]
→ ❌ 不匹配（material 不满足）
```

---

## 📊 推荐的标签策略

### SKU 较少时（< 20 个产品）

- 隐藏 Gauge 和 Season 筛选器
- 重点使用 Style、Material、Warmth

### SKU 较多时（50+ 个产品）

- 启用所有筛选器
- 考虑添加 Price Range 筛选

### 季节性调整

- 冬季：突出 `warm`、`extra-warm`、`winter` 标签
- 夏季：突出 `light`、`cotton-blend`、`transitional` 标签

---

## 🚀 快速开始清单

- [ ] 登录 Medusa Admin
- [ ] 创建所有 Style 标签（6 个）
- [ ] 创建所有 Warmth 标签（4 个）
- [ ] 创建所有 Material 标签（5 个）
- [ ] 为现有产品分配标签
- [ ] 测试前端筛选功能
