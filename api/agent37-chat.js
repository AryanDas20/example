export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const apiKey = process.env.AGENT37_API_KEY;
  const instanceId = process.env.AGENT37_INSTANCE_ID;
  const configuredUrl = process.env.AGENT37_INSTANCE_URL;

  if (!apiKey || (!instanceId && !configuredUrl)) {
    return res.status(503).json({
      error: "The UniTrade AI assistant is not configured yet. Add AGENT37_API_KEY and AGENT37_INSTANCE_ID (or AGENT37_INSTANCE_URL) in Vercel project environment variables."
    });
  }

  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  const sessionId = typeof req.body?.session_id === "string" ? req.body.session_id : "";

  if (!message) return res.status(400).json({ error: "Please enter a message." });
  if (message.length > 2000) return res.status(413).json({ error: "Messages must be 2,000 characters or fewer." });
  if (sessionId.length > 128 || (sessionId && !/^[a-zA-Z0-9_-]+$/.test(sessionId))) {
    return res.status(400).json({ error: "Invalid conversation session." });
  }

  const baseUrl = (configuredUrl || `https://${instanceId}.agent37.app`).replace(/\/+$/, "");
  if (!/^https:\/\/[a-zA-Z0-9.-]+$/.test(baseUrl)) {
    return res.status(500).json({ error: "AGENT37_INSTANCE_URL must be a valid HTTPS instance origin." });
  }

  const uniTradeContext = [
    "You are UniTrade AI, a helpful campus circular-marketplace assistant for UniTrade.",
    "Help students understand marketplace listings, buying, selling, renting, borrowing, barter, looking-for requests, starter kits, fair-price estimates, lost-and-found, community, digital resources, safety, and how to use the website.",
    "Be concise, practical, welcoming, and honest. Never claim you can see live listings, user accounts, payment status, or private information unless the user provides it in this conversation.",
    "Do not invent available listings, prices, user identities, verified campuses, or transaction outcomes. Encourage users to verify item condition, ownership, prices, and handover arrangements in person.",
    "Do not ask for passwords, one-time codes, payment PINs, or sensitive financial information. Do not promise that a transaction is risk-free.",
    "If asked to perform an action on the website (such as publishing a listing), explain the steps; do not claim to have performed it.",
    "User message: "
  ].join(" ");

  const payload = { input: `${uniTradeContext}${message}` };
  if (sessionId) payload.session_id = sessionId;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);

  try {
    const upstream = await fetch(`${baseUrl}/v1/responses`, {
      method: "POST",
      headers: {
        "X-Agent37-Key": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      console.error("Agent37 upstream error:", upstream.status, data?.error?.code || data?.error || "unknown");
      return res.status(502).json({
        error: upstream.status === 401 || upstream.status === 403
          ? "Agent37 authentication or access was rejected. Check the API key and instance settings."
          : "Agent37 could not process the message. Check that the instance is running and the agent is ready."
      });
    }

    if (data.status === "failed") {
      console.error("Agent37 turn failed:", data.error?.code || "unknown");
      return res.status(502).json({ error: "The AI agent couldn't complete that response. Please try again." });
    }

    const reply = typeof data.output_text === "string" ? data.output_text.trim() : "";
    if (!reply) return res.status(502).json({ error: "The agent returned an empty response. Please try again." });

    return res.status(200).json({
      reply: reply.slice(0, 12000),
      session_id: typeof data.session_id === "string" ? data.session_id : sessionId || null
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      return res.status(504).json({ error: "The assistant took too long to respond. Please try again." });
    }
    console.error("Agent37 request failed:", error?.message || "unknown");
    return res.status(502).json({ error: "Could not connect to Agent37. Please try again later." });
  } finally {
    clearTimeout(timeout);
  }
}
