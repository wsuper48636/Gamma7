import { getSupabaseAdmin } from "./_lib/supabase.js";
import { BUCKET, DOCUMENT_SLOTS } from "./_lib/documents.js";

// Base64 adds ~33% overhead, and Vercel's default serverless request body
// limit is 4.5MB, so cap the raw file well below that.
const MAX_BYTES = 3 * 1024 * 1024;

async function ensureBucket(supabase) {
  const { error } = await supabase.storage.createBucket(BUCKET, { public: true });
  // Ignore "already exists" — every other failure is real.
  if (error && !/already exists/i.test(error.message || "")) {
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const expectedPassword = process.env.DOCUMENT_UPLOAD_PASSWORD;
  if (!expectedPassword) {
    console.error("DOCUMENT_UPLOAD_PASSWORD is not configured");
    return res.status(500).json({ error: "Uploads are not configured yet" });
  }

  const { password, key, contentType, fileBase64 } = req.body || {};

  if (password !== expectedPassword) {
    return res.status(401).json({ error: "Incorrect password" });
  }

  const slot = key && DOCUMENT_SLOTS[key];
  if (!slot) {
    return res.status(400).json({ error: "Unknown document" });
  }
  if (!fileBase64 || typeof fileBase64 !== "string") {
    return res.status(400).json({ error: "No file provided" });
  }

  let buffer;
  try {
    buffer = Buffer.from(fileBase64, "base64");
  } catch {
    return res.status(400).json({ error: "File could not be decoded" });
  }
  if (buffer.length === 0 || buffer.length > MAX_BYTES) {
    return res.status(400).json({ error: `File must be under ${MAX_BYTES / (1024 * 1024)}MB` });
  }

  try {
    const supabase = getSupabaseAdmin();
    await ensureBucket(supabase);

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(slot.path, buffer, {
        contentType: contentType || "application/octet-stream",
        upsert: true,
      });

    if (uploadError) {
      console.error("Document upload failed:", uploadError);
      return res.status(500).json({ error: "Upload failed" });
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(slot.path);
    return res.status(200).json({ success: true, url: data.publicUrl });
  } catch (err) {
    console.error("upload-document failed:", err);
    return res.status(500).json({ error: "Upload failed" });
  }
}
