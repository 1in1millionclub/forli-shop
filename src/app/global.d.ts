import { Database as DB } from "@/lib/supabase/database.types";
declare global {
  type Database = DB;
  // type ForliDesigns = DB["public"]["Tables"]["forli.designs"]["Row"];
  // type Product = DB["public"]["Tables"]["products"]["Row"];
  // type ProductSize = DB["public"]["Tables"]["product_sizes"]["Row"];
  // type ProductImage = DB["public"]["Tables"]["product_images"]["Row"];
  // type Address = DB["public"]["Tables"]["addresses"]["Row"];
  // type Order = DB["public"]["Tables"]["orders"]["Row"];
  // type OrderItem = DB["public"]["Tables"]["order_items"]["Row"];
  // type Transaction = DB["public"]["Tables"]["transactions"]["Row"];
  // type Profile = DB["public"]["Tables"]["profiles"]["Row"];
  // type Json = DB["public"]["Functions"]["json"]["Returns"];
}
