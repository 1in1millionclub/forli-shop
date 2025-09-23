import { Collection } from "./supabase/types-sample";
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

export const TAGS = {
  mode: "mode",
  collections: "collections",
  products: "products",
  collectionProducts: "collection-products",
  cart: "cart",
};
