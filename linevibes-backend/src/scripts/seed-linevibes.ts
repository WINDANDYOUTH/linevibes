import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createProductsWorkflow,
  createProductCategoriesWorkflow,
} from "@medusajs/medusa/core-flows";

/**
 * LineVibes Product Tags & Sample Products Seed Script
 * 
 * Run with: npx medusa exec ./src/scripts/seed-linevibes.ts
 */

// Tags for Blueprint/Machine Art
const PRODUCT_TAGS = [
  // Art Style
  { value: "blueprint" },
  { value: "sketch" },
  { value: "geometric" },
  { value: "generative" },
  
  // Theme
  { value: "automotive" },
  { value: "aviation" },
  { value: "maritime" },
  { value: "architecture" },
  { value: "custom" },
  
  // Paper Type
  { value: "blueprint-blue" },
  { value: "museum-white" },
  { value: "vintage-cream" },
  
  // Frame
  { value: "unframed" },
  { value: "black-frame" },
  { value: "oak-frame" },
];

export default async function seedLineVibesData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const productService = container.resolve("product");
  const salesChannelService = container.resolve("sales_channel");
  const fulfillmentService = container.resolve("fulfillment");

  logger.info("🖋️ Starting LineVibes seed script...");

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
  logger.info("🏷️  Creating product tags...");

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
      logger.warn(`   ⚠️  Could not create tag "${tag.value}": ${error.message || error}`);
    }
  }

  const getTagIds = (values: string[]): string[] => {
    return createdTags
      .filter((t) => values.includes(t.value))
      .map((t) => t.id);
  };

  // ==========================================
  // Step 2: Create Product Categories
  // ==========================================
  logger.info("📁 Creating product categories...");

  let blueprintsCategory: any;
  let customCategory: any;
  let mapsCategory: any;

  try {
    const { result: categoryResult } = await createProductCategoriesWorkflow(
      container
    ).run({
      input: {
        product_categories: [
          {
            name: "Blueprints",
            handle: "blueprints",
            is_active: true,
            is_internal: false,
            description: "Technical schematics of machines and architecture.",
          },
          {
            name: "Custom Designs",
            handle: "custom-designs",
            is_active: true,
            is_internal: false,
            description: "Turn your photos into plotted art.",
          },
          {
            name: "Minimalist Maps",
            handle: "maps",
            is_active: true,
            is_internal: false,
            description: "City grids and topographies drawn in ink.",
          },
        ],
      },
    });

    blueprintsCategory = categoryResult.find((cat) => cat.name === "Blueprints");
    customCategory = categoryResult.find((cat) => cat.name === "Custom Designs");

    logger.info("   ✅ Created categories: Blueprints, Custom Designs, Maps");
  } catch (error: any) {
    logger.info("   ⏭️  Categories may already exist...");
    const existingCategories = await productService.listProductCategories({});
    blueprintsCategory = existingCategories.find((cat: any) => cat.name === "Blueprints");
    customCategory = existingCategories.find((cat: any) => cat.name === "Custom Designs");
  }

  // ==========================================
  // Step 3: Create Sample LineVibes Products
  // ==========================================
  logger.info("🖼️ Creating sample artwork products...");

  const productsToCreate = [
    // Product 1: Porsche 911 Blueprint
    {
      title: "Porsche 911 '64 Blueprint",
      handle: "porsche-911-blueprint",
      description: "A highly detailed technical drawing of the legendary 1964 Porsche 911. Plotted with precision using 0.1mm archival ink pens on high-grade blueprint paper. Perfect for automotive enthusiasts and engineering aficionados.",
      subtitle: "Technical Pen Plotting",
      status: ProductStatus.PUBLISHED,
      weight: 150,
      shipping_profile_id: shippingProfile.id,
      category_ids: blueprintsCategory ? [blueprintsCategory.id] : [],
      tags: getTagIds(["blueprint", "automotive", "blueprint-blue", "geometric"]).map(id => ({ id })),
      metadata: {
        dimensions: "18x24 inches",
        paper_weight: "180gsm",
        technique: "Robot Pen Plotter",
        artist: "LineVibes Studio",
      },
      images: [
        { url: "https://images.unsplash.com/photo-1599557288647-73d8ebc18ec5?w=800&auto=format&fit=crop" }, // Blueprint-like image
      ],
      options: [
        { title: "Size", values: ["A3", "A2", "18x24"] },
        { title: "Paper Color", values: ["Classic Blue", "Technical White"] },
      ],
      variants: [
        {
          title: "A3 / Classic Blue",
          sku: "P911-A3-BLU",
          options: { Size: "A3", "Paper Color": "Classic Blue" },
          prices: [{ amount: 4500, currency_code: "usd" }],
        },
        {
          title: "A3 / Technical White",
          sku: "P911-A3-WHT",
          options: { Size: "A3", "Paper Color": "Technical White" },
          prices: [{ amount: 4500, currency_code: "usd" }],
        },
         {
          title: "18x24 / Classic Blue",
          sku: "P911-1824-BLU",
          options: { Size: "18x24", "Paper Color": "Classic Blue" },
          prices: [{ amount: 6500, currency_code: "usd" }],
        },
      ],
      sales_channels: [{ id: defaultSalesChannel.id }],
    },

    // Product 2: Cessna 172 Skyhawk
    {
      title: "Cessna 172 Skyhawk Schematic",
      handle: "cessna-172-schematic",
      description: "The world's most popular aircraft, immortalized in ink. This schematic view highlights the engine, fuselage, and control surfaces. An essential piece for pilots and aviation lovers.",
      subtitle: "Aviation Blueprint",
      status: ProductStatus.PUBLISHED,
      weight: 150,
      shipping_profile_id: shippingProfile.id,
      category_ids: blueprintsCategory ? [blueprintsCategory.id] : [],
      tags: getTagIds(["blueprint", "aviation", "sketch", "geometric"]).map(id => ({ id })),
      metadata: {
        technique: "Generative Line Art",
      },
      images: [
        { url: "https://images.unsplash.com/photo-1522055681650-749454170ddc?w=800&auto=format&fit=crop" }, // Drawing/Blueprint style
      ],
      options: [
        { title: "Size", values: ["A3", "A2"] },
        { title: "Frame", values: ["No Frame", "Black Oak"] },
      ],
      variants: [
        {
          title: "A3 / No Frame",
          sku: "C172-A3-NF",
          options: { Size: "A3", Frame: "No Frame" },
          prices: [{ amount: 4900, currency_code: "usd" }],
        },
        {
          title: "A3 / Black Oak",
          sku: "C172-A3-BO",
          options: { Size: "A3", Frame: "Black Oak" },
          prices: [{ amount: 8900, currency_code: "usd" }],
        },
      ],
      sales_channels: [{ id: defaultSalesChannel.id }],
    },

    // Product 3: Custom Pet Contour Portrait
    {
      title: "Custom Pet Contour Portrait",
      handle: "custom-pet-contour",
      description: "Turn your furry friend's photo into a modern, continuous line drawing. Our robots plot the path with unwavering precision, creating a minimalist masterpiece.",
      subtitle: "Upload Your Photo",
      status: ProductStatus.PUBLISHED,
      weight: 200,
      shipping_profile_id: shippingProfile.id,
      category_ids: customCategory ? [customCategory.id] : [],
      tags: getTagIds(["custom", "sketch", "museum-white"]).map(id => ({ id })),
      metadata: {
        customizable: true,
      },
      images: [
        { url: "https://images.unsplash.com/photo-1549488497-2357754f9810?w=800&auto=format&fit=crop" }, // Minimalist art
      ],
      options: [
        { title: "Size", values: ["8x10", "11x14"] },
        { title: "Ink Color", values: ["Black", "Gold"] },
      ],
      variants: [
        {
          title: "8x10 / Black",
          sku: "PET-810-BLK",
          options: { Size: "8x10", "Ink Color": "Black" },
          prices: [{ amount: 5500, currency_code: "usd" }],
        },
         {
          title: "8x10 / Gold",
          sku: "PET-810-GLD",
          options: { Size: "8x10", "Ink Color": "Gold" },
          prices: [{ amount: 6500, currency_code: "usd" }],
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
    logger.info("   ✅ Created LineVibes sample products");
  } catch (error: any) {
    logger.error(`   ❌ Failed to create products: ${error.message || error}`);
  }

  logger.info("\n=====================================");
  logger.info("🎉 LineVibes seed completed!");
  logger.info("=====================================\n");
}
