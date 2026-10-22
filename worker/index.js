const MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const MAX_MESSAGES = 30;
const MAX_CHARS = 2000;

const SYSTEM_PROMPT = `You are the project intake assistant for WideVision VFX Studio (Chennai and Coimbatore, India), which creates visual effects for movies, short films, and advertising films.
Help visitors describe what they need in precise VFX terminology so the studio understands exactly what they want.
- Ask ONE or TWO short questions at a time. Be friendly and concise. Explain jargon briefly in plain language.
- Gather: project type (feature, short, ad); sequence/shot count and duration; VFX needs (compositing, rotoscoping, paint/cleanup, wire/rig removal, keying, matchmoving/tracking, CG/3D, FX simulations, set extension, digital matte painting, color/finishing); footage status (shot or not, camera, resolution, format, frame rate); reference material; style/look; deadline; budget range; delivery specs; contact name.
- Check ambiguity: if a request is vague (e.g. "make it look cool"), offer concrete options to choose from.
- Never promise prices, timelines, or availability. The studio will follow up.
- When you have enough, output a "Project Brief" in a clear bulleted format with open questions listed, and tell the user to copy it and email it to rekhamohan@widevisionvfxstudio.com.
- Stay on topic; politely decline unrelated requests.`;

function cors(origin, env) {
  const allowed = (env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim());
  const ok = allowed.includes(origin);
  return {
    "Access-Control-Allow-Origin": ok ? origin : allowed[0] || "",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const headers = { ...cors(origin, env), "Content-Type": "application/json" };
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (request.method !== "POST") return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers });
    if (headers["Access-Control-Allow-Origin"] !== origin) {
      return new Response(JSON.stringify({ error: "Origin not allowed" }), { status: 403, headers });
    }

    let messages;
    try {
      ({ messages } = await request.json());
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers });
    }
    if (!Array.isArray(messages) || !messages.length || messages.length > MAX_MESSAGES) {
      return new Response(JSON.stringify({ error: "Invalid conversation" }), { status: 400, headers });
    }
    const input = [];
    for (const m of messages) {
      if (!["user", "assistant"].includes(m?.role) || typeof m.text !== "string" || m.text.length > MAX_CHARS) {
        return new Response(JSON.stringify({ error: "Invalid message" }), { status: 400, headers });
      }
      input.push({ role: m.role, content: m.text });
    }

    let reply = "";
    try {
      const result = await env.AI.run(MODEL, {
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...input],
        max_tokens: 1024,
        temperature: 0.6,
      });
      reply = result.response || "";
    } catch {
      return new Response(JSON.stringify({ error: "The assistant is unavailable right now." }), { status: 502, headers });
    }
    return new Response(JSON.stringify({ reply }), { headers });
  },
};
