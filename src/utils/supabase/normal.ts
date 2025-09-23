
import { createClient } from "@supabase/supabase-js";
export const createNormalClient = () => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY_OR_ANON_KEY!
  );
};
