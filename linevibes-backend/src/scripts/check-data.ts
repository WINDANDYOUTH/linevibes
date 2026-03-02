import { ExecArgs } from "@medusajs/framework/types";
import * as fs from "fs";

export default async function checkData({ container }: ExecArgs) {
  const productService = container.resolve("product");
  
  let output = "\n📊 BetterKnitwear Data Check\n";
  output += "=====================================\n\n";
  
  // Check tags
  try {
    const tags = await productService.listProductTags({});
    output += `🏷️  Product Tags: ${tags.length} found\n`;
    if (tags.length > 0) {
      output += "   Sample tags:\n";
      tags.slice(0, 15).forEach((t: any) => output += `   - ${t.value}\n`);
      if (tags.length > 15) {
        output += `   ... and ${tags.length - 15} more\n`;
      }
    }
  } catch (e: any) {
    output += `❌ Error listing tags: ${e.message}\n`;
  }
  
  // Check products
  try {
    const [products, count] = await productService.listAndCountProducts({});
    output += `\n👕 Products: ${count} found\n`;
    products.forEach((p: any) => {
      output += `   - ${p.title} (${p.status})\n`;
      if (p.tags && p.tags.length > 0) {
        output += `     Tags: ${p.tags.map((t: any) => t.value).join(", ")}\n`;
      }
    });
  } catch (e: any) {
    output += `❌ Error listing products: ${e.message}\n`;
  }
  
  // Check categories
  try {
    const categories = await productService.listProductCategories({});
    output += `\n📁 Categories: ${categories.length} found\n`;
    categories.forEach((c: any) => output += `   - ${c.name}\n`);
  } catch (e: any) {
    output += `❌ Error listing categories: ${e.message}\n`;
  }
  
  output += "\n=====================================\n";
  
  // Write to file
  fs.writeFileSync("data-check-output.txt", output, "utf8");
  console.log("Output written to data-check-output.txt");
}
