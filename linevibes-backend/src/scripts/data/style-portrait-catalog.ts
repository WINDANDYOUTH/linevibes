export type StylePortraitCollectionSeed = {
  title: string;
  handle: string;
  metadata: Record<string, unknown>;
};

export type StylePortraitOutputProductSeed = {
  title: string;
  handle: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  price: number;
  collectionHandle?: string;
  metadata: Record<string, unknown>;
};

export type StylePortraitTemplateProductSeed = {
  title: string;
  handle: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  templateGroup: "for-girls" | "for-boys" | "fantasy";
  templateFamily: string;
  templateId: string;
  sortOrder: number;
  badge?: string;
  collectionHandle: string;
  tags: string[];
  price: number;
  promptPreset: string;
  promptNotes?: string;
  negativePrompt?: string;
};

export const STYLE_PORTRAIT_COLLECTIONS: StylePortraitCollectionSeed[] = [
  {
    title: "Portrait Style Templates",
    handle: "portrait-style-templates",
    metadata: {
      type: "portrait-template-root",
      description: "Template-driven portrait products powered by one uploaded photo.",
    },
  },
  {
    title: "For Girls",
    handle: "for-girls",
    metadata: {
      type: "portrait-template-group",
      portrait_template_group: "for-girls",
    },
  },
  {
    title: "For Boys",
    handle: "for-boys",
    metadata: {
      type: "portrait-template-group",
      portrait_template_group: "for-boys",
    },
  },
  {
    title: "Fantasy Portraits",
    handle: "fantasy-portraits",
    metadata: {
      type: "portrait-template-group",
      portrait_template_group: "fantasy",
    },
  },
];

export const STYLE_PORTRAIT_TAGS = [
  "portrait-template",
  "template-group:for-girls",
  "template-group:for-boys",
  "template-group:fantasy",
  "template-family:princesses",
  "template-family:unicorn",
  "template-family:mermaid",
  "template-family:ballet",
  "template-family:adventure",
  "template-family:magic",
];

export const STYLE_PORTRAIT_OUTPUT_PRODUCTS: StylePortraitOutputProductSeed[] = [
  {
    title: "Portrait Digital",
    handle: "portrait-digital",
    subtitle: "Instant Download",
    description:
      "Fulfillment SKU used when a user buys the final digital version of a generated portrait.",
    imageUrl: "/images/line-portrait/portrait-after.png",
    price: 900,
    collectionHandle: "digital",
    metadata: {
      portrait_output_role: "digital",
      generator_type: "portrait-output",
    },
  },
  {
    title: "Portrait Print",
    handle: "portrait-print",
    subtitle: "Printed Portrait",
    description:
      "Fulfillment SKU used when a user buys a printed version of a generated portrait.",
    imageUrl: "/images/line-portrait/gallery-couple.png",
    price: 2900,
    collectionHandle: "printed",
    metadata: {
      portrait_output_role: "print",
      generator_type: "portrait-output",
    },
  },
  {
    title: "Portrait Canvas",
    handle: "portrait-canvas",
    subtitle: "Canvas Portrait",
    description:
      "Fulfillment SKU used when a user buys a canvas version of a generated portrait.",
    imageUrl: "/images/line-portrait/gallery-pet.png",
    price: 6900,
    collectionHandle: "canvas",
    metadata: {
      portrait_output_role: "canvas",
      generator_type: "portrait-output",
    },
  },
];

export const STYLE_PORTRAIT_TEMPLATE_PRODUCTS: StylePortraitTemplateProductSeed[] =
  [
    {
      title: "Magical Unicorn Princess",
      handle: "magical-unicorn-princess",
      subtitle: "Rainbow fantasy portrait template",
      description:
        "A soft storybook scene with a glowing unicorn, jeweled gown, rainbow sky, and castle lights.",
      imageUrl: "/images/style-templates/magical-unicorn-princess.svg",
      templateGroup: "for-girls",
      templateFamily: "princesses",
      templateId: "girls_princess_unicorn_01",
      sortOrder: 10,
      badge: "Best Seller",
      collectionHandle: "for-girls",
      tags: [
        "portrait-template",
        "template-group:for-girls",
        "template-family:princesses",
        "template-family:unicorn",
      ],
      price: 900,
      promptPreset:
        "Transform the uploaded child into a magical princess portrait beside a luminous unicorn. Keep the face recognizable while matching a pastel rainbow fantasy world, jeweled tiara, sparkling gown, cinematic dusk sky, and enchanted castle atmosphere.",
      promptNotes:
        "Keep the composition elegant and premium, with a single child subject and clear facial likeness.",
    },
    {
      title: "Ice Princess",
      handle: "ice-princess",
      subtitle: "Frozen palace portrait template",
      description:
        "Aurora skies, crystalline gown details, and a winter palace built for a regal portrait reveal.",
      imageUrl: "/images/style-templates/ice-princess.svg",
      templateGroup: "for-girls",
      templateFamily: "princesses",
      templateId: "girls_princess_ice_01",
      sortOrder: 20,
      collectionHandle: "for-girls",
      tags: [
        "portrait-template",
        "template-group:for-girls",
        "template-family:princesses",
        "template-family:magic",
      ],
      price: 900,
      promptPreset:
        "Create a child portrait as an ice princess in a luminous winter kingdom. Preserve the uploaded face and hairline while styling the subject in an icy blue gown, crystalline crown, snowy foreground, northern lights sky, and a glowing frozen palace.",
      promptNotes:
        "Use cool blue light, delicate snow sparkle effects, and a centered full-body composition.",
    },
    {
      title: "Mermaid Fantasy",
      handle: "mermaid-fantasy",
      subtitle: "Underwater portrait template",
      description:
        "A bright underwater world with coral shapes, shimmer rays, and a polished fantasy mermaid silhouette.",
      imageUrl: "/images/style-templates/mermaid-fantasy.svg",
      templateGroup: "for-girls",
      templateFamily: "mermaid",
      templateId: "girls_mermaid_fantasy_01",
      sortOrder: 30,
      badge: "New",
      collectionHandle: "for-girls",
      tags: [
        "portrait-template",
        "template-group:for-girls",
        "template-family:mermaid",
        "template-family:magic",
      ],
      price: 900,
      promptPreset:
        "Turn the uploaded child into a polished mermaid portrait in a vivid underwater fantasy scene. Preserve facial identity while giving the subject shimmering mermaid styling, flowing hair, coral foreground, fish, bubbles, and cinematic ocean light shafts.",
      promptNotes:
        "Keep the scene joyful and premium rather than cartoonish.",
    },
    {
      title: "Dream Ballerina",
      handle: "dream-ballerina",
      subtitle: "Soft ballet portrait template",
      description:
        "A pastel performance scene with a glowing tutu silhouette, warm stage haze, and dreamy portrait framing.",
      imageUrl: "/images/style-templates/dream-ballerina.svg",
      templateGroup: "for-girls",
      templateFamily: "ballet",
      templateId: "girls_ballet_dream_01",
      sortOrder: 40,
      collectionHandle: "for-girls",
      tags: [
        "portrait-template",
        "template-group:for-girls",
        "template-family:ballet",
      ],
      price: 900,
      promptPreset:
        "Create an elegant child ballerina portrait with the uploaded face preserved. Match a blush pink tutu, graceful ballet pose, warm spotlight halo, floating dust sparkle, and luxury storybook styling.",
      promptNotes:
        "Keep the anatomy natural and the expression gentle and bright.",
    },
    {
      title: "Fairy Garden Princess",
      handle: "fairy-garden-princess",
      subtitle: "Garden magic portrait template",
      description:
        "Floral arches, glowing particles, and fairy-tale garden light for a whimsical fantasy portrait.",
      imageUrl: "/images/style-templates/fairy-garden-princess.svg",
      templateGroup: "fantasy",
      templateFamily: "princesses",
      templateId: "fantasy_fairy_garden_01",
      sortOrder: 50,
      collectionHandle: "fantasy-portraits",
      tags: [
        "portrait-template",
        "template-group:fantasy",
        "template-family:princesses",
        "template-family:magic",
      ],
      price: 900,
      promptPreset:
        "Place the uploaded child into an enchanted garden portrait with floral archways, fairy glow particles, elegant fantasy dress styling, pastel sunset color, and cinematic magical realism.",
    },
    {
      title: "Celestial Spellcaster",
      handle: "celestial-spellcaster",
      subtitle: "Moonlit magic portrait template",
      description:
        "A moon-and-stars portrait with luminous magical circles, velvet night tones, and fantasy elegance.",
      imageUrl: "/images/style-templates/celestial-spellcaster.svg",
      templateGroup: "fantasy",
      templateFamily: "magic",
      templateId: "fantasy_celestial_magic_01",
      sortOrder: 60,
      badge: "Premium",
      collectionHandle: "fantasy-portraits",
      tags: [
        "portrait-template",
        "template-group:fantasy",
        "template-family:magic",
      ],
      price: 900,
      promptPreset:
        "Create a moonlit fantasy portrait of the uploaded child as a celestial spellcaster. Keep identity recognizable while adding luxury fantasy wardrobe, arcane light motifs, starry sky, crescent moon accents, and glowing magical atmosphere.",
      negativePrompt:
        "no horror, no dark curse elements, no second character, no text",
    },
    {
      title: "Dragon Rider Hero",
      handle: "dragon-rider-hero",
      subtitle: "Adventure portrait template",
      description:
        "A bold heroic scene with a dragon silhouette, mountain sky, and action-led fantasy framing.",
      imageUrl: "/images/style-templates/dragon-rider-hero.svg",
      templateGroup: "for-boys",
      templateFamily: "adventure",
      templateId: "boys_adventure_dragon_01",
      sortOrder: 70,
      collectionHandle: "for-boys",
      tags: [
        "portrait-template",
        "template-group:for-boys",
        "template-family:adventure",
        "template-family:magic",
      ],
      price: 900,
      promptPreset:
        "Transform the uploaded child into a fantasy adventure hero with a dragon-rider mood. Preserve facial likeness while adding heroic styling, dramatic sky, mountain landscape, warm embers, and premium cinematic fantasy lighting.",
      promptNotes:
        "Keep the mood exciting but kid-friendly and uplifting.",
    },
    {
      title: "Forest Explorer Hero",
      handle: "forest-explorer-hero",
      subtitle: "Storybook explorer portrait template",
      description:
        "A bright storybook scene with forest shapes, animal silhouettes, and a gentle explorer theme.",
      imageUrl: "/images/style-templates/forest-explorer-hero.svg",
      templateGroup: "for-boys",
      templateFamily: "adventure",
      templateId: "boys_forest_explorer_01",
      sortOrder: 80,
      collectionHandle: "for-boys",
      tags: [
        "portrait-template",
        "template-group:for-boys",
        "template-family:adventure",
      ],
      price: 900,
      promptPreset:
        "Create a polished storybook portrait of the uploaded child as a forest explorer. Preserve identity while styling the subject in a neat adventure outfit with warm woodland light, friendly animals, lush foliage, and premium illustrated realism.",
    },
  ];
