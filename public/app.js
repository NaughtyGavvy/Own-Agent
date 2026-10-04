let conversation = [];

const chat = document.getElementById("chat");
const input = document.getElementById("message");
const send = document.getElementById("send");


// ENTER = SEND
input.addEventListener("keydown", function (event) {

  if (event.key === "Enter" && !event.shiftKey) {

    event.preventDefault();

    sendMessage();

  }

});


// SUGGESTION BUTTON
function useSuggestion(text) {

  input.value = text;

  sendMessage();

}


// ADD MESSAGE TO SCREEN
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

  content.className = "message-text";

  content.textContent = text;


  message.appendChild(avatar);

  message.appendChild(content);

  chat.appendChild(message);


  chat.scrollTop =
    chat.scrollHeight;

}


// SEND MESSAGE TO VERCEL
async function sendMessage() {

  const text =
    input.value.trim();


  if (!text) {
    return;
  }


  // Show user's message
  addMessage(
    "user",
    text
  );


  // Save conversation
  conversation.push({

    role: "user",

    text: text

  });


  // Clear input
  input.value = "";


  // Disable send button
  send.disabled = true;

  send.textContent = "...";


  try {

    const response =
      await fetch("/api/chat", {

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

      });


    const data =
      await response.json();


    // Check server error
    if (!response.ok) {

      throw new Error(
        data.error ||
        "AI request failed"
      );

    }


    // Show AI response
    addMessage(
      "assistant",
      data.reply
    );


    // Save AI response
    conversation.push({

      role: "model",

      text: data.reply

    });


    // Add to sidebar
    addHistory(text);


  } catch (error) {

    console.error(error);


    addMessage(

      "assistant",

      "Sorry, I couldn't connect to NOVA.\n\n" +
      error.message

    );

  }


  // Enable button
  send.disabled = false;

  send.textContent = "➤";

}


// ADD CHAT TO SIDEBAR
function addHistory(text) {

  const box =
    document.getElementById(
      "chatHistory"
    );


  // Only add first message
  if (box.children.length > 0) {
    return;
  }


  const item =
    document.createElement("div");


  item.className =
    "history-item";


  item.textContent =
    text;


  box.appendChild(item);

}


// NEW CHAT
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

    </div>

  `;

}
