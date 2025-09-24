import { Collection } from "./ecommerce/types-sample";
import { NavItem } from "./types";

export const collections: Collection[] = [
  {
    handle: "summer-essentials",
    title: "Summer Essentials",
    description: "Everything you need for the perfect summer.",
    seo: {
      title: "Shop Summer Essentials",
      description: "Browse our curated summer essentials collection.",
    },
    parentCategoryTree: [{ id: "cat1", name: "Seasonal" }],
    updatedAt: "2025-09-01T12:00:00Z",
    path: "/collections/summer-essentials",
  },
  {
    handle: "new-arrivals",
    title: "New Arrivals",
    description: "Discover the latest products in our shop.",
    seo: {
      title: "New Arrivals",
      description: "Check out what's new in store.",
    },
    parentCategoryTree: [{ id: "cat2", name: "Featured" }],
    updatedAt: "2025-09-15T09:30:00Z",
    path: "/collections/new-arrivals",
  },
  {
    handle: "sale",
    title: "Sale",
    description: "Grab these deals before they're gone!",
    seo: {
      title: "Sale Collection",
      description: "Shop discounted products.",
    },
    parentCategoryTree: [{ id: "cat3", name: "Promotions" }],
    updatedAt: "2025-09-20T16:45:00Z",
    path: "/collections/sale",
  },
];

export const TAGS = {
  mode: "mode",
  collections: "collections",
  products: "products",
  collectionProducts: "collection-products",
  cart: "cart",
};

export const CONTACT_LINKS: NavItem[] = [
  {
    label: "37°47'33.4\"N 122°24'18.6\"W",
    href: "https://maps.app.goo.gl/MnpbPDEHxoDydc9M9",
  },
  {
    label: "(269) 682-1402",
    href: "https://joyco.studio/showcase",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/joyco.studio/",
  },
];

export const HIDDEN_PRODUCT_TAG = "nextjs-frontend-hidden";
export const DEFAULT_OPTION = "Default Title";

export const isDevelopment = process.env.NODE_ENV === "development";

// Internal color mapping for common color names to hex values
export const COLOR_MAP: Record<string, string> = {
  // Basic colors
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#22c55e",
  yellow: "#eab308",
  orange: "#f97316",
  purple: "#a855f7",
  pink: "#ec4899",
  black: "#000000",
  white: "#ffffff",
  gray: "#6b7280",
  grey: "#6b7280",
  brown: "#92400e",
  navy: "#1e3a8a",
  teal: "#14b8a6",
  cyan: "#06b6d4",
  indigo: "#6366f1",
  violet: "#8b5cf6",
  lime: "#84cc16",
  emerald: "#10b981",
  rose: "#f43f5e",
  fuchsia: "#d946ef",
  slate: "#64748b",
  neutral: "#737373",
  stone: "#78716c",
  zinc: "#71717a",

  // Additional common variations
  "light-blue": "#38bdf8",
  "dark-blue": "#1e40af",
  "light-green": "#4ade80",
  "dark-green": "#232E23",
  "light-gray": "#d1d5db",
  "dark-gray": "#374151",
  "light-grey": "#d1d5db",
  "dark-grey": "#374151",
  "dark-brown": "#6b4a1b",
  beige: "#f5f5dc",
  maroon: "#800000",
  olive: "#808000",
  aqua: "#00ffff",
  silver: "#c0c0c0",
  gold: "#ffd700",
  coral: "#ff7f50",
  salmon: "#fa8072",
  khaki: "#f0e68c",
  sand: "#e7d3b7",
  plum: "#dda0dd",
  tan: "#d2b48c",
  crimson: "#dc143c",
  turquoise: "#40e0d0",
  lavender: "#e6e6fa",
  ivory: "#fffff0",
  mint: "#98fb98",
  peach: "#ffcba4",
  pistachio: "#93c572",
  cream: "#edd0ae",
  "army-green": "#4b5320",
  "navy-blue": "#000080",
  wood: "#8d6e63",
};
