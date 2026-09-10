import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const TOKEN = "b8f4c2a1-import-9d3e-7a6f-2c5b1e8d4a70";

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

  const { data, error } = await supabase.rpc("import_advisors_bulk", { rows });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response(JSON.stringify({ inserted: data }), {
    headers: { "Content-Type": "application/json" },
  });
});
