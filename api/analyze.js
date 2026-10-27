export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: "AI scanning is not configured yet. Deploy on Vercel and add OPENAI_API_KEY in Project Settings → Environment Variables." });
    const { image, meal = "Meal" } = req.body || {};
    if (typeof image !== "string" || !/^data:image\/(jpeg|jpg|png|webp);base64,/i.test(image)) return res.status(400).json({ error: "Please choose a JPG, PNG or WEBP photo." });
    if (image.length > 11_000_000) return res.status(413).json({ error: "Image is too large. Please choose a photo under 8 MB." });
    const prompt = `Estimate the food and edible portion sizes visible in this ${String(meal).slice(0, 30)} photo. Include Indian dishes when present. Return ONLY JSON with schema {"items":[{"name":"food","portion":"estimate","calories":0,"protein":0,"carbs":0,"fat":0}],"note":"uncertainty note"}. One item per visible food; numbers must be nonnegative. If food is unclear, return items: []. Do not pretend this is exact: ingredients, oil and serving sizes may be hidden.`;
    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Authorization": "Bearer " + process.env.OPENAI_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ model: process.env.OPENAI_VISION_MODEL || "gpt-5.6", input: [{ role: "user", content: [{ type: "input_text", text: prompt }, { type: "input_image", image_url: image, detail: "high" }] }], max_output_tokens: 800 })
    });
    const result = await upstream.json();
    if (!upstream.ok) return res.status(502).json({ error: result.error?.message || "The AI service could not analyse the photo." });
    const text = (result.output || []).flatMap(part => part.content || []).filter(part => part.type === "output_text").map(part => part.text).join("\n");
    const parsed = JSON.parse(text.replace(/^\s*```(?:json)?/i, "").replace(/```\s*$/, "").trim());
    const items = (parsed.items || []).filter(x => x && typeof x.name === "string").slice(0, 12).map(x => ({
      name: x.name.slice(0, 80), portion: String(x.portion || "Estimated portion").slice(0, 80),
      calories: Math.max(0, Number(x.calories) || 0), protein: Math.max(0, Number(x.protein) || 0),
      carbs: Math.max(0, Number(x.carbs) || 0), fat: Math.max(0, Number(x.fat) || 0)
    }));
    return res.status(200).json({ items, note: String(parsed.note || "Nutrition values are estimates. Adjust ingredients and portions to improve accuracy.").slice(0, 240) });
  } catch {
    return res.status(500).json({ error: "Could not read the AI result. Please try another photo." });
  }
}
