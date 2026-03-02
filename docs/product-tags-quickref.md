# 🏷️ BetterKnitwear 产品标签快速参考

## 复制粘贴标签（用于 Medusa Admin）

### Style 款式

```
crewneck
v-neck
half-zip
full-zip
cardigan
polo-knit
```

### Warmth 保暖度

```
light
medium
warm
extra-warm
```

### Material 材质

```
merino-wool
lambswool
wool-blend
cotton-blend
cashmere-blend
```

### Gauge 针距

```
fine-gauge
mid-gauge
chunky
```

### Season 季节

```
fall
winter
transitional
```

### Color 颜色

```
navy
charcoal
burgundy
forest-green
cream
camel
grey
black
```

---

## 快速操作指南

### 🔧 方法 1：运行 Seed 脚本（推荐）

在后端目录运行：

```bash
cd betterknitwear-backend
npx medusa exec ./src/scripts/seed-knitwear.ts
```

这将自动创建：

- ✅ 所有 29 个产品标签
- ✅ 3 个产品分类
- ✅ 5 个示例毛衣产品（带完整标签）

### 🖱️ 方法 2：手动添加

1. 打开 http://localhost:9000/app
2. 登录 Admin
3. 进入 Products → 选择产品
4. 在 Tags 字段中粘贴上面的标签值
5. 保存

---

## 标签搭配示例

### 经典美利奴圆领衫

```
crewneck, merino-wool, medium, mid-gauge, fall, winter, navy
```

### 厚实开衫

```
cardigan, lambswool, extra-warm, chunky, winter, cream
```

### 轻薄 V 领衫

```
v-neck, cashmere-blend, light, fine-gauge, transitional, burgundy
```

### 户外半拉链衫

```
half-zip, wool-blend, warm, mid-gauge, fall, winter, forest-green
```
