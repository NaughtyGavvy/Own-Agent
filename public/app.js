```javascript
// ========================================
// NOVA AI - SIMPLE NETLIFY VERSION
// ========================================

var conversation = [];


// ========================================
// GET ELEMENTS
// ========================================

var chat = document.getElementById("chat");
var input = document.getElementById("message");
var send = document.getElementById("send");


// ========================================
// SEND BUTTON
// ========================================

if (send) {

    send.addEventListener("click", function () {

        sendMessage();

    });

}


// ========================================
// ENTER KEY
// ========================================

if (input) {

    input.addEventListener("keydown", function (event) {

        if (event.key === "Enter" && !event.shiftKey) {

            event.preventDefault();

            sendMessage();

        }

    });

}


// ========================================
// SUGGESTIONS
// ========================================

function useSuggestion(text) {

    if (!input) {
        alert("Message box not found.");
        return;
    }

    input.value = text;

    sendMessage();

}


// ========================================
// ADD MESSAGE
// ========================================

function addMessage(role, text) {

    if (!chat) {
        return;
    }


    var welcome =
        document.getElementById("welcome");

    if (welcome) {
        welcome.remove();
    }


    var message =
        document.createElement("div");

    message.className = "message";


    var avatar =
        document.createElement("div");

    avatar.className =
        role === "user"
            ? "avatar user-avatar"
            : "avatar";

    avatar.textContent =
        role === "user"
            ? "U"
            : "✦";


    var content =
        document.createElement("div");

    content.className = "message-text";

    content.textContent = text;


    message.appendChild(avatar);

    message.appendChild(content);

    chat.appendChild(message);


    chat.scrollTop =
        chat.scrollHeight;

}


// ========================================
// SEND MESSAGE
// ========================================

async function sendMessage() {

    if (!input) {
        alert("Message input not found.");
        return;
    }


    var text =
        input.value.trim();


    if (!text) {
        return;
    }


    // Show user message
    addMessage(
        "user",
        text
    );


    // Save message
    conversation.push({

        role: "user",

        text: text

    });


    // Clear input
    input.value = "";


    if (send) {

        send.disabled = true;

        send.textContent = "...";

    }


    // Loading
    addMessage(
        "assistant",
        "NOVA is thinking..."
    );


    try {

        var response =
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


        var data =
            await response.json();


        // Remove loading message
        var messages =
            document.querySelectorAll(
                ".message"
            );

        if (messages.length > 0) {

            var last =
                messages[messages.length - 1];

            if (
                last.textContent.indexOf(
                    "NOVA is thinking..."
                ) !== -1
            ) {

                last.remove();

            }

        }


        if (!response.ok) {

            throw new Error(

                data.error ||
                data.details ||
                "AI request failed"

            );

        }


        var reply =
            data.reply ||
            "No response received.";


        // Display AI response
        addMessage(
            "assistant",
            reply
        );


        // Save AI response
        conversation.push({

            role: "model",

            text: reply

        });


        addHistory(text);


    } catch (error) {

        console.error(error);


        addMessage(

            "assistant",

            "NOVA Error:\n" +
            error.message

        );

    }


    if (send) {

        send.disabled = false;

        send.textContent = "➤";

    }

}


// ========================================
// CHAT HISTORY
// ========================================

function addHistory(text) {

    var box =
        document.getElementById(
            "chatHistory"
        );


    if (!box) {
        return;
    }


    if (box.children.length > 0) {
        return;
    }


    var item =
        document.createElement("div");

    item.className =
        "history-item";

    item.textContent =
        text;


    box.appendChild(item);

}


// ========================================
// NEW CHAT
// ========================================

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


// ========================================
// TEST
// ========================================

console.log(
    "NOVA AI JavaScript loaded successfully."
);
```
