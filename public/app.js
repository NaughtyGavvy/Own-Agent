```javascript
// ==========================================
// NOVA AI - NETLIFY FRONTEND
// ==========================================

let conversation = [];

const chat = document.getElementById("chat");
const input = document.getElementById("message");
const send = document.getElementById("send");


// ==========================================
// ENTER KEY
// ==========================================

if (input) {

  input.addEventListener("keydown", function (event) {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      sendMessage();

    }

  });

}


// ==========================================
// SUGGESTION BUTTON
// ==========================================

function useSuggestion(text) {

  if (!input) {
    return;
  }

  input.value = text;

  sendMessage();

}


// ==========================================
// ADD MESSAGE
// ==========================================

function addMessage(role, text) {

  if (!chat) {
    return;
  }


  // Remove welcome screen
  const welcome =
    document.getElementById("welcome");

  if (welcome) {
    welcome.remove();
  }


  const message =
    document.createElement("div");

  message.className = "message";


  // Avatar
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


  // Message content
  const content =
    document.createElement("div");

  content.className =
    "message-text";

  content.textContent =
    text;


  message.appendChild(avatar);

  message.appendChild(content);

  chat.appendChild(message);


  // Scroll to bottom
  chat.scrollTop =
    chat.scrollHeight;

}


// ==========================================
// LOADING MESSAGE
// ==========================================

function showLoading() {

  if (!chat) {
    return;
  }


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


// ==========================================
// REMOVE LOADING
// ==========================================

function removeLoading() {

  const loading =
    document.getElementById(
      "nova-loading"
    );

  if (loading) {

    loading.remove();

  }

}


// ==========================================
// SEND MESSAGE
// ==========================================

async function sendMessage() {

  if (!input || !send) {
    return;
  }


  const text =
    input.value.trim();


  if (!text) {
    return;
  }


  // ----------------------------------------
  // SHOW USER MESSAGE
  // ----------------------------------------

  addMessage(
    "user",
    text
  );


  // ----------------------------------------
  // SAVE USER MESSAGE
  // ----------------------------------------

  conversation.push({

    role: "user",

    text: text

  });


  // ----------------------------------------
  // CLEAR INPUT
  // ----------------------------------------

  input.value = "";


  // ----------------------------------------
  // DISABLE BUTTON
  // ----------------------------------------

  send.disabled = true;

  send.textContent =
    "•••";


  // ----------------------------------------
  // SHOW LOADING
  // ----------------------------------------

  showLoading();


  try {

    console.log(
      "Connecting to NOVA Netlify Function..."
    );


    // ======================================
    // NETLIFY FUNCTION
    // ======================================

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


    console.log(
      "Netlify response:",
      response.status
    );


    // ======================================
    // GET RESPONSE
    // ======================================

    const data =
      await response.json();


    console.log(
      "NOVA response:",
      data
    );


    // Remove loading
    removeLoading();


    // ======================================
    // ERROR CHECK
    // ======================================

    if (!response.ok) {

      throw new Error(

        data.error ||
        data.details ||
        "Netlify AI request failed"

      );

    }


    // ======================================
    // AI REPLY
    // ======================================

    const reply =
      data.reply;


    if (!reply) {

      throw new Error(
        "NOVA returned an empty response."
      );

    }


    // ======================================
    // DISPLAY AI RESPONSE
    // ======================================

    addMessage(
      "assistant",
      reply
    );


    // ======================================
    // SAVE AI RESPONSE
    // ======================================

    conversation.push({

      role: "model",

      text: reply

    });


    // ======================================
    // CHAT HISTORY
    // ======================================

    addHistory(text);


  } catch (error) {

    console.error(
      "NOVA ERROR:",
      error
    );


    removeLoading();


    addMessage(

      "assistant",

      "⚠️ NOVA could not connect.\n\n" +
      error.message

    );

  }


  // ======================================
  // ENABLE BUTTON
  // ======================================

  send.disabled = false;

  send.textContent =
    "➤";

}


// ==========================================
// ADD CHAT HISTORY
// ==========================================

function addHistory(text) {

  const box =
    document.getElementById(
      "chatHistory"
    );


  if (!box) {
    return;
  }


  // Don't duplicate
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


// ==========================================
// NEW CHAT
// ==========================================

function newChat() {

  conversation = [];


  if (!chat) {
    return;
  }


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


  if (input) {
    input.focus();
  }

}


// ==========================================
// PAGE LOAD
// ==========================================

window.addEventListener(
  "load",
  function () {

    if (input) {
      input.focus();
    }

    console.log(
      "NOVA AI frontend loaded."
    );

    console.log(
      "Using Netlify Function:"
    );

    console.log(
      "/.netlify/functions/chat"
    );

  }
);
```
