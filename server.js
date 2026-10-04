require("dotenv").config();

const express = require("express");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

const app = express();

const PORT = process.env.PORT || 3000;

if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is missing.");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.use(express.json());

app.use(
  express.static(
    path.join(__dirname, "public")
  )
);


app.post("/api/chat", async (req, res) => {

  try {

    const message = req.body.message;
    const history = req.body.history || [];

    if (!message) {

      return res.status(400).json({
        error: "Message is required"
      });

    }

    const contents = [];

    for (const item of history) {

      contents.push({

        role: item.role,

        parts: [
          {
            text: item.text
          }
        ]

      });

    }

    contents.push({

      role: "user",

      parts: [
        {
          text: message
        }
      ]

    });


    const response =
      await ai.models.generateContent({

        model: "gemini-2.5-flash",

        contents: contents,

        config: {

          systemInstruction: `
You are NOVA, a powerful personal AI agent.

You help users with:

- Questions
- Programming
- Websites
- Games
- Business ideas
- Writing
- Learning
- Problem solving

Give clear and useful answers.

Never claim that you performed an action unless you actually did it.
          `

        }

      });


    res.json({
      reply: response.text
    });


  } catch (error) {

    console.error(error);

    res.status(500).json({

      error: error.message

    });

  }

});


app.get("*", (req, res) => {

  res.sendFile(
    path.join(
      __dirname,
      "public",
      "index.html"
    )
  );

});


app.listen(PORT, () => {

  console.log(
    `NOVA AI running on port ${PORT}`
  );

});
