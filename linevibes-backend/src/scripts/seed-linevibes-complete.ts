import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createProductsWorkflow,
  createProductCategoriesWorkflow,
  createCollectionsWorkflow,
} from "@medusajs/medusa/core-flows";

/**
 * LineVibes Complete E-commerce Seed Script
 * 
 * This script creates the full product taxonomy including:
 * - Categories (Theme-based hierarchy)
 * - Collections (Marketing & style groupings)
 * - Tags (Cross-cutting filters)
 * - Sample Products with variants
 * 
 * Run with: npx medusa exec ./src/scripts/seed-linevibes-complete.ts
 */

// ============================================
// TAG DEFINITIONS
// ============================================
const PRODUCT_TAGS = [
  // Theme Tags
  { value: "theme:automotive" },
  { value: "theme:aviation" },
  { value: "theme:ocean" },
  { value: "theme:nature" },
  { value: "theme:family" },
  { value: "theme:memorial" },
  { value: "theme:architecture" },
  
  // Style Tags
  { value: "style:minimalist" },
  { value: "style:blueprint" },
  { value: "style:detailed" },
  { value: "style:bold" },
  { value: "style:geometric" },
  
  // Emotion Tags
  { value: "emotion:nostalgic" },
  { value: "emotion:romantic" },
  { value: "emotion:peaceful" },
  { value: "emotion:powerful" },
  { value: "emotion:memorial" },
  
  // Occasion Tags
  { value: "occasion:anniversary" },
  { value: "occasion:birthday" },
  { value: "occasion:wedding" },
  { value: "occasion:memorial" },
  { value: "occasion:fathers-day" },
  { value: "occasion:mothers-day" },
  
  // Gift Recipient Tags
  { value: "gift-for:him" },
  { value: "gift-for:her" },
  { value: "gift-for:dad" },
  { value: "gift-for:mom" },
  { value: "gift-for:couple" },
  
  // Complexity Tags
  { value: "complexity:simple" },
  { value: "complexity:medium" },
  { value: "complexity:premium" },
  
  // Format Tags
  { value: "format:digital" },
  { value: "format:print" },
  { value: "format:framed" },
  { value: "format:canvas" },
  
  // Paper Types
  { value: "paper:museum-white" },
  { value: "paper:classic-blue" },
  { value: "paper:vintage-cream" },
  { value: "paper:black" },
];

// ============================================
// CATEGORY DEFINITIONS
// ============================================
const CATEGORIES = [
  {
    name: "Automotive",
    handle: "automotive",
    description: "Classic cars, motorcycles, and racing machines transformed into artistic line drawings. Perfect for car enthusiasts and collectors.",
    is_active: true,
    is_internal: false,
    rank: 1,
  },
  {
    name: "Aviation",
    handle: "aviation",
    description: "Aircraft, helicopters, and aerospace engineering captured in precision line art. Ideal for pilots and aviation lovers.",
    is_active: true,
    is_internal: false,
    rank: 2,
  },
  {
    name: "Ocean & Nature",
    handle: "ocean-nature",
    description: "Waves, marine life, landscapes, and natural wonders in minimalist line form. Brings the serenity of nature into your space.",
    is_active: true,
    is_internal: false,
    rank: 3,
  },
  {
    name: "Family & Love",
    handle: "family-love",
    description: "Portraits, couples, pets, and cherished moments preserved in timeless lines. Celebrate the people and moments you treasure.",
    is_active: true,
    is_internal: false,
    rank: 4,
  },
  {
    name: "Architecture",
    handle: "architecture",
    description: "Buildings, cityscapes, and structural marvels drawn with architectural precision. Capture your favorite places in art.",
    is_active: true,
    is_internal: false,
    rank: 5,
  },
];

// ============================================
// COLLECTION DEFINITIONS
// ============================================
const COLLECTIONS = [
  // Style Collections
  { title: "Minimalist", handle: "minimalist", metadata: { type: "style", description: "Clean, simple lines that capture essence" } },
  { title: "Blueprint", handle: "blueprint", metadata: { type: "style", description: "Technical schematic-style art" } },
  { title: "Detailed", handle: "detailed", metadata: { type: "style", description: "Intricate, multi-layered line work" } },
  { title: "Bold Stroke", handle: "bold-stroke", metadata: { type: "style", description: "Thick, expressive lines with contrast" } },
  
  // Format Collections
  { title: "Digital Downloads", handle: "digital", metadata: { type: "format", description: "Instant delivery, print at home" } },
  { title: "Printed Posters", handle: "printed", metadata: { type: "format", description: "Museum-quality prints" } },
  { title: "Framed Art", handle: "framed", metadata: { type: "format", description: "Ready to hang masterpieces" } },
  { title: "Canvas Prints", handle: "canvas", metadata: { type: "format", description: "Gallery-wrapped canvas" } },
  
  // Occasion Collections
  { title: "Anniversary Gifts", handle: "anniversary", metadata: { type: "occasion", description: "Celebrate your love story" } },
  { title: "Memorial Tributes", handle: "memorial", metadata: { type: "occasion", description: "Honor loved ones forever" } },
  { title: "Wedding Gifts", handle: "wedding", metadata: { type: "occasion", description: "Timeless gifts for the couple" } },
  { title: "Birthday Gifts", handle: "birthday", metadata: { type: "occasion", description: "Unique art for special days" } },
  { title: "Father's Day", handle: "fathers-day", metadata: { type: "occasion", description: "Perfect gifts for dad" } },
  { title: "Mother's Day", handle: "mothers-day", metadata: { type: "occasion", description: "Art from the heart for mom" } },
  
  // Recipient Collections
  { title: "Gift for Him", handle: "gift-for-him", metadata: { type: "recipient", description: "Art he'll love" } },
  { title: "Gift for Her", handle: "gift-for-her", metadata: { type: "recipient", description: "Beautiful art for her" } },
  { title: "Gift for Dad", handle: "gift-for-dad", metadata: { type: "recipient", description: "Perfect for fathers" } },
  { title: "Gift for Mom", handle: "gift-for-mom", metadata: { type: "recipient", description: "Heartfelt art for mom" } },
  { title: "Gift for Couples", handle: "gift-for-couples", metadata: { type: "recipient", description: "Celebrate love together" } },
  
  // Marketing Collections
  { title: "New Arrivals", handle: "new-in", metadata: { type: "marketing", description: "Latest additions to our gallery" } },
  { title: "Best Sellers", handle: "best-sellers", metadata: { type: "marketing", description: "Customer favorites" } },
  { title: "Staff Picks", handle: "staff-picks", metadata: { type: "marketing", description: "Curated by our team" } },
  { title: "Limited Edition", handle: "limited-edition", metadata: { type: "marketing", description: "Exclusive limited runs" } },
];

export default async function seedLineVibesComplete({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const productService = container.resolve("product");
  const salesChannelService = container.resolve("sales_channel");
  const fulfillmentService = container.resolve("fulfillment");

  logger.info("\n=====================================");
  logger.info("🖋️  LINEVIBES COMPLETE SEED SCRIPT");
  logger.info("=====================================\n");

  // Get default sales channel
  const salesChannels = await salesChannelService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!salesChannels.length) {
    logger.error("❌ Default Sales Channel not found. Run main seed first.");
    return;
  }

  const defaultSalesChannel = salesChannels[0];

  // Get shipping profile
  const shippingProfiles = await fulfillmentService.listShippingProfiles({
    type: "default",
  });

  if (!shippingProfiles.length) {
    logger.error("❌ Default Shipping Profile not found. Run main seed first.");
    return;
  }

  const shippingProfile = shippingProfiles[0];

  // ==========================================
  // Step 1: Create Product Tags
  // ==========================================
  logger.info("🏷️  Step 1: Creating product tags...");

  const createdTags: { id: string; value: string }[] = [];

  for (const tag of PRODUCT_TAGS) {
    try {
      const existingTags = await productService.listProductTags({
        value: tag.value,
      });

      if (existingTags.length > 0) {
        createdTags.push({ id: existingTags[0].id, value: tag.value });
      } else {
        const newTags = await productService.createProductTags([{
          value: tag.value,
        }]);
        const newTag = Array.isArray(newTags) ? newTags[0] : newTags;
        createdTags.push({ id: newTag.id, value: tag.value });
      }
    } catch (error: any) {
      logger.warn(`   ⚠️  Tag "${tag.value}": ${error.message || error}`);
    }
  }
  logger.info(`   ✅ Created/verified ${createdTags.length} tags`);

  const getTagIds = (values: string[]): string[] => {
    return createdTags
      .filter((t) => values.includes(t.value))
      .map((t) => t.id);
  };

  // ==========================================
  // Step 2: Create Product Categories
  // ==========================================
  logger.info("\n📁 Step 2: Creating product categories...");

  const categoryMap: Record<string, any> = {};

  try {
    const { result: categoryResult } = await createProductCategoriesWorkflow(
      container
    ).run({
      input: {
        product_categories: CATEGORIES,
      },
    });

    for (const cat of categoryResult) {
      categoryMap[cat.handle] = cat;
    }
    logger.info(`   ✅ Created ${Object.keys(categoryMap).length} categories`);
  } catch (error: any) {
    logger.info("   ⏭️  Categories may already exist, fetching...");
    const existingCategories = await productService.listProductCategories({});
    for (const cat of existingCategories) {
      categoryMap[cat.handle] = cat;
    }
  }

  // ==========================================
  // Step 3: Create Collections
  // ==========================================
  logger.info("\n📚 Step 3: Creating collections...");

  const collectionMap: Record<string, any> = {};

  try {
    const { result: collectionResult } = await createCollectionsWorkflow(
      container
    ).run({
      input: {
        collections: COLLECTIONS,
      },
    });

    for (const col of collectionResult) {
      collectionMap[col.handle] = col;
    }
    logger.info(`   ✅ Created ${Object.keys(collectionMap).length} collections`);
  } catch (error: any) {
    logger.info("   ⏭️  Some collections may already exist");
    // Continue anyway
  }

  // ==========================================
  // Step 4: Create Sample Products
  // ==========================================
  logger.info("\n🖼️  Step 4: Creating sample products...");

  const productsToCreate = [
    // --------
    // AUTOMOTIVE PRODUCTS
    // --------
    {
      title: "Porsche 911 '64 Blueprint",
      handle: "porsche-911-blueprint",
      description: "A highly detailed technical drawing of the legendary 1964 Porsche 911. Plotted with precision using 0.1mm archival ink pens on high-grade blueprint paper. Perfect for automotive enthusiasts and engineering aficionados.",
      subtitle: "Classic Sports Car Schematic",
      status: ProductStatus.PUBLISHED,
      weight: 150,
      shipping_profile_id: shippingProfile.id,
      category_ids: categoryMap["automotive"] ? [categoryMap["automotive"].id] : [],
      collection_id: collectionMap["blueprint"]?.id,
      tags: getTagIds(["theme:automotive", "style:blueprint", "emotion:nostalgic", "gift-for:him", "gift-for:dad", "complexity:premium"]).map(id => ({ id })),
      metadata: {
        technique: "Robot Pen Plotter",
        estimated_delivery_days: 7,
        complexity_level: "premium",
        artist_notes: "Each line is plotted with 0.1mm archival ink",
        seo_keywords: ["porsche art", "car blueprint", "automotive poster", "911 drawing"],
      },
      images: [
        { url: "https://images.unsplash.com/photo-1614162692292-7ac56d7f367e?w=800&auto=format&fit=crop" },
      ],
      options: [
        { title: "Size", values: ["A3", "A2", "18x24"] },
        { title: "Paper", values: ["Classic Blue", "Museum White"] },
        { title: "Frame", values: ["No Frame", "Black Wood", "Natural Oak"] },
      ],
      variants: [
        {
          title: "A3 / Classic Blue / No Frame",
          sku: "AUTO-BP-A3-CB-NF-01",
          options: { Size: "A3", Paper: "Classic Blue", Frame: "No Frame" },
          prices: [{ amount: 4500, currency_code: "usd" }],
          manage_inventory: true,
        },
        {
          title: "A3 / Museum White / No Frame",
          sku: "AUTO-BP-A3-MW-NF-01",
          options: { Size: "A3", Paper: "Museum White", Frame: "No Frame" },
          prices: [{ amount: 4500, currency_code: "usd" }],
          manage_inventory: true,
        },
        {
          title: "A2 / Classic Blue / Black Wood",
          sku: "AUTO-BP-A2-CB-BW-01",
          options: { Size: "A2", Paper: "Classic Blue", Frame: "Black Wood" },
          prices: [{ amount: 8900, currency_code: "usd" }],
          manage_inventory: true,
        },
        {
          title: "18x24 / Museum White / Natural Oak",
          sku: "AUTO-BP-1824-MW-NO-01",
          options: { Size: "18x24", Paper: "Museum White", Frame: "Natural Oak" },
          prices: [{ amount: 9500, currency_code: "usd" }],
          manage_inventory: true,
        },
      ],
      sales_channels: [{ id: defaultSalesChannel.id }],
    },

    {
      title: "Classic Mustang Line Art",
      handle: "classic-mustang-line-art",
      description: "The iconic 1967 Ford Mustang captured in bold, expressive strokes. This minimalist interpretation celebrates the muscle car era with timeless elegance.",
      subtitle: "American Muscle Icon",
      status: ProductStatus.PUBLISHED,
      weight: 150,
      shipping_profile_id: shippingProfile.id,
      category_ids: categoryMap["automotive"] ? [categoryMap["automotive"].id] : [],
      collection_id: collectionMap["minimalist"]?.id,
      tags: getTagIds(["theme:automotive", "style:minimalist", "emotion:powerful", "gift-for:him", "gift-for:dad", "occasion:fathers-day", "complexity:medium"]).map(id => ({ id })),
      metadata: {
        technique: "Continuous Line Drawing",
        estimated_delivery_days: 5,
        complexity_level: "medium",
      },
      images: [
        { url: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&auto=format&fit=crop" },
      ],
      options: [
        { title: "Size", values: ["11x14", "16x20", "24x36"] },
        { title: "Paper", values: ["Museum White", "Vintage Cream"] },
      ],
      variants: [
        {
          title: "11x14 / Museum White",
          sku: "AUTO-MN-1114-MW-NF-01",
          options: { Size: "11x14", Paper: "Museum White" },
          prices: [{ amount: 3500, currency_code: "usd" }],
          manage_inventory: true,
        },
        {
          title: "16x20 / Vintage Cream",
          sku: "AUTO-MN-1620-VC-NF-01",
          options: { Size: "16x20", Paper: "Vintage Cream" },
          prices: [{ amount: 4900, currency_code: "usd" }],
          manage_inventory: true,
        },
        {
          title: "24x36 / Museum White",
          sku: "AUTO-MN-2436-MW-NF-01",
          options: { Size: "24x36", Paper: "Museum White" },
          prices: [{ amount: 7500, currency_code: "usd" }],
          manage_inventory: true,
        },
      ],
      sales_channels: [{ id: defaultSalesChannel.id }],
    },

    // --------
    // AVIATION PRODUCTS
    // --------
    {
      title: "Cessna 172 Skyhawk Schematic",
      handle: "cessna-172-schematic",
      description: "The world's most popular aircraft, immortalized in ink. This schematic view highlights the engine, fuselage, and control surfaces. An essential piece for pilots and aviation lovers.",
      subtitle: "Aviation Blueprint",
      status: ProductStatus.PUBLISHED,
      weight: 150,
      shipping_profile_id: shippingProfile.id,
      category_ids: categoryMap["aviation"] ? [categoryMap["aviation"].id] : [],
      collection_id: collectionMap["blueprint"]?.id,
      tags: getTagIds(["theme:aviation", "style:blueprint", "emotion:peaceful", "gift-for:him", "gift-for:dad", "complexity:premium"]).map(id => ({ id })),
      metadata: {
        technique: "Generative Line Art",
        estimated_delivery_days: 7,
        complexity_level: "premium",
      },
      images: [
        { url: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&auto=format&fit=crop" },
      ],
      options: [
        { title: "Size", values: ["A3", "A2"] },
        { title: "Frame", values: ["No Frame", "Black Wood"] },
      ],
      variants: [
        {
          title: "A3 / No Frame",
          sku: "AVIA-BP-A3-CB-NF-01",
          options: { Size: "A3", Frame: "No Frame" },
          prices: [{ amount: 4900, currency_code: "usd" }],
          manage_inventory: true,
        },
        {
          title: "A3 / Black Wood",
          sku: "AVIA-BP-A3-CB-BW-01",
          options: { Size: "A3", Frame: "Black Wood" },
          prices: [{ amount: 8900, currency_code: "usd" }],
          manage_inventory: true,
        },
        {
          title: "A2 / No Frame",
          sku: "AVIA-BP-A2-CB-NF-01",
          options: { Size: "A2", Frame: "No Frame" },
          prices: [{ amount: 6500, currency_code: "usd" }],
          manage_inventory: true,
        },
      ],
      sales_channels: [{ id: defaultSalesChannel.id }],
    },

    {
      title: "F-14 Tomcat Fighter Jet",
      handle: "f14-tomcat-fighter",
      description: "The legendary F-14 Tomcat in stunning detailed line art. Celebrating the iconic naval fighter that defined an era of aviation excellence.",
      subtitle: "Military Aviation Icon",
      status: ProductStatus.PUBLISHED,
      weight: 150,
      shipping_profile_id: shippingProfile.id,
      category_ids: categoryMap["aviation"] ? [categoryMap["aviation"].id] : [],
      collection_id: collectionMap["detailed"]?.id,
      tags: getTagIds(["theme:aviation", "style:detailed", "emotion:powerful", "gift-for:him", "complexity:premium"]).map(id => ({ id })),
      metadata: {
        technique: "High-Detail Pen Plotting",
        estimated_delivery_days: 10,
        complexity_level: "premium",
      },
      images: [
        { url: "https://images.unsplash.com/photo-1559628129-67cf63b72248?w=800&auto=format&fit=crop" },
      ],
      options: [
        { title: "Size", values: ["18x24", "24x36"] },
        { title: "Paper", values: ["Museum White", "Classic Blue"] },
      ],
      variants: [
        {
          title: "18x24 / Museum White",
          sku: "AVIA-DT-1824-MW-NF-01",
          options: { Size: "18x24", Paper: "Museum White" },
          prices: [{ amount: 6900, currency_code: "usd" }],
          manage_inventory: true,
        },
        {
          title: "24x36 / Classic Blue",
          sku: "AVIA-DT-2436-CB-NF-01",
          options: { Size: "24x36", Paper: "Classic Blue" },
          prices: [{ amount: 9900, currency_code: "usd" }],
          manage_inventory: true,
        },
      ],
      sales_channels: [{ id: defaultSalesChannel.id }],
    },

    // --------
    // OCEAN & NATURE PRODUCTS
    // --------
    {
      title: "Great Wave Minimalist",
      handle: "great-wave-minimalist",
      description: "A modern minimalist interpretation of the iconic wave. Single continuous line art that captures the power and beauty of the ocean. Perfect for coastal homes and surf enthusiasts.",
      subtitle: "Ocean Line Art",
      status: ProductStatus.PUBLISHED,
      weight: 150,
      shipping_profile_id: shippingProfile.id,
      category_ids: categoryMap["ocean-nature"] ? [categoryMap["ocean-nature"].id] : [],
      collection_id: collectionMap["minimalist"]?.id,
      tags: getTagIds(["theme:ocean", "theme:nature", "style:minimalist", "emotion:peaceful", "complexity:simple"]).map(id => ({ id })),
      metadata: {
        technique: "Single Line Drawing",
        estimated_delivery_days: 5,
        complexity_level: "simple",
      },
      images: [
        { url: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&auto=format&fit=crop" },
      ],
      options: [
        { title: "Size", values: ["8x10", "11x14", "16x20"] },
        { title: "Paper", values: ["Museum White", "Vintage Cream"] },
      ],
      variants: [
        {
          title: "8x10 / Museum White",
          sku: "OCNR-MN-810-MW-NF-01",
          options: { Size: "8x10", Paper: "Museum White" },
          prices: [{ amount: 2500, currency_code: "usd" }],
          manage_inventory: true,
        },
        {
          title: "11x14 / Vintage Cream",
          sku: "OCNR-MN-1114-VC-NF-01",
          options: { Size: "11x14", Paper: "Vintage Cream" },
          prices: [{ amount: 3500, currency_code: "usd" }],
          manage_inventory: true,
        },
        {
          title: "16x20 / Museum White",
          sku: "OCNR-MN-1620-MW-NF-01",
          options: { Size: "16x20", Paper: "Museum White" },
          prices: [{ amount: 4500, currency_code: "usd" }],
          manage_inventory: true,
        },
      ],
      sales_channels: [{ id: defaultSalesChannel.id }],
    },

    // --------
    // FAMILY & LOVE PRODUCTS
    // --------
    {
      title: "Custom Pet Contour Portrait",
      handle: "custom-pet-contour",
      description: "Turn your furry friend's photo into a modern, continuous line drawing. Our robots plot the path with unwavering precision, creating a minimalist masterpiece that captures their unique personality.",
      subtitle: "Upload Your Pet Photo",
      status: ProductStatus.PUBLISHED,
      weight: 200,
      shipping_profile_id: shippingProfile.id,
      category_ids: categoryMap["family-love"] ? [categoryMap["family-love"].id] : [],
      collection_id: collectionMap["minimalist"]?.id,
      tags: getTagIds(["theme:family", "style:minimalist", "emotion:memorial", "occasion:memorial", "occasion:birthday", "complexity:medium"]).map(id => ({ id })),
      metadata: {
        customizable: true,
        requires_upload: true,
        estimated_delivery_days: 14,
        complexity_level: "medium",
        artist_notes: "Send us your favorite photo and we'll transform it into art",
      },
      images: [
        { url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&auto=format&fit=crop" },
      ],
      options: [
        { title: "Size", values: ["8x10", "11x14", "16x20"] },
        { title: "Ink Color", values: ["Black", "Gold", "Rose Gold"] },
      ],
      variants: [
        {
          title: "8x10 / Black",
          sku: "FMLV-MN-810-MW-NF-01",
          options: { Size: "8x10", "Ink Color": "Black" },
          prices: [{ amount: 5500, currency_code: "usd" }],
          manage_inventory: false,
        },
        {
          title: "8x10 / Gold",
          sku: "FMLV-MN-810-MW-NF-02",
          options: { Size: "8x10", "Ink Color": "Gold" },
          prices: [{ amount: 6500, currency_code: "usd" }],
          manage_inventory: false,
        },
        {
          title: "11x14 / Black",
          sku: "FMLV-MN-1114-MW-NF-01",
          options: { Size: "11x14", "Ink Color": "Black" },
          prices: [{ amount: 7500, currency_code: "usd" }],
          manage_inventory: false,
        },
        {
          title: "16x20 / Rose Gold",
          sku: "FMLV-MN-1620-MW-NF-01",
          options: { Size: "16x20", "Ink Color": "Rose Gold" },
          prices: [{ amount: 9900, currency_code: "usd" }],
          manage_inventory: false,
        },
      ],
      sales_channels: [{ id: defaultSalesChannel.id }],
    },

    {
      title: "Couple Portrait - Intertwined",
      handle: "couple-portrait-intertwined",
      description: "A beautiful representation of two souls becoming one. This dual-portrait style uses continuous intertwining lines to symbolize the connection between partners. Perfect for anniversaries and weddings.",
      subtitle: "Custom Couple Art",
      status: ProductStatus.PUBLISHED,
      weight: 200,
      shipping_profile_id: shippingProfile.id,
      category_ids: categoryMap["family-love"] ? [categoryMap["family-love"].id] : [],
      collection_id: collectionMap["anniversary"]?.id,
      tags: getTagIds(["theme:family", "style:minimalist", "emotion:romantic", "occasion:anniversary", "occasion:wedding", "gift-for:couple", "complexity:premium"]).map(id => ({ id })),
      metadata: {
        customizable: true,
        requires_upload: true,
        estimated_delivery_days: 14,
        complexity_level: "premium",
      },
      images: [
        { url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&auto=format&fit=crop" },
      ],
      options: [
        { title: "Size", values: ["11x14", "16x20", "24x36"] },
        { title: "Frame", values: ["No Frame", "White Wood", "Natural Oak"] },
      ],
      variants: [
        {
          title: "11x14 / No Frame",
          sku: "FMLV-MN-1114-MW-NF-02",
          options: { Size: "11x14", Frame: "No Frame" },
          prices: [{ amount: 7900, currency_code: "usd" }],
          manage_inventory: false,
        },
        {
          title: "16x20 / White Wood",
          sku: "FMLV-MN-1620-MW-WW-01",
          options: { Size: "16x20", Frame: "White Wood" },
          prices: [{ amount: 12900, currency_code: "usd" }],
          manage_inventory: false,
        },
        {
          title: "24x36 / Natural Oak",
          sku: "FMLV-MN-2436-MW-NO-01",
          options: { Size: "24x36", Frame: "Natural Oak" },
          prices: [{ amount: 18900, currency_code: "usd" }],
          manage_inventory: false,
        },
      ],
      sales_channels: [{ id: defaultSalesChannel.id }],
    },

    {
      title: "Memorial Angel Wings",
      handle: "memorial-angel-wings",
      description: "A tender tribute to those who have passed. Delicate angel wings rendered in soft, flowing lines, with optional personalization for names and dates. A meaningful way to honor cherished memories.",
      subtitle: "In Loving Memory",
      status: ProductStatus.PUBLISHED,
      weight: 200,
      shipping_profile_id: shippingProfile.id,
      category_ids: categoryMap["family-love"] ? [categoryMap["family-love"].id] : [],
      collection_id: collectionMap["memorial"]?.id,
      tags: getTagIds(["theme:family", "theme:memorial", "style:detailed", "emotion:memorial", "occasion:memorial", "complexity:medium"]).map(id => ({ id })),
      metadata: {
        customizable: true,
        personalization_options: ["name", "dates", "quote"],
        estimated_delivery_days: 10,
        complexity_level: "medium",
      },
      images: [
        { url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop" },
      ],
      options: [
        { title: "Size", values: ["8x10", "11x14"] },
        { title: "Paper", values: ["Museum White", "Vintage Cream"] },
      ],
      variants: [
        {
          title: "8x10 / Museum White",
          sku: "FMLV-DT-810-MW-NF-01",
          options: { Size: "8x10", Paper: "Museum White" },
          prices: [{ amount: 4900, currency_code: "usd" }],
          manage_inventory: false,
        },
        {
          title: "11x14 / Vintage Cream",
          sku: "FMLV-DT-1114-VC-NF-01",
          options: { Size: "11x14", Paper: "Vintage Cream" },
          prices: [{ amount: 6500, currency_code: "usd" }],
          manage_inventory: false,
        },
      ],
      sales_channels: [{ id: defaultSalesChannel.id }],
    },

    // --------
    // ARCHITECTURE PRODUCTS
    // --------
    {
      title: "NYC Skyline Geometric",
      handle: "nyc-skyline-geometric",
      description: "The iconic New York City skyline reimagined in geometric precision. Bold lines capture the energy and ambition of the city that never sleeps.",
      subtitle: "Urban Architecture Art",
      status: ProductStatus.PUBLISHED,
      weight: 150,
      shipping_profile_id: shippingProfile.id,
      category_ids: categoryMap["architecture"] ? [categoryMap["architecture"].id] : [],
      collection_id: collectionMap["bold-stroke"]?.id,
      tags: getTagIds(["theme:architecture", "style:bold", "style:geometric", "emotion:powerful", "complexity:medium"]).map(id => ({ id })),
      metadata: {
        technique: "Geometric Line Art",
        estimated_delivery_days: 5,
        complexity_level: "medium",
      },
      images: [
        { url: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format&fit=crop" },
      ],
      options: [
        { title: "Size", values: ["18x24", "24x36"] },
        { title: "Paper", values: ["Museum White", "Black"] },
      ],
      variants: [
        {
          title: "18x24 / Museum White",
          sku: "ARCH-BS-1824-MW-NF-01",
          options: { Size: "18x24", Paper: "Museum White" },
          prices: [{ amount: 5500, currency_code: "usd" }],
          manage_inventory: true,
        },
        {
          title: "24x36 / Black",
          sku: "ARCH-BS-2436-BK-NF-01",
          options: { Size: "24x36", Paper: "Black" },
          prices: [{ amount: 7900, currency_code: "usd" }],
          manage_inventory: true,
        },
      ],
      sales_channels: [{ id: defaultSalesChannel.id }],
    },

    // --------
    // DIGITAL PRODUCTS
    // --------
    {
      title: "Mountain Range Digital Download",
      handle: "mountain-range-digital",
      description: "Majestic mountain peaks in minimalist line art. Instant digital download in multiple sizes. Print at home or at your favorite print shop.",
      subtitle: "Printable Art",
      status: ProductStatus.PUBLISHED,
      weight: 0,
      shipping_profile_id: shippingProfile.id,
      category_ids: categoryMap["ocean-nature"] ? [categoryMap["ocean-nature"].id] : [],
      collection_id: collectionMap["digital"]?.id,
      tags: getTagIds(["theme:nature", "style:minimalist", "emotion:peaceful", "format:digital", "complexity:simple"]).map(id => ({ id })),
      metadata: {
        is_digital: true,
        file_formats: ["PDF", "PNG", "SVG"],
        print_sizes: ["5x7", "8x10", "11x14", "16x20", "A4", "A3"],
        estimated_delivery_days: 0,
        instant_download: true,
      },
      images: [
        { url: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&auto=format&fit=crop" },
      ],
      options: [
        { title: "License", values: ["Personal Use", "Commercial Use"] },
      ],
      variants: [
        {
          title: "Personal Use License",
          sku: "DIG-MN-PERS-01",
          options: { License: "Personal Use" },
          prices: [{ amount: 1500, currency_code: "usd" }],
          manage_inventory: false,
        },
        {
          title: "Commercial Use License",
          sku: "DIG-MN-COMM-01",
          options: { License: "Commercial Use" },
          prices: [{ amount: 4500, currency_code: "usd" }],
          manage_inventory: false,
        },
      ],
      sales_channels: [{ id: defaultSalesChannel.id }],
    },
  ];

  try {
    await createProductsWorkflow(container).run({
      input: {
        products: productsToCreate,
      },
    });
    logger.info(`   ✅ Created ${productsToCreate.length} sample products`);
  } catch (error: any) {
    logger.error(`   ❌ Failed to create products: ${error.message || error}`);
    // Log individual product errors if available
    if (error.errors) {
      for (const err of error.errors) {
        logger.error(`      - ${err.message}`);
      }
    }
  }

  // ==========================================
  // Summary
  // ==========================================
  logger.info("\n=====================================");
  logger.info("🎉 LINEVIBES SEED COMPLETED!");
  logger.info("=====================================");
  logger.info(`
📊 Summary:
   • Tags:        ${createdTags.length} created/verified
   • Categories:  ${Object.keys(categoryMap).length} created
   • Collections: ${Object.keys(collectionMap).length} created  
   • Products:    ${productsToCreate.length} created

🔗 Next Steps:
   1. Visit Medusa Admin to verify products
   2. Add product images via Admin UI
   3. Configure inventory levels
   4. Set up additional pricing (EUR, GBP, etc.)
  `);
}
