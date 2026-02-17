export interface CatalogProduct {
  slug: string;
  name: string;
  image: string;
  hoverImage: string;
  description: string;
  sizes: string[];
}

export interface CatalogCategory {
  slug: string;
  name: string;
  description: string;
  products: CatalogProduct[];
}

const IMG = "/catalog/Vossen_1_angle.png";
const IMG_HOVER = "/catalog/vossen_1_front.png";

export const catalogCategories: CatalogCategory[] = [
  {
    slug: "forged-series",
    name: "Forged Series",
    description:
      "Precision-forged from aerospace-grade 6061-T6 aluminium under 8,000 tonnes of hydraulic pressure. Every spoke is CNC-finished to sub-micron tolerances.",
    products: [
      {
        slug: "drx-101",
        name: "DRX-101",
        image: IMG,
        hoverImage: IMG_HOVER,
        description:
          "A bold multi-spoke design engineered for maximum airflow and minimal unsprung mass. Each spoke is CNC-machined to a mirror edge, reflecting light with liquid precision.",
        sizes: ['20"', '21"', '22"', '23"'],
      },
      {
        slug: "drx-102",
        name: "DRX-102",
        image: IMG,
        hoverImage: IMG_HOVER,
        description:
          "Deep concave profile with directional spokes designed for aggressive stance and superior brake cooling. Forged from a single 6061-T6 billet.",
        sizes: ['20"', '21"', '22"', '23"'],
      },
      {
        slug: "drx-103",
        name: "DRX-103",
        image: IMG,
        hoverImage: IMG_HOVER,
        description:
          "Minimalist five-spoke geometry channelling pure racing heritage. Ultra-lightweight monoblock construction delivers instant throttle response.",
        sizes: ['19"', '20"', '21"', '22"'],
      },
    ],
  },
  {
    slug: "carbon-series",
    name: "Carbon Series",
    description:
      "Carbon-fibre-reinforced forged wheels — unrivalled strength at half the weight. Aerospace-derived layup technology for the ultimate in performance.",
    products: [
      {
        slug: "drx-201",
        name: "DRX-201",
        image: IMG,
        hoverImage: IMG_HOVER,
        description:
          "Full carbon-fibre barrel paired with forged aluminium spokes. Aerospace-grade layup delivers 40% weight savings over fully forged equivalents.",
        sizes: ['20"', '21"', '22"'],
      },
      {
        slug: "drx-202",
        name: "DRX-202",
        image: IMG,
        hoverImage: IMG_HOVER,
        description:
          "Exposed carbon weave face with diamond-cut lip — a statement piece merging motorsport engineering with bespoke craftsmanship and undeniable presence.",
        sizes: ['20"', '21"', '22"', '23"'],
      },
      {
        slug: "drx-203",
        name: "DRX-203",
        image: IMG,
        hoverImage: IMG_HOVER,
        description:
          "Track-focused monoblock with carbon-ceramic-compatible clearances. Born on the Nürburgring, refined for the boulevard. Uncompromising in every dimension.",
        sizes: ['19"', '20"', '21"'],
      },
    ],
  },
  {
    slug: "heritage",
    name: "Heritage",
    description:
      "Timeless designs remastered with modern forging technology. Classic silhouettes, contemporary performance, enduring elegance.",
    products: [
      {
        slug: "drx-301",
        name: "DRX-301",
        image: IMG,
        hoverImage: IMG_HOVER,
        description:
          "Classic mesh pattern reimagined through computational design. Each intersection is stress-optimised for the loads demanded by modern supercars.",
        sizes: ['19"', '20"', '21"', '22"'],
      },
      {
        slug: "drx-302",
        name: "DRX-302",
        image: IMG,
        hoverImage: IMG_HOVER,
        description:
          "Vintage five-hole rally design precision-machined from 6061-T6 billet. Heritage aesthetics paired with contemporary engineering standards.",
        sizes: ['18"', '19"', '20"', '21"'],
      },
      {
        slug: "drx-303",
        name: "DRX-303",
        image: IMG,
        hoverImage: IMG_HOVER,
        description:
          "Art-Deco-inspired fan-spoke pattern with hand-brushed satin finish. A collector\u2019s wheel for the true automotive connoisseur.",
        sizes: ['20"', '21"', '22"', '23"'],
      },
    ],
  },
];

export function getCategoryBySlug(
  slug: string
): CatalogCategory | undefined {
  return catalogCategories.find((c) => c.slug === slug);
}

export function getProductBySlug(
  categorySlug: string,
  productSlug: string
): { product: CatalogProduct; category: CatalogCategory } | undefined {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return undefined;
  const product = category.products.find((p) => p.slug === productSlug);
  if (!product) return undefined;
  return { product, category };
}
