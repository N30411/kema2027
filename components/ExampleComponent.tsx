import { getSupabaseClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import React from "react";

export default function ExampleComponent() {
  const router = useRouter();
  React.useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      router.replace("/login");
      return;
    }
    // ...other code here...
  }, [router]);

  return <div>Example Component</div>;
}
