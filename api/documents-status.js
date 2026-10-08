import { getSupabaseAdmin } from "./_lib/supabase.js";
import { BUCKET, DOCUMENT_SLOTS } from "./_lib/documents.js";

// Returns { [slotKey]: boolean } for every known document slot in one
// request, so a page can grey out/highlight many links without making
// one HTTP call per document.
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch (err) {
    console.error("documents-status failed:", err);
    return res.status(500).json({ error: "Document storage is not configured" });
  }

  const { data: listing, error: listError } = await supabase.storage
    .from(BUCKET)
    .list("", { limit: 1000 });

  if (listError) {
    console.error("Failed to list documents bucket:", listError);
    return res.status(500).json({ error: "Could not check documents" });
  }

  const uploadedPaths = new Set((listing || []).map((f) => f.name));
  const status = {};
  for (const [key, slot] of Object.entries(DOCUMENT_SLOTS)) {
    status[key] = uploadedPaths.has(slot.path);
  }

  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json({ status });
}
