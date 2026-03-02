# Next.js 缓存策略指南

本文档解释 BetterKnitwear 项目中的缓存策略及生产环境部署注意事项。

---

## 📚 Next.js 缓存策略概述

Next.js 提供了多种数据获取缓存策略：

| 策略            | 说明                   | 适用场景                     |
| --------------- | ---------------------- | ---------------------------- |
| `force-cache`   | 永久缓存，直到手动失效 | 几乎不变的数据（如静态配置） |
| `no-store`      | 不缓存，每次都请求     | 实时性要求极高的数据         |
| `revalidate: N` | 缓存 N 秒后重新验证    | ⭐ 大多数场景的最佳选择      |

---

## 🔧 项目中的缓存配置

### Regions 数据 (`/lib/data/regions.ts`)

```typescript
// 当前配置：
revalidate: 300 // 每 5 分钟重新验证

// 开发环境：no-store（始终获取最新）
// 生产环境：default（使用 revalidate）
```

**为什么选择 5 分钟？**

- Regions 不会频繁变化（可能几周/几个月才改一次）
- 5 分钟缓存足够在管理员更新后快速生效
- 大幅减少后端请求压力

---

## 🏭 生产环境部署注意事项

### 1. 按需重新验证 (On-Demand Revalidation)

当在 Medusa Admin 中更新数据时，可以主动触发缓存失效：

```typescript
// 在后端 webhook 或 API 中调用
import { revalidateTag } from "next/cache"

// 当 regions 更新时
revalidateTag("regions")
```

**项目已配置的重新验证端点：**

```
POST /api/revalidate?tag=regions
Headers: { "x-revalidate-secret": "your_secret" }
```

### 2. 不同数据类型的建议缓存时间

| 数据类型        | 建议缓存时间  | 原因               |
| --------------- | ------------- | ------------------ |
| **Regions**     | 5 分钟 (300s) | 很少变化           |
| **Categories**  | 5 分钟 (300s) | 较少变化           |
| **Collections** | 2 分钟 (120s) | 可能经常更新       |
| **Products**    | 1 分钟 (60s)  | 库存/价格可能变化  |
| **Cart**        | 0 (no-store)  | 用户特定，必须实时 |
| **Customer**    | 0 (no-store)  | 用户特定，必须实时 |

### 3. CDN 缓存配置

在 Vercel、Cloudflare 或其他 CDN 上部署时：

```
# 推荐的 Cache-Control 头
Cache-Control: public, s-maxage=300, stale-while-revalidate=600
```

这意味着：

- CDN 缓存 5 分钟
- 缓存过期后，先返回旧数据，后台异步更新

### 4. 环境变量配置

```env
# .env.production
REVALIDATE_SECRET=your_strong_secret_here
```

确保这个密钥足够安全，防止恶意清除缓存。

---

## 🚨 常见问题

### Q: 更新了后台数据，前端没有变化？

**可能原因：**

1. 缓存未过期（等待 revalidate 时间）
2. 浏览器缓存（尝试硬刷新 Ctrl+Shift+R）
3. CDN 缓存（需要手动清除或等待过期）

**解决方案：**

```bash
# 方案 1: 调用重新验证 API
curl -X POST "https://your-site.com/api/revalidate?tag=regions" \
  -H "x-revalidate-secret: your_secret"

# 方案 2: 重新部署
# 这会清除所有缓存
```

### Q: 开发时数据不更新？

确保使用了 `no-store` 策略（项目已配置）：

```typescript
cache: process.env.NODE_ENV === "development" ? "no-store" : "default"
```

### Q: 如何完全禁用缓存进行调试？

```bash
# 启动 Next.js dev server 时禁用缓存
NEXT_DISABLE_CACHE=1 yarn dev
```

---

## 📈 监控建议

在生产环境中，建议监控：

1. **缓存命中率** - CDN 或 Next.js 的 cache hit/miss
2. **后端 API 请求量** - 确保缓存正常工作
3. **页面加载时间** - 缓存应该显著降低 TTFB
4. **错误率** - 缓存失效时的 stale-while-revalidate 行为

---

## 🔗 相关资源

- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Next.js Caching](https://nextjs.org/docs/app/building-your-application/caching)
- [Vercel Edge Caching](https://vercel.com/docs/edge-network/caching)
