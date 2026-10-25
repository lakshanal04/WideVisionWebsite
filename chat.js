(function () {
  var root = document.querySelector("[data-chat]");
  if (!root) return;
  var endpoint = root.getAttribute("data-endpoint");
  var log = root.querySelector(".chat-log");
  var form = root.querySelector(".chat-form");
  var input = root.querySelector(".chat-input");
  var send = root.querySelector(".chat-send");
  var history = [];

  function add(role, text) {
    var p = document.createElement("p");
    p.className = "chat-msg chat-" + role;
    p.textContent = text;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
    return p;
  }

  add("assistant", "Hi! I can help you describe your project in VFX terms. What are you working on: a feature film, short film, or advertisement?");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var text = input.value.trim();
    if (!text) return;
    if (!endpoint) {
      add("assistant", "The chat assistant isn't connected yet. Please email us instead.");
      return;
    }
    add("user", text);
    history.push({ role: "user", text: text });
    input.value = "";
    send.disabled = true;
    var pending = add("assistant", "Thinking…");
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history })
    })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
      .then(function (res) {
        if (!res.ok || !res.data.reply) throw new Error(res.data.error || "Request failed");
        pending.textContent = res.data.reply;
        history.push({ role: "assistant", text: res.data.reply });
      })
      .catch(function () {
        pending.textContent = "Sorry, the assistant is unavailable right now (it may have reached its daily limit). Please try again later or email rekhamohan@widevisionvfxstudio.com directly.";
        history.pop();
      })
      .finally(function () {
        send.disabled = false;
        input.focus();
        log.scrollTop = log.scrollHeight;
      });
  });
})();
