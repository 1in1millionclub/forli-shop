export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string
          country: string
          created_at: string
          id: number
          is_default: boolean
          name: string
          phone: string
          postal_code: string
          state: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city: string
          country: string
          created_at?: string
          id?: number
          is_default?: boolean
          name: string
          phone: string
          postal_code: string
          state: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string
          country?: string
          created_at?: string
          id?: number
          is_default?: boolean
          name?: string
          phone?: string
          postal_code?: string
          state?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          cart_id: string | null
          id: string
          quantity: number
          total_amount: number | null
          variant_id: string | null
        }
        Insert: {
          cart_id?: string | null
          id?: string
          quantity: number
          total_amount?: number | null
          variant_id?: string | null
        }
        Update: {
          cart_id?: string | null
          id?: string
          quantity?: number
          total_amount?: number | null
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      carts: {
        Row: {
          created_at: string | null
          id: string
          status: string | null
          total_quantity: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          status?: string | null
          total_quantity?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          status?: string | null
          total_quantity?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "carts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          description: string | null
          handle: string
          id: string
          name: string
          parent_id: string | null
          path: string | null
          seo_description: string | null
          seo_title: string | null
          updated_at: string | null
        }
        Insert: {
          description?: string | null
          handle: string
          id?: string
          name: string
          parent_id?: string | null
          path?: string | null
          seo_description?: string | null
          seo_title?: string | null
          updated_at?: string | null
        }
        Update: {
          description?: string | null
          handle?: string
          id?: string
          name?: string
          parent_id?: string | null
          path?: string | null
          seo_description?: string | null
          seo_title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_products: {
        Row: {
          collection_id: string
          id: string
          product_id: string
        }
        Insert: {
          collection_id: string
          id?: string
          product_id: string
        }
        Update: {
          collection_id?: string
          id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_products_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          description: string
          handle: string
          id: string
          image_alt_text: string
          image_url: string
          title: string
        }
        Insert: {
          description: string
          handle: string
          id?: string
          image_alt_text: string
          image_url: string
          title: string
        }
        Update: {
          description?: string
          handle?: string
          id?: string
          image_alt_text?: string
          image_url?: string
          title?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          discount_amount: number | null
          due_at: string | null
          id: string
          invoice_number: string
          issued_at: string | null
          order_id: string | null
          pdf_url: string | null
          status: string | null
          tax_amount: number | null
          total: number
        }
        Insert: {
          discount_amount?: number | null
          due_at?: string | null
          id?: string
          invoice_number: string
          issued_at?: string | null
          order_id?: string | null
          pdf_url?: string | null
          status?: string | null
          tax_amount?: number | null
          total: number
        }
        Update: {
          discount_amount?: number | null
          due_at?: string | null
          id?: string
          invoice_number?: string
          issued_at?: string | null
          order_id?: string | null
          pdf_url?: string | null
          status?: string | null
          tax_amount?: number | null
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoices_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string | null
          price: number
          quantity: number
          total_amount: number
          variant_id: string | null
        }
        Insert: {
          id?: string
          order_id?: string | null
          price: number
          quantity: number
          total_amount: number
          variant_id?: string | null
        }
        Update: {
          id?: string
          order_id?: string | null
          price?: number
          quantity?: number
          total_amount?: number
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address_id: number | null
          contact_email: string
          contact_phone: string
          created_at: string
          id: string
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          shipping_address: string
          shipping_address_id: number | null
          shipping_status: Database["public"]["Enums"]["shipping_status"] | null
          status: string
          total: number
          user_id: string | null
        }
        Insert: {
          billing_address_id?: number | null
          contact_email: string
          contact_phone: string
          created_at?: string
          id?: string
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          shipping_address: string
          shipping_address_id?: number | null
          shipping_status?:
            | Database["public"]["Enums"]["shipping_status"]
            | null
          status?: string
          total: number
          user_id?: string | null
        }
        Update: {
          billing_address_id?: number | null
          contact_email?: string
          contact_phone?: string
          created_at?: string
          id?: string
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          shipping_address?: string
          shipping_address_id?: number | null
          shipping_status?:
            | Database["public"]["Enums"]["shipping_status"]
            | null
          status?: string
          total?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_billing_address_id_fkey"
            columns: ["billing_address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_shipping_address_id_fkey"
            columns: ["shipping_address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt_text: string
          height: number
          id: string
          product_id: string
          thumbhash: string
          url: string
          width: number
        }
        Insert: {
          alt_text: string
          height: number
          id?: string
          product_id: string
          thumbhash: string
          url: string
          width: number
        }
        Update: {
          alt_text?: string
          height?: number
          id?: string
          product_id?: string
          thumbhash?: string
          url?: string
          width?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_option_values: {
        Row: {
          id: string
          option_id: string
          value: string
        }
        Insert: {
          id?: string
          option_id: string
          value: string
        }
        Update: {
          id?: string
          option_id?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_option_values_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "product_options"
            referencedColumns: ["id"]
          },
        ]
      }
      product_options: {
        Row: {
          id: string
          name: string
          product_id: string
        }
        Insert: {
          id?: string
          name: string
          product_id: string
        }
        Update: {
          id?: string
          name?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_options_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          available_for_sale: boolean
          currency_code: string
          id: string
          price: number
          product_id: string
          title: string
        }
        Insert: {
          available_for_sale?: boolean
          currency_code: string
          id?: string
          price: number
          product_id: string
          title: string
        }
        Update: {
          available_for_sale?: boolean
          currency_code?: string
          id?: string
          price?: number
          product_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          available_for_sale: boolean
          category_id: string
          created_at: string | null
          currency_code: string | null
          description: string
          description_html: string | null
          handle: string
          id: string
          product_type: string | null
          seo_description: string | null
          seo_title: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          available_for_sale?: boolean
          category_id: string
          created_at?: string | null
          currency_code?: string | null
          description: string
          description_html?: string | null
          handle: string
          id?: string
          product_type?: string | null
          seo_description?: string | null
          seo_title?: string | null
          title?: string
          updated_at?: string | null
        }
        Update: {
          available_for_sale?: boolean
          category_id?: string
          created_at?: string | null
          currency_code?: string | null
          description?: string
          description_html?: string | null
          handle?: string
          id?: string
          product_type?: string | null
          seo_description?: string | null
          seo_title?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          email: string | null
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["roles"]
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["roles"]
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["roles"]
          updated_at?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          id: string
          metadata: Json | null
          order_id: string
          payment_gateway: string | null
          payment_id: string | null
          payment_method: string | null
          razorpay_order_id: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          metadata?: Json | null
          order_id: string
          payment_gateway?: string | null
          payment_id?: string | null
          payment_method?: string | null
          razorpay_order_id?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          metadata?: Json | null
          order_id?: string
          payment_gateway?: string | null
          payment_id?: string | null
          payment_method?: string | null
          razorpay_order_id?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      variant_selected_options: {
        Row: {
          id: string
          name: string
          value: string
          variant_id: string | null
        }
        Insert: {
          id?: string
          name: string
          value: string
          variant_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          value?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "variant_selected_options_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      payment_method: "razorpay" | "cod"
      payment_status: "paid" | "pending" | "failed"
      roles: "admin" | "customer"
      shipping_status: "pending" | "shipped" | "delivered"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      payment_method: ["razorpay", "cod"],
      payment_status: ["paid", "pending", "failed"],
      roles: ["admin", "customer"],
      shipping_status: ["pending", "shipped", "delivered"],
    },
  },
} as const
