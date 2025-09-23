import { createClient } from "../../utils/supabase/server";

export async function getUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (data) {
    return data.user;
  }
}
export async function fetchUserRole() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (data) {
    return data.user?.user_metadata.role;
  }
}
