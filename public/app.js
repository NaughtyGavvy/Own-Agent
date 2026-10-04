let conversation = [];

const chat = document.getElementById("chat");
const input = document.getElementById("message");
const send = document.getElementById("send");

input.addEventListener("keydown", function(event) {

  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }

});


function useSuggestion(text) {

  input.value = text;

  sendMessage();

}


function addMessage(role, text) {

  const welcome = document.getElementById("welcome");

  if (welcome) {
    welcome.remove();
  }

  const message = document.createElement("div");

  message.className = "message";

  const avatar = document.createElement("div");

  avatar.className =
    role === "user"
      ? "avatar user-avatar"
      : "avatar";

  avatar.textContent =
    role === "user"
      ? "U"
      : "✦";

  const content = document.createElement("div");

  content.className = "message-text";

  content.textContent = text;

  message.appendChild(avatar);
  message.appendChild(content);

  chat.appendChild(message);

  chat.scrollTop = chat.scrollHeight;
}


async function sendMessage() {

  const text = input.value.trim();

  if (!text) return;

  addMessage("user", text);

  conversation.push({
    role: "user",
    text: text
  });

  input.value = "";

  send.disabled = true;
  send.textContent = "...";

  try {

    const response = await fetch("/api/chat", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        message: text,
        history: conversation.slice(0, -1)
      })

    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "AI request failed");
    }

    addMessage("assistant", data.reply);

    conversation.push({
      role: "model",
      text: data.reply
    });

    addHistory(text);

  } catch (error) {

    addMessage(
      "assistant",
      "Connection error:\n" + error.message
    );

  }

  send.disabled = false;
  send.textContent = "➤";
}


function addHistory(text) {

  const box =
    document.getElementById("chatHistory");

  if (box.children.length > 0) return;

  const item =
    document.createElement("div");

  item.className = "history-item";

  item.textContent = text;

  box.appendChild(item);
}


function newChat() {

  conversation = [];

  chat.innerHTML = `
    <div id="welcome" class="welcome">

      <div class="welcome-icon">✦</div>

      <h1>How can I help you?</h1>

      <p>
        Ask NOVA anything. Build, learn, create and explore.
      </p>

    </div>
  `;

}
