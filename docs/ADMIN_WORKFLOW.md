# LineVibes Admin Workflow Guide

> Complete guide for managing products, categories, collections, and tags in Medusa Admin

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Product Creation Workflow](#product-creation-workflow)
3. [Category Management](#category-management)
4. [Collection Management](#collection-management)
5. [Tag System](#tag-system)
6. [SKU Naming Convention](#sku-naming-convention)
7. [Image Guidelines](#image-guidelines)
8. [SEO Best Practices](#seo-best-practices)

---

## 🚀 Quick Start

### Access Medusa Admin

```
URL: http://localhost:9000/app
```

### Run Complete Seed Script

```bash
cd linevibes-backend
npx medusa exec ./src/scripts/seed-linevibes-complete.ts
```

---

## 📦 Product Creation Workflow

### Step-by-Step Process

#### 1. Choose Product Type

| Type             | Description           | Requires Upload | Is Digital |
| ---------------- | --------------------- | --------------- | ---------- |
| Custom Portrait  | User uploads photo    | ✅ Yes          | ❌ No      |
| Ready-Made Art   | Pre-designed artwork  | ❌ No           | ❌ No      |
| Digital Download | Instant file delivery | ❌ No           | ✅ Yes     |

#### 2. Set Primary Category

Select ONE primary theme-based category:

- **Automotive** - Cars, motorcycles, racing
- **Aviation** - Aircraft, helicopters, aerospace
- **Ocean & Nature** - Waves, marine, landscapes
- **Family & Love** - Portraits, pets, couples
- **Architecture** - Buildings, cityscapes

#### 3. Assign to Collections

Select relevant collections (can be multiple):

**Style Collections:**

- Minimalist, Blueprint, Detailed, Bold Stroke

**Format Collections:**

- Digital, Printed, Framed, Canvas

**Occasion Collections:**

- Anniversary, Memorial, Wedding, Birthday, etc.

**Marketing Collections:**

- New Arrivals, Best Sellers, Limited Edition

#### 4. Apply Tags (5-10 per product)

Use the following prefixes:

| Prefix        | Purpose          | Examples                                    |
| ------------- | ---------------- | ------------------------------------------- |
| `theme:`      | Main subject     | `theme:automotive`, `theme:aviation`        |
| `style:`      | Visual aesthetic | `style:minimalist`, `style:blueprint`       |
| `emotion:`    | Feeling evoked   | `emotion:nostalgic`, `emotion:romantic`     |
| `occasion:`   | Gift purpose     | `occasion:anniversary`, `occasion:birthday` |
| `gift-for:`   | Recipient        | `gift-for:him`, `gift-for:dad`              |
| `complexity:` | Detail level     | `complexity:simple`, `complexity:premium`   |
| `format:`     | Delivery type    | `format:digital`, `format:framed`           |

#### 5. Configure Variants

Standard options:

**Size Options:**

- 8x10, 11x14, 16x20, 18x24, 24x36
- A4, A3, A2 (metric)

**Paper Options:**

- Museum White (default)
- Classic Blue (blueprint style)
- Vintage Cream (warm tone)
- Black (contrast designs)

**Frame Options:**

- No Frame (default, lowest price)
- Black Wood (+$40)
- Natural Oak (+$40)
- White Wood (+$45)
- Floating Frame (+$60)

#### 6. Set Metadata

Required fields:

```json
{
  "technique": "Robot Pen Plotter",
  "estimated_delivery_days": 7
}
```

Optional fields:

```json
{
  "complexity_level": "premium",
  "popularity_score": 85,
  "artist_notes": "Plotted with 0.1mm archival ink",
  "customizable": true,
  "requires_upload": true,
  "seo_keywords": ["car art", "automotive poster"]
}
```

#### 7. Upload Images

See [Image Guidelines](#image-guidelines) section.

#### 8. Write Description

Structure:

1. **Opening Hook** - Emotional connection (1-2 sentences)
2. **Product Details** - What makes it special
3. **Quality Points** - Materials, technique
4. **Perfect For** - Occasions, recipients

Example:

```
The legendary 1964 Porsche 911, immortalized in precision line art.

This technical blueprint captures every curve and engineering detail
of automotive history's most iconic sports car. Each piece is
plotted with 0.1mm archival ink pens on museum-grade paper.

Perfect for: Car collectors, Porsche enthusiasts, Father's Day gifts
```

#### 9. Generate SKU

Follow [SKU Naming Convention](#sku-naming-convention).

#### 10. Assign to Sales Channels

Select: **Default Sales Channel** (required for storefront visibility)

---

## 📁 Category Management

### Category Hierarchy

Categories are **permanent, theme-based** groupings.

| Category       | Handle         | Icon | URL                        |
| -------------- | -------------- | ---- | -------------------------- |
| Automotive     | `automotive`   | 🚗   | `/categories/automotive`   |
| Aviation       | `aviation`     | ✈️   | `/categories/aviation`     |
| Ocean & Nature | `ocean-nature` | 🌊   | `/categories/ocean-nature` |
| Family & Love  | `family-love`  | ❤️   | `/categories/family-love`  |
| Architecture   | `architecture` | 🏛️   | `/categories/architecture` |

### Category SEO Content

Each category should have:

- **Title tag**: 60 characters max
- **Meta description**: 155 characters max
- **Category description**: 300-600 words

Example for Automotive:

```
Title: Custom Automotive Line Art | Car Blueprints & Drawings
Meta: Transform your favorite car into stunning line art. Precision-plotted
      blueprints of classic cars, sports cars, and motorcycles. Ships worldwide.
```

---

## 📚 Collection Management

### When to Use Collections vs Categories

| Use Collections For | Use Categories For         |
| ------------------- | -------------------------- |
| Marketing campaigns | Permanent product taxonomy |
| Seasonal promotions | Theme-based browsing       |
| Style groupings     | SEO hierarchy              |
| Gift guides         | What the art depicts       |

### Collection Types

#### Style Collections

- Focused on visual aesthetic
- Multiple products can belong to multiple style collections

#### Occasion Collections

- Focused on gifting purpose
- Tied to emotional moments

#### Marketing Collections

- Promotional groupings
- Regularly updated
- Used on homepage

### Homepage Collection Display Order

1. New Arrivals
2. Best Sellers
3. Custom Portraits (featured)
4. Seasonal (if applicable)

---

## 🏷️ Tag System

### Tag Naming Rules

- All lowercase
- Use hyphens for spaces
- Always include prefix
- No special characters

### Minimum Tags Per Product (5 required)

1. ✅ 1 theme tag
2. ✅ 1 style tag
3. ✅ 1 emotion tag
4. ✅ 1 occasion OR gift-for tag
5. ✅ 1 complexity tag

### Complete Tag Reference

#### Theme Tags

```
theme:automotive, theme:aviation, theme:ocean, theme:nature,
theme:family, theme:memorial, theme:architecture
```

#### Style Tags

```
style:minimalist, style:blueprint, style:detailed,
style:bold, style:geometric
```

#### Emotion Tags

```
emotion:nostalgic, emotion:romantic, emotion:peaceful,
emotion:powerful, emotion:memorial
```

#### Occasion Tags

```
occasion:anniversary, occasion:birthday, occasion:wedding,
occasion:memorial, occasion:fathers-day, occasion:mothers-day
```

#### Gift-For Tags

```
gift-for:him, gift-for:her, gift-for:dad, gift-for:mom, gift-for:couple
```

#### Complexity Tags

```
complexity:simple, complexity:medium, complexity:premium
```

#### Format Tags

```
format:digital, format:print, format:framed, format:canvas
```

---

## 🔢 SKU Naming Convention

### Format

```
{THEME}-{STYLE}-{SIZE}-{PAPER}-{FRAME}-{VERSION}
```

### Code Reference

| Component   | Codes                                                                |
| ----------- | -------------------------------------------------------------------- |
| **Themes**  | AUTO, AVIA, OCNR, FMLV, ARCH, CUST                                   |
| **Styles**  | MN (Minimalist), BP (Blueprint), DT (Detailed), BS (Bold)            |
| **Sizes**   | 810, 1114, 1620, 1824, 2436, A4, A3, A2                              |
| **Papers**  | MW (Museum White), CB (Classic Blue), VC (Vintage Cream), BK (Black) |
| **Frames**  | NF (No Frame), BW (Black Wood), NO (Natural Oak), WW (White Wood)    |
| **Version** | 01, 02, 03...                                                        |

### Examples

```
AUTO-BP-1824-CB-NF-01    → Automotive Blueprint, 18x24, Classic Blue, No Frame, v1
FMLV-MN-1114-MW-NO-01    → Family Minimalist, 11x14, Museum White, Natural Oak, v1
CUST-DT-1620-MW-BW-01    → Custom Detailed, 16x20, Museum White, Black Wood, v1
DIG-MN-PERS-01           → Digital, Minimalist, Personal License, v1
```

---

## 🖼️ Image Guidelines

### Image Requirements

- **Minimum resolution**: 2000x2000px
- **Format**: WebP preferred, JPG acceptable
- **Aspect ratio**: Product photos - 4:5, Lifestyle - 16:9
- **File size**: Under 500KB (optimize for web)

### Required Images Per Product (minimum 3)

1. **Main** - Clean product on white/neutral background
2. **Lifestyle** - Product in room setting
3. **Detail** - Close-up of line work quality

### Optional Images

4. **Frame Preview** - Show framing options
5. **Size Comparison** - Scale reference
6. **Process** - Plotter in action

### Image Naming Convention

```
{product-handle}-{view}-{number}.webp

Examples:
porsche-911-blueprint-main-01.webp
porsche-911-blueprint-lifestyle-01.webp
porsche-911-blueprint-detail-01.webp
```

---

## 🔍 SEO Best Practices

### Product Titles

- 50-60 characters
- Include main keyword
- Include style descriptor

**Formula**: `{Subject} {Style} Line Art`

Examples:

- ✅ "Porsche 911 Blueprint Line Art"
- ✅ "Custom Pet Portrait - Minimalist Style"
- ❌ "Beautiful Amazing Car Drawing Art Print Poster"

### Product Descriptions

- 150-300 words
- Include emotional hooks
- Mention occasions/recipients
- Include quality details

### URL Slugs

- Lowercase
- Hyphens only
- Descriptive

Examples:

- ✅ `/products/porsche-911-blueprint`
- ✅ `/products/custom-pet-contour-portrait`
- ❌ `/products/p911-bp-v1`

### Alt Text for Images

Describe the image for accessibility:

```
"Porsche 911 1964 technical blueprint line art on classic blue paper"
```

---

## ✅ Quality Checklist

Before publishing any product:

- [ ] Title follows naming convention
- [ ] Description is 150+ words
- [ ] At least 3 images uploaded
- [ ] Primary category assigned
- [ ] At least 1 collection assigned
- [ ] 5+ tags applied (with required prefixes)
- [ ] All variants have correct SKUs
- [ ] Pricing set for all variants
- [ ] Metadata includes technique & delivery days
- [ ] Sales channel assigned

---

## 🆘 Common Issues

### Product Not Showing on Storefront

1. Check if published (not draft)
2. Verify sales channel assignment
3. Confirm at least one variant has stock

### Tags Not Filtering

1. Ensure correct prefix format
2. Check for typos/extra spaces
3. Rebuild search index

### SKU Conflicts

1. Check version number increment
2. Ensure unique combination

---

_Last Updated: January 30, 2026_
_Version: 1.0_
