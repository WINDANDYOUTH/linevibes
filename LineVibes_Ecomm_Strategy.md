You are an ecommerce information architect and Medusa v2 product strategist.

I am building an ecommerce brand called LineVibes.

Tech stack:

Backend: Medusa v2

Frontend: Next.js (Vercel)

Product format similar to drawscape.io

Art themes inspired by:

petrolvibes.com (automotive)

aircraftvibes.com (aviation)

oceansilhouettes.com (nature/ocean)

heartprinted.com (family & memorial)

My products are custom line-art illustrations where users upload photos and choose styles.

Your task is to design:

A scalable navbar/navigation system

Product category taxonomy

Collection structure

Tag system

Product types and variants

SKU naming rules

Admin workflow for managing products in Medusa

JSON examples for implementation

BRAND CONTEXT

LineVibes focuses on:

Emotional memory preservation

Minimalist line art

Custom illustration

Giftable products

Themes include:

Automotive

Aviation

Ocean & Nature

Family & Love

Memorial moments

PART 1 — NAVBAR STRUCTURE

Design a top navigation that:

Supports browsing by theme

Supports browsing by occasion

Supports browsing by style

Encourages custom uploads

Is SEO friendly

Scales for future categories

Output:

Desktop navbar structure

Mobile menu structure

Dropdown logic

URL structure

Recommended hierarchy depth

PART 2 — PRODUCT TAXONOMY

Define:

Categories

Must:

Be scalable

Match emotional buying behavior

Work with Medusa categories

Subcategories

Organized by theme and user intent.

PART 3 — COLLECTION STRATEGY

Design collections for:

Marketing

Promotions

Seasonal campaigns

Best sellers

Style groupings

Explain:

When to use collections vs categories

SEO benefits

Homepage usage

PART 4 — TAG SYSTEM

Create a structured tagging system:

Types of tags:

Theme tags

Style tags

Emotion tags

Occasion tags

Complexity level

Product format

Explain:

Naming conventions

How many tags per product

Filtering logic

Search optimization

PART 5 — PRODUCT STRUCTURE (Medusa v2)

Define:

Product types

Variants

Options

Metadata

Custom fields

Include:

Digital vs Physical product handling

Custom upload workflow

Style selection logic

PART 6 — SKU NAMING SYSTEM

Create a SKU format that encodes:

Theme

Style

Size

Frame option

Version

PART 7 — ADMIN WORKFLOW

Explain:

How admins should create products

Tagging best practices

Category assignment rules

Image organization

Collection assignment logic

PART 8 — JSON STRUCTURE EXAMPLES

Provide JSON examples for:

Category tree

Example product

Example tags

Example collections

Variant structure

Metadata structure

OUTPUT FORMAT

Use clear sections:

Navbar Architecture

Category System

Collection Strategy

Tag Framework

Product Model

SKU Rules

Admin Workflow

JSON Examples

Make recommendations scalable for 5–10 years growth.

Focus on:

SEO

User experience

Admin simplicity

Medusa compatibility

Emotional storytelling alignment

🧠 1️⃣ Automated Related-Products Logic

Goal:

Increase AOV, improve discovery, and reinforce emotional storytelling.

Use a weighted matching system based on:

Category

Tags

Style

Occasion

Popularity

🎯 Related Logic Priority Order

Tier 1 — Same Theme + Style

Show products that share:

Same main category

Same style tag

Example:

Product: Custom Car Minimalist Line Art

Related:

- Classic Car Portrait Minimalist

- Motorcycle Line Art Minimalist

Tier 2 — Same Occasion

Match emotional intent.

Tags:

memorial

anniversary

gift-for-dad

wedding

Example:

User views: Memorial Family Portrait

Related:

- Pet Memorial Line Art

- Couple Memory Line Art

Tier 3 — Best Sellers Within Category

Use Medusa metadata:

metadata:

popularity_score

order_volume

Tier 4 — Recently Viewed Style

Client-side personalization:

store style preference

suggest similar aesthetics

🛠 Implementation Logic (Pseudo)

IF same category AND same style → highest weight

ELSE IF same occasion tag → medium weight

ELSE IF same theme → fallback

ELSE best sellers

🔍 2️⃣ Search & Filter UX Design

Goal:

Help users quickly find emotional relevance.

🎯 Filter Groups

Theme

Automotive

Aviation

Ocean & Nature

Family & Love

Custom Upload

Style

Minimalist

Detailed

Blueprint

Bold Stroke

Occasion

Anniversary

Memorial

Birthday

Wedding

Gift for Him/Her

Format

Digital

Printed

Framed

Canvas

Complexity

Simple Outline

Medium Detail

Premium Detail

UX Best Practices

✅ Sticky filters on desktop

✅ Bottom sheet filters on mobile

✅ Multi-select enabled

✅ Show product count

✅ Instant filtering (no reload)

Search Behavior

Search should index:

Title

Tags

Category

Occasion

Style

Emotional keywords

Example searches:

“memorial gift”

“fighter jet art”

“family portrait”

🖼 3️⃣ Collection Landing Page Templates

Each collection page must tell a story, not just display products.

Template Structure

1️⃣ Hero Section

Emotional headline

Short storytelling copy

Lifestyle image

CTA

2️⃣ Meaning Section

Explain:

why this art matters

emotional value

who it’s for

3️⃣ Featured Products

Grid with:

badges

style tags

quick preview

4️⃣ How It Works

3-step visual guide:

Upload

Artist transforms

Receive artwork

5️⃣ Testimonials

Reinforce trust.

6️⃣ FAQ Section

Address hesitation.

7️⃣ Final CTA

Strong emotional close.

🛒 4️⃣ Product Page Layout Strategy

Goal:

Reduce hesitation, increase conversion.

Layout Flow

1️⃣ Visual Impact Area

Large preview

Style selector

Format options

Zoom capability

2️⃣ Emotional Hook Copy

Example:

“Turn your favorite memory into timeless line art.”

3️⃣ Customization Panel

Upload photo

Style selection

Add notes

Format options

Delivery time

4️⃣ Trust Builders

Satisfaction guarantee

Artist crafted

Revision policy

Shipping time

5️⃣ Example Transformations

Before/After slider.

6️⃣ Reviews

Include emotional testimonials.

7️⃣ Related Products

Based on logic above.

✍️ 5️⃣ SEO Copy Structure for Categories

Each category page needs 300–600 words.

SEO Layout Template

Section 1 — Introduction

Define category

Emotional appeal

Occasions

Section 2 — Why It Matters

Personal storytelling

Gift value

Memory preservation

Section 3 — Style Options

Explain visual styles.

Section 4 — Occasions

Examples of use.

Section 5 — Quality Assurance

Artist involvement

Materials

Process

Section 6 — CTA

Encourage browsing.

Example SEO Headline

“Custom Automotive Line Art – Turn Your Car Memories into Timeless Illustrations”

🔥 Final Strategic Advantage

This structure ensures:

✅ emotional storytelling

✅ SEO scalability
