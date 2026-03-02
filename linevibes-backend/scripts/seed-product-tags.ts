/**
 * BetterKnitwear Product Tags Seed Script
 * 
 * This script creates all the product tags needed for the filter system.
 * Run with: npx ts-node scripts/seed-product-tags.ts
 * 
 * Make sure your Medusa backend is running before executing this script.
 */

import Medusa from "@medusajs/js-sdk"

// Medusa Admin SDK configuration
const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"

// All tags organized by filter category
const PRODUCT_TAGS = {
  // Style tags
  style: [
    { value: "crewneck", metadata: { category: "style", display_name: "Crewneck" } },
    { value: "v-neck", metadata: { category: "style", display_name: "V-Neck" } },
    { value: "half-zip", metadata: { category: "style", display_name: "Half Zip" } },
    { value: "full-zip", metadata: { category: "style", display_name: "Full Zip" } },
    { value: "cardigan", metadata: { category: "style", display_name: "Cardigan" } },
    { value: "polo-knit", metadata: { category: "style", display_name: "Polo Knit" } },
  ],
  
  // Warmth Level tags
  warmth: [
    { value: "light", metadata: { category: "warmth", display_name: "Light" } },
    { value: "medium", metadata: { category: "warmth", display_name: "Medium" } },
    { value: "warm", metadata: { category: "warmth", display_name: "Warm" } },
    { value: "extra-warm", metadata: { category: "warmth", display_name: "Extra Warm" } },
  ],
  
  // Material tags
  material: [
    { value: "merino-wool", metadata: { category: "material", display_name: "Merino Wool" } },
    { value: "lambswool", metadata: { category: "material", display_name: "Lambswool" } },
    { value: "wool-blend", metadata: { category: "material", display_name: "Wool Blend" } },
    { value: "cotton-blend", metadata: { category: "material", display_name: "Cotton Blend" } },
    { value: "cashmere-blend", metadata: { category: "material", display_name: "Cashmere Blend" } },
  ],
  
  // Gauge/Weight tags
  gauge: [
    { value: "fine-gauge", metadata: { category: "gauge", display_name: "Fine Gauge" } },
    { value: "mid-gauge", metadata: { category: "gauge", display_name: "Mid Gauge" } },
    { value: "chunky", metadata: { category: "gauge", display_name: "Chunky" } },
  ],
  
  // Season tags
  season: [
    { value: "fall", metadata: { category: "season", display_name: "Fall" } },
    { value: "winter", metadata: { category: "season", display_name: "Winter" } },
    { value: "transitional", metadata: { category: "season", display_name: "Transitional" } },
  ],
  
  // Color tags
  color: [
    { value: "navy", metadata: { category: "color", display_name: "Navy" } },
    { value: "charcoal", metadata: { category: "color", display_name: "Charcoal" } },
    { value: "burgundy", metadata: { category: "color", display_name: "Burgundy" } },
    { value: "forest-green", metadata: { category: "color", display_name: "Forest Green" } },
    { value: "cream", metadata: { category: "color", display_name: "Cream" } },
    { value: "camel", metadata: { category: "color", display_name: "Camel" } },
    { value: "grey", metadata: { category: "color", display_name: "Grey" } },
    { value: "black", metadata: { category: "color", display_name: "Black" } },
  ],
}

async function seedProductTags() {
  console.log("🏷️  BetterKnitwear Product Tags Seeder")
  console.log("=====================================\n")
  
  console.log(`Connecting to Medusa backend at: ${MEDUSA_BACKEND_URL}\n`)
  
  const allTags = Object.values(PRODUCT_TAGS).flat()
  console.log(`📦 Preparing to create ${allTags.length} product tags...\n`)
  
  let created = 0
  let skipped = 0
  let errors = 0
  
  for (const [category, tags] of Object.entries(PRODUCT_TAGS)) {
    console.log(`\n📂 Category: ${category.toUpperCase()}`)
    console.log("-".repeat(40))
    
    for (const tag of tags) {
      try {
        // Use Admin API to create tag
        const response = await fetch(`${MEDUSA_BACKEND_URL}/admin/product-tags`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Note: You may need to add authentication headers here
            // "Authorization": "Bearer YOUR_API_TOKEN"
          },
          body: JSON.stringify({
            value: tag.value,
            metadata: tag.metadata,
          }),
        })
        
        if (response.ok) {
          const data = await response.json()
          console.log(`  ✅ Created: ${tag.value} (ID: ${data.product_tag?.id || 'N/A'})`)
          created++
        } else if (response.status === 409) {
          console.log(`  ⏭️  Skipped: ${tag.value} (already exists)`)
          skipped++
        } else {
          const error = await response.text()
          console.log(`  ❌ Error: ${tag.value} - ${error}`)
          errors++
        }
      } catch (error) {
        console.log(`  ❌ Error: ${tag.value} - ${error}`)
        errors++
      }
    }
  }
  
  console.log("\n=====================================")
  console.log("📊 Summary:")
  console.log(`   ✅ Created: ${created}`)
  console.log(`   ⏭️  Skipped: ${skipped}`)
  console.log(`   ❌ Errors:  ${errors}`)
  console.log("=====================================\n")
  
  if (errors > 0) {
    console.log("⚠️  Some tags failed to create. You may need to:")
    console.log("   1. Make sure Medusa backend is running")
    console.log("   2. Add authentication headers if required")
    console.log("   3. Create tags manually in Medusa Admin")
  }
}

// Run the seeder
seedProductTags().catch(console.error)
