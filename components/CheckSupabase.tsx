import { getSupabaseClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export async function checkSupabaseAndRedirect() {
  const router = useRouter();
  const supabase = getSupabaseClient();
  if (!supabase) {
    router.replace("/login");
    return;
  }
  const session = supabase.auth.getSession ? (await supabase.auth.getSession()).data.session : null;
  if (!session) {
    router.replace("/login");
    return;
  }
  // ...other logic...
}
