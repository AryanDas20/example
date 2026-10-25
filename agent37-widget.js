(() => {
  const launch = document.createElement("button");
  launch.className = "a37-launcher";
  launch.type = "button";
  launch.setAttribute("aria-haspopup", "dialog");
  launch.setAttribute("aria-expanded", "false");
  launch.innerHTML = '<span class="a37-launcher-mark" aria-hidden="true">✦</span><span>UniTrade AI</span>';

  const panel = document.createElement("section");
  panel.className = "a37-panel";
  panel.hidden = true;
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "UniTrade AI assistant");
  panel.innerHTML = `
    <header class="a37-head">
      <div class="a37-avatar" aria-hidden="true">U✦</div>
      <div class="a37-head-copy"><strong>UniTrade AI Assistant</strong><small>Campus marketplace guide · Agent37 Cloud</small></div>
      <button class="a37-close" type="button" aria-label="Close assistant">×</button>
    </header>
    <div class="a37-messages" role="log" aria-live="polite" aria-relevant="additions text">
      <div class="a37-msg assistant">Hi! I can help you navigate UniTrade, compare buying vs. renting, write a listing, understand safety tips, or explore campus exchange features. What would you like to do?</div>
    </div>
    <div class="a37-quick">
      <button type="button" data-prompt="How do I create a good listing?">Create a listing</button>
      <button type="button" data-prompt="How can I safely rent or borrow an item?">Rent safely</button>
      <button type="button" data-prompt="Explain UniTrade's main features.">Explore features</button>
    </div>
    <form class="a37-compose">
      <textarea class="a37-input" rows="1" maxlength="2000" aria-label="Message UniTrade AI" placeholder="Ask about campus trading…"></textarea>
      <button class="a37-send" type="submit" aria-label="Send message">↑</button>
    </form>
    <div class="a37-footnote">AI responses can be wrong. Verify listings, prices, identity, and handover details. Never share passwords or payment codes.</div>
  `;
  document.body.append(launch, panel);

  const messages = panel.querySelector(".a37-messages");
  const form = panel.querySelector("form");
  const input = panel.querySelector(".a37-input");
  const send = panel.querySelector(".a37-send");
  const close = panel.querySelector(".a37-close");
  const storageKey = "unitrade-agent37-session-v1";
  let sessionId = "";
  try {
    sessionId = localStorage.getItem(storageKey) || "";
  } catch (_) {}

  function setOpen(open) {
    panel.hidden = !open;
    launch.setAttribute("aria-expanded", String(open));
    if (open) input.focus();
  }
  launch.addEventListener("click", () => setOpen(panel.hidden));
  close.addEventListener("click", () => { setOpen(false); launch.focus(); });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !panel.hidden) setOpen(false);
  });

  function addMessage(text, who) {
    const node = document.createElement("div");
    node.className = `a37-msg ${who}`;
    node.textContent = text;
    messages.appendChild(node);
    messages.scrollTop = messages.scrollHeight;
    return node;
  }

  async function ask(question) {
    const text = String(question || "").trim();
    if (!text || send.disabled) return;
    addMessage(text, "user");
    input.value = "";
    input.style.height = "auto";
    send.disabled = true;
    const status = addMessage("Thinking…", "status");
    try {
      const response = await fetch("/api/agent37-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, session_id: sessionId || undefined })
      });
      const data = await response.json().catch(() => ({}));
      status.remove();
      if (!response.ok) throw new Error(data.error || "The assistant is temporarily unavailable.");
      if (data.session_id && data.session_id !== sessionId) {
        sessionId = data.session_id;
        try { localStorage.setItem(storageKey, sessionId); } catch (_) {}
      }
      addMessage(data.reply || "I didn't receive a response. Please try again.", "assistant");
    } catch (error) {
      status.remove();
      addMessage(error.message || "Couldn't reach the assistant. Please try again later.", "assistant");
    } finally {
      send.disabled = false;
      input.focus();
    }
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    ask(input.value);
  });
  input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 105) + "px";
  });
  input.addEventListener("keydown", event => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });
  panel.querySelectorAll("[data-prompt]").forEach(button => {
    button.addEventListener("click", () => ask(button.dataset.prompt));
  });
})();
