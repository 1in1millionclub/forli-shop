import { Database as DB } from "@/lib/database.types";
declare global {
  type Database = DB;
  type SupabaseCartItem = DB["public"]["Tables"]["cart_items"]["Row"];
  type SupabaseCart = DB["public"]["Tables"]["carts"]["Row"];
  type SupabaseCategory = DB["public"]["Tables"]["categories"]["Row"];
  type SupabaseCollectionProduct =
    DB["public"]["Tables"]["collection_products"]["Row"];
  type SupabaseCollection = DB["public"]["Tables"]["collections"]["Row"];
  type SupabaseProductImage = DB["public"]["Tables"]["product_images"]["Row"];
  type SupabaseProductOptionValue =
    DB["public"]["Tables"]["product_option_values"]["Row"];
  type SupabaseProductOption = DB["public"]["Tables"]["product_options"]["Row"];
  type SupabaseProductVariant =
    DB["public"]["Tables"]["product_variants"]["Row"];
  type SupabaseProduct = DB["public"]["Tables"]["products"]["Row"];
  type SupabaseVariantSelectedOption =
    DB["public"]["Tables"]["variant_selected_options"]["Row"];
  type Address = DB["public"]["Tables"]["addresses"]["Row"];
}
