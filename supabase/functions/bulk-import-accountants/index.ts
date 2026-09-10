import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const TOKEN = "a1c7e5d2-acct-4f90-b3e6-77c1d9a2f451";

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  if (req.headers.get("x-import-token") !== TOKEN) {
    return new Response("Unauthorized", { status: 401 });
  }

  const rows = await req.json();
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data, error } = await supabase
    .from("accountants")
    .upsert(rows, { onConflict: "slug", ignoreDuplicates: true })
    .select("id");

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response(JSON.stringify({ inserted: data?.length ?? 0 }), {
    headers: { "Content-Type": "application/json" },
  });
});
