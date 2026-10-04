```javascript
let conversation = [];

const chat = document.getElementById("chat");
const input = document.getElementById("message");
const send = document.getElementById("send");


// ===============================
// ENTER = SEND
// ===============================

input.addEventListener("keydown", function (event) {

  if (event.key === "Enter" && !event.shiftKey) {

    event.preventDefault();

    sendMessage();

  }

});


// ===============================
// SUGGESTION BUTTON
// ===============================

function useSuggestion(text) {

  input.value = text;

  sendMessage();

}


// ===============================
// ADD MESSAGE TO CHAT
// ===============================

function addMessage(role, text) {

  const welcome =
    document.getElementById("welcome");

  if (welcome) {
    welcome.remove();
  }


  const message =
    document.createElement("div");

  message.className = "message";


  const avatar =
    document.createElement("div");

  avatar.className =
    role === "user"
      ? "avatar user-avatar"
      : "avatar";

  avatar.textContent =
    role === "user"
      ? "U"
      : "✦";


  const content =
    document.createElement("div");

  content.className =
    "message-text";

  content.textContent =
    text;


  message.appendChild(avatar);

  message.appendChild(content);

  chat.appendChild(message);


  chat.scrollTop =
    chat.scrollHeight;

}


// ===============================
// SHOW LOADING MESSAGE
// ===============================

function showLoading() {

  const message =
    document.createElement("div");

  message.id =
    "nova-loading";

  message.className =
    "message";


  const avatar =
    document.createElement("div");

  avatar.className =
    "avatar";

  avatar.textContent =
    "✦";


  const content =
    document.createElement("div");

  content.className =
    "message-text";

  content.textContent =
    "NOVA is thinking...";


  message.appendChild(avatar);

  message.appendChild(content);

  chat.appendChild(message);


  chat.scrollTop =
    chat.scrollHeight;

}


// ===============================
// REMOVE LOADING
// ===============================

function removeLoading() {

  const loading =
    document.getElementById(
      "nova-loading"
    );

  if (loading) {
    loading.remove();
  }

}


// ===============================
// SEND MESSAGE TO NETLIFY
// ===============================

async function sendMessage() {

  const text =
    input.value.trim();


  if (!text) {
    return;
  }


  // Show user message
  addMessage(
    "user",
    text
  );


  // Save user message
  conversation.push({

    role: "user",

    text: text

  });


  // Clear input
  input.value = "";


  // Disable send button
  send.disabled = true;

  send.textContent =
    "•••";


  // Show loading
  showLoading();


  try {

    const response =
      await fetch(
        "/.netlify/functions/chat",
        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json"

          },

          body: JSON.stringify({

            message: text,

            history:
              conversation.slice(0, -1)

          })

        }
      );


    const data =
      await response.json();


    // Remove loading
    removeLoading();


    // Check server response
    if (!response.ok) {

      throw new Error(
        data.error ||
        "AI request failed"
      );

    }


    // Get AI response
    const reply =
      data.reply ||
      "I didn't receive a response.";


    // Show AI response
    addMessage(
      "assistant",
      reply
    );


    // Save AI response
    conversation.push({

      role: "model",

      text: reply

    });


    // Add conversation to sidebar
    addHistory(text);


  } catch (error) {

    console.error(
      "NOVA ERROR:",
      error
    );


    removeLoading();


    addMessage(

      "assistant",

      "Sorry, NOVA could not connect.\n\n" +
      error.message

    );

  }


  // Enable send button
  send.disabled = false;

  send.textContent =
    "➤";

}


// ===============================
// CHAT HISTORY
// ===============================

function addHistory(text) {

  const box =
    document.getElementById(
      "chatHistory"
    );


  if (!box) {
    return;
  }


  // Only add first message
  // for this conversation
  if (box.children.length > 0) {
    return;
  }


  const item =
    document.createElement("div");


  item.className =
    "history-item";


  item.textContent =
    text;


  item.title =
    text;


  box.appendChild(item);

}


// ===============================
// NEW CHAT
// ===============================

function newChat() {

  conversation = [];


  chat.innerHTML = `

    <div
      id="welcome"
      class="welcome"
    >

      <div class="welcome-icon">
        ✦
      </div>

      <h1>
        How can I help you?
      </h1>

      <p>
        Ask NOVA anything.
        Build, learn, create and explore.
      </p>

      <div class="suggestions">

        <button
          onclick="useSuggestion('Build me a website')"
        >
          🌐 Build a website
        </button>

        <button
          onclick="useSuggestion('Explain artificial intelligence simply')"
        >
          🧠 Explain AI
        </button>

        <button
          onclick="useSuggestion('Help me write a JavaScript program')"
        >
          💻 Write code
        </button>

        <button
          onclick="useSuggestion('Give me a business idea')"
        >
          💡 Give me an idea
        </button>

      </div>

    </div>

  `;


  input.focus();

}


// ===============================
// AUTO FOCUS INPUT
// ===============================

window.addEventListener(
  "load",
  function () {

    input.focus();

  }
);
```
