export interface CatalogProduct {
  slug: string;
  name: string;
  image: string;
  hoverImage: string;
  description: string;
  sizes: string[];
  price: string;
}

export interface CatalogCategory {
  slug: string;
  name: string;
  displayTitle: string;
  description: string;
  headerImage: string;
  products: CatalogProduct[];
}

export const catalogCategories: CatalogCategory[] = [
  {
    slug: "vip",
    name: "VIP Series",
    displayTitle: "V I P \u00A0 S E R I E S",
    description:
      "Commanding presence for executive saloons and luxury SUVs. Designed for maximum visual impact, featuring intricate monoblock structures and elegant brushed finishes.",
    headerImage: "/catalog/catalog_1_black.png",
    products: [
      {
        slug: "drx-101",
        name: "DRX-101",
        image: "/catalog/vossen_1_angle.png",
        hoverImage: "/catalog/vossen_1_front.png",
        description:
          "A bold multi-spoke design engineered for maximum airflow and minimal unsprung mass. Each spoke is CNC-machined to a mirror edge.",
        sizes: ['20"', '21"', '22"', '23"'],
        price: "From $8,200",
      },
      {
        slug: "drx-102",
        name: "DRX-102",
        image: "/catalog/vossen_2_angle.png",
        hoverImage: "/catalog/vossen_2_front.png",
        description:
          "Deep concave profile with directional spokes designed for aggressive stance and superior brake cooling.",
        sizes: ['20"', '21"', '22"', '23"'],
        price: "From $8,800",
      },
      {
        slug: "drx-103",
        name: "DRX-103",
        image: "/catalog/vossen_3_angle.png",
        hoverImage: "/catalog/vossen_3_front.png",
        description:
          "Minimalist five-spoke geometry channelling pure racing heritage. Ultra-lightweight monoblock construction.",
        sizes: ['19"', '20"', '21"', '22"'],
        price: "From $7,600",
      },
      {
        slug: "drx-104",
        name: "DRX-104",
        image: "/catalog/vossen_1_angle.png",
        hoverImage: "/catalog/vossen_1_front.png",
        description:
          "Flowing twin-spoke design with brushed gunmetal finish. Engineered for GT-class vehicles.",
        sizes: ['20"', '21"', '22"'],
        price: "From $9,100",
      },
      {
        slug: "drx-105",
        name: "DRX-105",
        image: "/catalog/vossen_2_angle.png",
        hoverImage: "/catalog/vossen_2_front.png",
        description:
          "Multi-piece forged construction with polished lip and satin center. Bespoke colour matching available.",
        sizes: ['21"', '22"', '23"'],
        price: "From $10,400",
      },
      {
        slug: "drx-106",
        name: "DRX-106",
        image: "/catalog/vossen_3_angle.png",
        hoverImage: "/catalog/vossen_3_front.png",
        description:
          "Ultra-concave split-six spoke with integrated brake duct channels. Maximum presence on premium SUVs.",
        sizes: ['22"', '23"', '24"'],
        price: "From $11,200",
      },
    ],
  },
  {
    slug: "offroad",
    name: "Off-Road Series",
    displayTitle: "O F F - R O A D \u00A0 S E R I E S",
    description:
      "Engineered for the extremes. Reinforced load ratings and bead-lock capabilities meet rugged aesthetics. Built to withstand the harshest terrains without compromising on style.",
    headerImage: "/catalog/catalog_2_black.png",
    products: [
      {
        slug: "drx-201",
        name: "DRX-201",
        image: "/catalog/vossen_1_angle.png",
        hoverImage: "/catalog/vossen_1_front.png",
        description:
          "Reinforced eight-spoke bead-lock design rated for extreme off-road loads. Full trail-ready specification.",
        sizes: ['17"', '18"', '20"'],
        price: "From $6,800",
      },
      {
        slug: "drx-202",
        name: "DRX-202",
        image: "/catalog/vossen_2_angle.png",
        hoverImage: "/catalog/vossen_2_front.png",
        description:
          "Tactical mesh pattern with simulated bead-lock ring. MIL-spec corrosion-resistant coating.",
        sizes: ['17"', '18"', '20"'],
        price: "From $7,200",
      },
      {
        slug: "drx-203",
        name: "DRX-203",
        image: "/catalog/vossen_3_angle.png",
        hoverImage: "/catalog/vossen_3_front.png",
        description:
          "Heavy-duty split-five spoke with integrated tyre pressure sensor bosses. Built for overlanding.",
        sizes: ['17"', '18"', '20"'],
        price: "From $7,500",
      },
      {
        slug: "drx-204",
        name: "DRX-204",
        image: "/catalog/vossen_1_angle.png",
        hoverImage: "/catalog/vossen_1_front.png",
        description:
          "Competition-spec bead-lock wheel with replaceable wear ring. Rated for high-speed desert racing.",
        sizes: ['17"', '18"'],
        price: "From $8,400",
      },
      {
        slug: "drx-205",
        name: "DRX-205",
        image: "/catalog/vossen_2_angle.png",
        hoverImage: "/catalog/vossen_2_front.png",
        description:
          "Overland cruiser design with extra-wide barrel. Maximum payload capacity with understated aesthetics.",
        sizes: ['18"', '20"'],
        price: "From $7,800",
      },
      {
        slug: "drx-206",
        name: "DRX-206",
        image: "/catalog/vossen_3_angle.png",
        hoverImage: "/catalog/vossen_3_front.png",
        description:
          "Stealth flat-six spoke with ceramic blast finish. UV and salt-spray rated for coastal environments.",
        sizes: ['17"', '18"', '20"'],
        price: "From $6,900",
      },
    ],
  },
  {
    slug: "sport",
    name: "Sport Series",
    displayTitle: "S P O R T \u00A0 S E R I E S",
    description:
      "Performance driven. Focusing on weight reduction and brake cooling. These lightweight forged designs reduce unsprung mass for superior handling and track-ready dynamics.",
    headerImage: "/catalog/catalog_3_black.png",
    products: [
      {
        slug: "drx-301",
        name: "DRX-301",
        image: "/catalog/vossen_1_angle.png",
        hoverImage: "/catalog/vossen_1_front.png",
        description:
          "Track-focused monoblock with maximum brake caliper clearance. Carbon-ceramic compatible.",
        sizes: ['19"', '20"', '21"'],
        price: "From $9,200",
      },
      {
        slug: "drx-302",
        name: "DRX-302",
        image: "/catalog/vossen_2_angle.png",
        hoverImage: "/catalog/vossen_2_front.png",
        description:
          "Aero-blade spoke design with integrated air channels. Optimised CFD for brake cooling.",
        sizes: ['19"', '20"', '21"'],
        price: "From $9,800",
      },
      {
        slug: "drx-303",
        name: "DRX-303",
        image: "/catalog/vossen_3_angle.png",
        hoverImage: "/catalog/vossen_3_front.png",
        description:
          "Lightweight split-five with centre-lock option. Born on the Nürburgring.",
        sizes: ['19"', '20"'],
        price: "From $10,600",
      },
      {
        slug: "drx-304",
        name: "DRX-304",
        image: "/catalog/vossen_1_angle.png",
        hoverImage: "/catalog/vossen_1_front.png",
        description:
          "Directional fan-blade spoke with weight-optimised hub. Sub-8 kg per wheel in 19-inch.",
        sizes: ['19"', '20"', '21"'],
        price: "From $11,400",
      },
      {
        slug: "drx-305",
        name: "DRX-305",
        image: "/catalog/vossen_2_angle.png",
        hoverImage: "/catalog/vossen_2_front.png",
        description:
          "Hybrid carbon-forged construction. Inner barrel in woven carbon, outer lip in brushed titanium effect.",
        sizes: ['20"', '21"'],
        price: "From $12,800",
      },
      {
        slug: "drx-306",
        name: "DRX-306",
        image: "/catalog/vossen_3_angle.png",
        hoverImage: "/catalog/vossen_3_front.png",
        description:
          "Endurance-spec touring wheel with vibration-dampened core. Comfort and performance in balance.",
        sizes: ['19"', '20"', '21"', '22"'],
        price: "From $8,600",
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
