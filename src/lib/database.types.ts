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
          checkout_url: string | null
          created_at: string | null
          id: string
          shipping_amount: number | null
          subtotal_amount: number | null
          total_amount: number | null
          total_quantity: number | null
          total_tax_amount: number | null
          updated_at: string | null
        }
        Insert: {
          checkout_url?: string | null
          created_at?: string | null
          id?: string
          shipping_amount?: number | null
          subtotal_amount?: number | null
          total_amount?: number | null
          total_quantity?: number | null
          total_tax_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          checkout_url?: string | null
          created_at?: string | null
          id?: string
          shipping_amount?: number | null
          subtotal_amount?: number | null
          total_amount?: number | null
          total_quantity?: number | null
          total_tax_amount?: number | null
          updated_at?: string | null
        }
        Relationships: []
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
      upsert_cart_item: {
        Args: { p_cart_id: string; p_quantity: number; p_variant_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
