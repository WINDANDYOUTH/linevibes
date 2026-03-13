# Style Template Product Model

This storefront does not use a native Shopify-style "product template" selector yet.

Current behavior:

- A Medusa product becomes a style-template product when `metadata.portrait_mode = "style-template"`.
- The storefront checks that metadata in `src/lib/portrait/style-template.ts`.
- If the flag is present, the product detail page renders the upload-and-generate experience instead of the default PDP.
- The actual purchasable SKUs remain shared fulfillment products:
  - `portrait-digital`
  - `portrait-print`
  - `portrait-canvas`

## Required Metadata

Add these keys to a Medusa product:

- `portrait_mode=style-template`
- `template_group=for-girls|for-boys|fantasy`
- `template_family=princesses|mermaid|ballet|adventure|magic`
- `template_id=unique_template_id`
- `reference_image_url=/images/style-templates/your-template.svg` or a full URL
- `prompt_preset=main_generation_prompt`

Useful optional keys:

- `template_badge=Best Seller`
- `template_sort_order=10`
- `preview_image_url=/images/style-templates/your-template.svg`
- `prompt_notes=extra_direction`
- `negative_prompt=no text, no extra fingers`
- `output_digital_handle=portrait-digital`
- `output_print_handle=portrait-print`
- `output_canvas_handle=portrait-canvas`

## Admin Recommendation

Short term:

- Treat this as a metadata-driven template system.
- Create products from seed/import scripts or duplicate an existing template product in Medusa Admin and edit metadata.

Next step if you want Shopify-like UX:

- Build a Medusa Admin widget or custom form section with:
  - a `Portrait Template` toggle
  - a `Template Group` dropdown
  - a `Template Family` dropdown
  - a `Reference Image URL` field
  - a `Prompt Preset` textarea

That would make product creation feel like "selecting a product template", but under the hood it still writes product metadata.
