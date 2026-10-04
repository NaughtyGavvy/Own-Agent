const { GoogleGenAI } = require("@google/genai");

exports.handler = async function (event) {

  // Only allow POST requests
  if (event.httpMethod !== "POST") {

    return {
      statusCode: 405,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        error: "Method not allowed"
      })
    };

  }


  try {

    const body =
      JSON.parse(event.body || "{}");


    const message =
      body.message;


    const history =
      body.history || [];


    if (!message || !message.trim()) {

      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          error: "Message is required"
        })
      };

    }


    // Check Gemini API key
    if (!process.env.GEMINI_API_KEY) {

      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          error: "GEMINI_API_KEY is not configured in Netlify"
        })
      };

    }


    // Connect to Gemini
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });


    // Build conversation
    const contents = [];


    for (const item of history) {

      if (
        item.role !== "user" &&
        item.role !== "model"
      ) {
        continue;
      }


      contents.push({

        role: item.role,

        parts: [
          {
            text: String(item.text || "")
          }
        ]

      });

    }


    // Add current user message
    contents.push({

      role: "user",

      parts: [
        {
          text: message
        }
      ]

    });


    // Ask Gemini
    const response =
      await ai.models.generateContent({

        model: "gemini-2.5-flash",

        contents: contents,

        config: {

          systemInstruction: `
You are NOVA, a helpful personal AI agent.

You can help the user with:

- Questions
- Programming
- Websites
- Games
- Business ideas
- Writing
- Learning
- Problem solving
- Technology
- Creative ideas

Give clear, useful and organized answers.

When explaining technical tasks,
give beginner-friendly step-by-step instructions.

Do not claim that you performed an action
unless you actually performed it.

You are NOVA AI.
          `

        }

      });


    return {

      statusCode: 200,

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({

        reply: response.text

      })

    };


  } catch (error) {

    console.error(error);


    return {

      statusCode: 500,

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({

        error: "AI request failed",

        details: error.message

      })

    };

  }

};
