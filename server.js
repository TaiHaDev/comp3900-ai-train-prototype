// server.js
require('dotenv').config();


const WebSocket = require("ws");

const backendServer = new WebSocket.Server({ port: 3001 });

// Handle frontend WebSocket connections
backendServer.on("connection", (clientWs) => {
  console.log("Frontend WebSocket connected.");

  const openAiWs = new WebSocket(
    "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01",
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "OpenAI-Beta": "realtime=v1",
      },
    }
  );

  openAiWs.on("open", function open() {
    console.log("Connected to server.");
    openAiWs.send(JSON.stringify({
        "type": "session.update",
        "session": {
            "modalities": ["audio", "text"],
            "instructions": "Let's imagine you are an AI public transport system in Canberra. And you are in charged of answering question about the public transport system. Assuming that we are in Canberra Australia. Keep the language quick and simple!",
            "voice": "alloy",
            "input_audio_format": "pcm16",
            "output_audio_format": "pcm16",
            "input_audio_transcription": {
                "model": "whisper-1"
            },
        }
    }));
});

  clientWs.on("message", (message) => {
    message = JSON.parse(message)
    const event = {
        type: 'conversation.item.create',
        item: {
          type: 'message',
          role: 'user',
          instructions: "Just say: we have rerouted you to avoid delays. Your new estimated arrival time is 11:00",
          content: [
            {
              type: 'input_text',
              text: message.text
            }
          ]
        }
      };
    openAiWs.send(JSON.stringify(event));
    openAiWs.send(JSON.stringify({type: 'response.create'}));
  });

  openAiWs.on("message", (message) => {
    clientWs.send(message.toString());
  });

  clientWs.on("close", () => openAiWs.close());
});

console.log("WebSocket server running on ws://localhost:3001");
