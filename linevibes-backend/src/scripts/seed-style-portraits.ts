import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createProductsWorkflow,
  updateProductsWorkflow,
} from "@medusajs/medusa/core-flows";

import {
  STYLE_PORTRAIT_COLLECTIONS,
  STYLE_PORTRAIT_OUTPUT_PRODUCTS,
  STYLE_PORTRAIT_TAGS,
  STYLE_PORTRAIT_TEMPLATE_PRODUCTS,
  type StylePortraitOutputProductSeed,
  type StylePortraitTemplateProductSeed,
} from "./data/style-portrait-catalog";

type TagMap = Record<string, string>;
type CollectionMap = Record<string, { id: string; handle: string }>;

function slugToSku(input: string) {
  return input.replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").toUpperCase();
}

async function ensureTagMap(productService: any, logger: any): Promise<TagMap> {
  const tagMap: TagMap = {};

  for (const value of STYLE_PORTRAIT_TAGS) {
    const existing = await productService.listProductTags({ value });

    if (existing.length > 0) {
      tagMap[value] = existing[0].id;
      continue;
    }

    try {
      const created = await productService.createProductTags([{ value }]);
      const nextTag = Array.isArray(created) ? created[0] : created;
      tagMap[value] = nextTag.id;
    } catch (error: any) {
      logger.warn(
        `Skipping tag "${value}" because it could not be created: ${error.message || error}`
      );
    }
  }

  return tagMap;
}

async function ensureCollectionMap(
  productService: any,
  logger: any
): Promise<CollectionMap> {
  const requestedHandles = STYLE_PORTRAIT_COLLECTIONS.map((collection) => collection.handle);
  const existingCollections = await productService.listProductCollections(
    { handle: requestedHandles } as any,
    { take: requestedHandles.length }
  );

  const existingByHandle = new Map<string, any>(
    existingCollections.map((collection: any) => [collection.handle, collection])
  );

  for (const collection of STYLE_PORTRAIT_COLLECTIONS) {
    const existing = existingByHandle.get(collection.handle);

    if (existing) {
      await productService.updateProductCollections(existing.id, {
        title: collection.title,
        handle: collection.handle,
        metadata: collection.metadata,
      });
      continue;
    }

    try {
      const created = await productService.createProductCollections({
        title: collection.title,
        handle: collection.handle,
        metadata: collection.metadata,
      });
      existingByHandle.set(collection.handle, created);
    } catch (error: any) {
      logger.warn(
        `Skipping collection "${collection.handle}" because it could not be created: ${
          error.message || error
        }`
      );
    }
  }

  const refreshedCollections = await productService.listProductCollections(
    { handle: requestedHandles } as any,
    { take: requestedHandles.length }
  );

  return Object.fromEntries(
    refreshedCollections.map((collection: any) => [
      collection.handle,
      { id: collection.id, handle: collection.handle },
    ])
  );
}

function buildOutputCreateInput(
  definition: StylePortraitOutputProductSeed,
  salesChannelId: string,
  shippingProfileId: string,
  collectionMap: CollectionMap
) {
  const collectionId = definition.collectionHandle
    ? collectionMap[definition.collectionHandle]?.id
    : undefined;

  return {
    title: definition.title,
    handle: definition.handle,
    subtitle: definition.subtitle,
    description: definition.description,
    status: ProductStatus.PUBLISHED,
    weight: definition.handle === "portrait-digital" ? 0 : 200,
    shipping_profile_id: shippingProfileId,
    collection_id: collectionId,
    metadata: definition.metadata,
    images: [{ url: definition.imageUrl }],
    options: [{ title: "Edition", values: ["Standard"] }],
    variants: [
      {
        title: "Standard",
        sku: slugToSku(definition.handle),
        options: { Edition: "Standard" },
        prices: [{ amount: definition.price, currency_code: "usd" }],
        manage_inventory: false,
        allow_backorder: true,
      },
    ],
    sales_channels: [{ id: salesChannelId }],
  };
}

function buildOutputUpdateInput(
  id: string,
  definition: StylePortraitOutputProductSeed,
  salesChannelId: string,
  shippingProfileId: string,
  collectionMap: CollectionMap
) {
  const collectionId = definition.collectionHandle
    ? collectionMap[definition.collectionHandle]?.id
    : undefined;

  return {
    id,
    title: definition.title,
    handle: definition.handle,
    subtitle: definition.subtitle,
    description: definition.description,
    status: ProductStatus.PUBLISHED,
    shipping_profile_id: shippingProfileId,
    collection_id: collectionId,
    metadata: definition.metadata,
    images: [{ url: definition.imageUrl }],
    sales_channels: [{ id: salesChannelId }],
  };
}

function buildTemplateMetadata(definition: StylePortraitTemplateProductSeed) {
  return {
    portrait_mode: "style-template",
    template_group: definition.templateGroup,
    template_family: definition.templateFamily,
    template_id: definition.templateId,
    template_badge: definition.badge || "",
    template_sort_order: String(definition.sortOrder),
    preview_image_url: definition.imageUrl,
    reference_image_url: definition.imageUrl,
    prompt_preset: definition.promptPreset,
    prompt_notes: definition.promptNotes || "",
    negative_prompt: definition.negativePrompt || "",
    output_digital_handle: "portrait-digital",
    output_print_handle: "portrait-print",
    output_canvas_handle: "portrait-canvas",
    template_schema_version: "v1",
  };
}

function buildTemplateCreateInput(
  definition: StylePortraitTemplateProductSeed,
  salesChannelId: string,
  shippingProfileId: string,
  collectionMap: CollectionMap,
  tagMap: TagMap
) {
  const collectionId = collectionMap[definition.collectionHandle]?.id;

  return {
    title: definition.title,
    handle: definition.handle,
    subtitle: definition.subtitle,
    description: definition.description,
    status: ProductStatus.PUBLISHED,
    weight: 0,
    shipping_profile_id: shippingProfileId,
    collection_id: collectionId,
    tags: definition.tags
      .map((tag) => tagMap[tag])
      .filter(Boolean)
      .map((id) => ({ id })),
    metadata: buildTemplateMetadata(definition),
    images: [{ url: definition.imageUrl }],
    options: [{ title: "Template", values: ["Default"] }],
    variants: [
      {
        title: "Default Template",
        sku: slugToSku(definition.handle),
        options: { Template: "Default" },
        prices: [{ amount: definition.price, currency_code: "usd" }],
        manage_inventory: false,
        allow_backorder: true,
      },
    ],
    sales_channels: [{ id: salesChannelId }],
  };
}

function buildTemplateUpdateInput(
  id: string,
  definition: StylePortraitTemplateProductSeed,
  salesChannelId: string,
  shippingProfileId: string,
  collectionMap: CollectionMap,
  tagMap: TagMap
) {
  const collectionId = collectionMap[definition.collectionHandle]?.id;

  return {
    id,
    title: definition.title,
    handle: definition.handle,
    subtitle: definition.subtitle,
    description: definition.description,
    status: ProductStatus.PUBLISHED,
    shipping_profile_id: shippingProfileId,
    collection_id: collectionId,
    tags: definition.tags
      .map((tag) => tagMap[tag])
      .filter(Boolean)
      .map((tagId) => ({ id: tagId })),
    metadata: buildTemplateMetadata(definition),
    images: [{ url: definition.imageUrl }],
    sales_channels: [{ id: salesChannelId }],
  };
}

export default async function seedStylePortraits({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const productService = container.resolve("product");
  const salesChannelService = container.resolve("sales_channel");
  const fulfillmentService = container.resolve("fulfillment");

  logger.info("Starting style portrait template seed...");

  const salesChannels = await salesChannelService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!salesChannels.length) {
    logger.error("Default Sales Channel not found. Run the base Medusa seed first.");
    return;
  }

  const shippingProfiles = await fulfillmentService.listShippingProfiles({
    type: "default",
  });

  if (!shippingProfiles.length) {
    logger.error("Default Shipping Profile not found. Run the base Medusa seed first.");
    return;
  }

  const defaultSalesChannel = salesChannels[0];
  const shippingProfile = shippingProfiles[0];

  const tagMap = await ensureTagMap(productService, logger);
  const collectionMap = await ensureCollectionMap(productService, logger);

  const allDefinitions = [
    ...STYLE_PORTRAIT_OUTPUT_PRODUCTS.map((definition) => ({
      kind: "output" as const,
      handle: definition.handle,
      definition,
    })),
    ...STYLE_PORTRAIT_TEMPLATE_PRODUCTS.map((definition) => ({
      kind: "template" as const,
      handle: definition.handle,
      definition,
    })),
  ];

  const existingProducts = await productService.listProducts(
    { handle: allDefinitions.map((entry) => entry.handle) } as any,
    { take: allDefinitions.length }
  );

  const existingByHandle = new Map(
    existingProducts.map((product: any) => [product.handle, product])
  );

  const createInputs: any[] = [];
  const updateInputs: any[] = [];

  for (const entry of allDefinitions) {
    const existing = existingByHandle.get(entry.handle);

    if (entry.kind === "output") {
      if (existing) {
        updateInputs.push(
          buildOutputUpdateInput(
            existing.id,
            entry.definition,
            defaultSalesChannel.id,
            shippingProfile.id,
            collectionMap
          )
        );
      } else {
        createInputs.push(
          buildOutputCreateInput(
            entry.definition,
            defaultSalesChannel.id,
            shippingProfile.id,
            collectionMap
          )
        );
      }

      continue;
    }

    if (existing) {
      updateInputs.push(
        buildTemplateUpdateInput(
          existing.id,
          entry.definition,
          defaultSalesChannel.id,
          shippingProfile.id,
          collectionMap,
          tagMap
        )
      );
    } else {
      createInputs.push(
        buildTemplateCreateInput(
          entry.definition,
          defaultSalesChannel.id,
          shippingProfile.id,
          collectionMap,
          tagMap
        )
      );
    }
  }

  if (createInputs.length) {
    await createProductsWorkflow(container).run({
      input: {
        products: createInputs,
      },
    });
  }

  if (updateInputs.length) {
    await updateProductsWorkflow(container).run({
      input: {
        products: updateInputs,
      },
    });
  }

  logger.info(
    `Style portrait seed complete. Created ${createInputs.length} products, updated ${updateInputs.length} products.`
  );
}
