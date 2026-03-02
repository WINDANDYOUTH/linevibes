# BetterKnitwear 电商分析追踪解决方案

## 概述

本项目已集成完整的用户行为追踪解决方案，包括：

1. **Google Tag Manager (GTM)** - 用于安装和管理 GA4 及其他追踪代码
2. **会话追踪** - 收集用户行为数据并在订单中记录转化路径
3. **GA4 增强型电子商务** - 标准电商事件追踪

---

## 1. 配置 Google Tag Manager

### 1.1 获取 GTM Container ID

1. 登录 [Google Tag Manager](https://tagmanager.google.com/)
2. 创建账户和容器（选择 "Web" 平台）
3. 复制容器 ID（格式：`GTM-XXXXXXX`）

### 1.2 配置环境变量

在 `.env.local` 文件中添加：

```env
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

### 1.3 在 GTM 中配置 GA4

1. 在 GTM 容器中创建新 Tag
2. 选择 **GA4 Configuration**
3. 输入 GA4 Measurement ID（格式：`G-XXXXXXXX`）
4. 触发器选择 **All Pages**
5. 发布容器

---

## 2. 追踪的电商事件

系统会自动追踪以下 GA4 增强型电商事件：

| 事件                | 触发时机     | 数据                      |
| ------------------- | ------------ | ------------------------- |
| `page_view`         | 页面切换     | URL, 标题                 |
| `view_item`         | 查看商品详情 | 商品 ID, 名称, 价格, 分类 |
| `add_to_cart`       | 添加到购物车 | 商品信息, 数量            |
| `remove_from_cart`  | 从购物车移除 | 商品信息                  |
| `view_cart`         | 查看购物车   | 购物车商品列表            |
| `begin_checkout`    | 开始结账     | 购物车信息                |
| `add_shipping_info` | 添加配送信息 | 配送方式                  |
| `add_payment_info`  | 添加支付信息 | 支付方式                  |
| `purchase`          | 完成购买     | 订单详情, 交易 ID         |

---

## 3. 会话数据收集

每个用户会话会自动收集以下信息：

### 3.1 流量来源

- UTM 参数（source, medium, campaign, term, content）
- Referrer（来源页面）
- Landing Page（着陆页）

### 3.2 设备信息

- 设备类型（desktop/mobile/tablet）
- 浏览器
- 操作系统
- 屏幕分辨率
- 语言
- 时区

### 3.3 用户行为

- 页面浏览数
- 会话时长
- 浏览的商品 ID 列表
- 是否加购
- 是否开始结账
- 是否完成购买

---

## 4. 在组件中使用追踪

### 4.1 使用 useAnalytics Hook

```tsx
"use client"
import { useAnalytics } from "@lib/analytics/provider"

function ProductPage({ product }) {
  const { trackProductView, trackAddToCart, getOrderMetadata } = useAnalytics()

  useEffect(() => {
    trackProductView({
      id: product.id,
      name: product.title,
      category: product.category?.name,
      price: product.price,
      currency: "USD",
    })
  }, [product])

  const handleAddToCart = () => {
    trackAddToCart({
      id: product.id,
      name: product.title,
      price: product.price,
      currency: "USD",
      quantity: 1,
    })
  }

  return (...)
}
```

### 4.2 获取订单归因数据

在创建订单时，可以获取会话数据作为订单元数据：

```tsx
const { getOrderMetadata } = useAnalytics()

// 在提交订单时
const orderMetadata = getOrderMetadata()
// 将 orderMetadata 附加到订单的 metadata 字段
```

---

## 5. 在后端存储转化路径

### 5.1 扩展订单 Metadata

在结账完成时，前端会将会话数据传递给后端。需要在 Medusa 后端配置订单元数据存储。

元数据结构示例：

```json
{
  "session_id": "lx2a4b5c6d",
  "visitor_id": "vm8x9y0z",
  "session_duration_seconds": 342,
  "page_views": 8,

  "utm_source": "facebook",
  "utm_medium": "cpc",
  "utm_campaign": "winter_sale",
  "referrer": "https://facebook.com/",
  "landing_page": "https://betterknitwear.com/us/products/wool-sweater",

  "device_type": "mobile",
  "browser": "Chrome",
  "os": "iOS",
  "screen_resolution": "390x844",
  "language": "en-US",
  "timezone": "America/New_York",

  "viewed_products_count": 5,
  "events_count": 23
}
```

### 5.2 在后台管理查看转化数据

在 Medusa Admin 中，每个订单的详情页都会显示 `metadata` 字段，其中包含完整的用户转化路径信息。

---

## 6. 下一步优化建议

1. **服务端追踪**：考虑使用 GTM Server-side Container 来提高数据准确性
2. **IP 地理定位**：可以在后端使用 MaxMind GeoIP 获取更精确的地理信息
3. **A/B 测试集成**：集成 Google Optimize 或 VWO
4. **热图分析**：考虑集成 Hotjar 或 Microsoft Clarity
5. **CRM 集成**：将客户数据同步到 HubSpot 或 Salesforce

---

## 文件结构

```
src/
├── lib/
│   └── analytics/
│       ├── gtm.ts              # GTM 事件函数
│       ├── session.ts          # 会话追踪
│       └── provider.tsx        # Analytics Context Provider
├── modules/
│   └── common/
│       └── components/
│           └── google-tag-manager/
│               └── index.tsx   # GTM Script 组件
└── app/
    └── layout.tsx              # 已集成 GTM 和 AnalyticsProvider
```

---

## 环境变量

| 变量名               | 说明                       | 示例          |
| -------------------- | -------------------------- | ------------- |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager 容器 ID | `GTM-XXXXXXX` |
