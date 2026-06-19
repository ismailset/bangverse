import { Product, Review } from "./types";

export const PRODUCTS: Product[] = [
  {
    id: "ts-01",
    name: 'BongVerse Heavy "SHONALU" Tee',
    category: "T-Shirts",
    price: 1450,
    rating: 4.9,
    reviewsCount: 142,
    image: "/src/assets/images/tshirt_product_1781890263081.jpg",
    description: "A signature heavyweight 260GSM pre-shrunk cotton tee in washed black, featuring a subtle premium floral typography print on the chest representing the golden blossoms of Bangladesh.",
    tagline: "Washed Black • 260GSM • Premium Typography",
    details: [
      "100% Cotton, 260GSM Heavyweight Jersey",
      "Washed/faded wash treatment",
      "Oversized boxy streetwear drop-shoulder fit",
      "Water-based soft feel screen print",
      "Ribbed collar with reinforced back neck tape"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Washed Black", "Olive Green"]
  },
  {
    id: "sh-01",
    name: '"CHHAYANAUT" Utility Field Shirt',
    category: "Shirts",
    price: 1850,
    rating: 4.8,
    reviewsCount: 89,
    image: "/src/assets/images/shirt_product_1781890277927.jpg",
    description: "Our signature olive-drab utility field shirt. Features premium micro-sateen structured cotton, tailored dual-chest functional pockets, and drop shoulders for campus mobility and effortless style.",
    tagline: "Structured Linen-Cotton • Utility Pockets • Comfort Fit",
    details: [
      "80% Rich Cotton, 20% European Flax Linen",
      "Starch-softened heavy textured weave",
      "Dual tactical flap cargo pockets on breast",
      "Genuine horn-textured buttons",
      "Relaxed modern streetwear fit with curved hem"
    ],
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Olive Green", "Charcoal Gray", "Bone White"]
  },
  {
    id: "pt-01",
    name: '"BRUTALIST" Relaxed Cargo Pants',
    category: "Pants",
    price: 2200,
    rating: 4.9,
    reviewsCount: 112,
    image: "/src/assets/images/pants_product_1781890294101.jpg",
    description: "Architectural, loose-fitted sand-grey canvas utility cargo pants. Designed with heavy washed duck canvas, 6 oversized bellows pockets, and dynamic bottom tension cords.",
    tagline: "Stone Washed Canvas • 6-Pocket Utility • Cord Adjustment",
    details: [
      "100% Rugged Duck Canvas cotton fabric",
      "Taper-adjustable hem with durable toggle cords",
      "Structured gusseted knees for natural 3D silhouette",
      "Reinforced dual stitch seat and knees",
      "Classic metal zipper fly with customized rivet button"
    ],
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Stone Grey", "Washed Charcoal"]
  },
  {
    id: "hd-01",
    name: '"DUKHEE" Campus Oversized Hoodie',
    category: "Hoodies",
    price: 2600,
    rating: 5.0,
    reviewsCount: 205,
    image: "/src/assets/images/hoodie_product_1781890342297.jpg",
    description: "An ultra-heavyweight 400GSM french terry premium hoodie in washed charcoal. Embroidered with minimal high-density chest details celebrating the rebellious spirit of classical Bangladeshi art.",
    tagline: "400GSM French Terry • Rebellious Art Embroidery • Double Lined",
    details: [
      "100% Premium Cotton French Terry fabric (400GSM)",
      "Brushed interior thermal loft",
      "Seamless clean kangaroo pocket",
      "Rebellious high density silk thread embroidery on chest",
      "Heavy ribbed cuffs and waistband, double layer hood"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Charcoal Gray", "Midnight Blue"]
  }
];

export const CATEGORIES = [
  {
    id: "ts",
    name: "T-Shirts",
    image: "/src/assets/images/tshirt_product_1781890263081.jpg",
    tagline: "Dropped shoulders and heavy pre-shrunk fabrics. Made for the daily campus hustle.",
    count: "12 Designs"
  },
  {
    id: "sh",
    name: "Shirts",
    image: "/src/assets/images/shirt_product_1781890277927.jpg",
    tagline: "A convergence of heritage fabrics and utility engineering. Comfortable yet sharp.",
    count: "8 Designs"
  },
  {
    id: "pt",
    name: "Pants",
    image: "/src/assets/images/pants_product_1781890294101.jpg",
    tagline: "Structured volume and adjustable shapes. Redefining modern functional legwear.",
    count: "6 Designs"
  }
];

export const REVIEWS: Review[] = [
  {
    id: "rev-1",
    name: "Samiul Alam",
    role: "Computer Science, BRAC University",
    rating: 5,
    comment: "Absolutely obsessed with the 260GSM Shonalu tee. Finally, a Bangladeshi streetwear brand that understands heavy, boxy fits perfectly! It survived 10 hot washes and still looks flawless.",
    avatar: "https://picsum.photos/seed/samiul/100/100"
  },
  {
    id: "rev-2",
    name: "Nusrat Jahan",
    role: "Architecture Student, BUET",
    rating: 5,
    comment: "The Brutalist Cargos are a design marvel. The shape stays perfectly structured, and the sand grey canvas has that beautiful high-fashion drape. Best streetwear purchase I've made in Dhaka.",
    avatar: "https://picsum.photos/seed/nusrat/100/100"
  },
  {
    id: "rev-3",
    name: "Afridi Rahman",
    role: "BBA student, IBA, University of Dhaka",
    rating: 5,
    comment: "The 400GSM Dukhee hoodie is warm, ridiculously soft inside, and fits like a premium international brand. Love the subtle poetic embroidery on the chest. Full brand loyalty unlocked!",
    avatar: "https://picsum.photos/seed/afridi/100/100"
  },
  {
    id: "rev-4",
    name: "Tanzim Haque",
    role: "Media & Journalism student, ULAB",
    rating: 5,
    comment: "I used the AI Stylist on the site and got a recommendation for the Chhayanaut utility shirt with cargos. Delivery was made within 24 hours in Dhaka! Recommending to everyone at campus.",
    avatar: "https://picsum.photos/seed/tanzim/100/100"
  }
];

export const WHY_BONGVERSE = [
  {
    id: "wq-1",
    title: "Premium Quality",
    description: "Every item is crafted from high-density heavy textiles (260GSM on Tees, 400GSM on Hoodies) with premium sateen and combed cotton."
  },
  {
    id: "wq-2",
    title: "Designed for Students",
    description: "Relaxed cuts, modern utility pockets, and cultural details tailored specifically for active university lifestyles and peer events."
  },
  {
    id: "wq-3",
    title: "Fast Delivery",
    description: "Next-day shipping across Dhaka City, and rapid nationwide delivery to Chittagong, Sylhet, Rajshahi, and beyond within 48-72 hours."
  },
  {
    id: "wq-4",
    title: "Easy Returns",
    description: "Hassle-free 7-day size exchanges. Return or swap directly at campus dropoff points or via simple courier pickups."
  },
  {
    id: "wq-5",
    title: "Secure Payments",
    description: "Seamless cash on delivery, secure bKash, Nagad, Rocket, and SSLCommerz visa/mastercard payments with full confirmation."
  },
  {
    id: "wq-6",
    title: "Affordable Pricing",
    description: "Luxurious heavy-fabric streetwear at a price that fits student budgets, made locally with ethical sourcing and fair labor."
  }
];
