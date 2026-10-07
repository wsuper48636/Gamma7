import { getSupabaseAdmin } from "./_lib/supabase.js";
import { BUCKET, DOCUMENT_SLOTS } from "./_lib/documents.js";

// Public-facing redirect: /api/document?key=complete-research-summary
// Looks up whether that fixed-path file has actually been uploaded yet
// and, if so, redirects to it. Keeps the real storage URL (which depends
// on the Supabase project) out of the static HTML entirely.
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const key = req.query && req.query.key;
  const slot = key && DOCUMENT_SLOTS[key];
  if (!slot) {
    return res.status(404).json({ error: "Unknown document" });
  }

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch (err) {
    console.error("document lookup failed:", err);
    return res.status(500).json({ error: "Document storage is not configured" });
  }

  const { data: listing, error: listError } = await supabase.storage
    .from(BUCKET)
    .list("", { search: slot.path });

  if (listError) {
    console.error("Failed to check document existence:", listError);
    return res.status(500).json({ error: "Could not check document" });
  }

  const exists = Array.isArray(listing) && listing.some((f) => f.name === slot.path);
  if (!exists) {
    return res
      .status(404)
      .send(`"${slot.label}" hasn't been uploaded yet. Upload it at /upload-documents.`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(slot.path);
  res.writeHead(302, { Location: data.publicUrl });
  res.end();
}
