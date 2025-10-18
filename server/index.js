import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

app.get("/api/prompt", async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.json({ prompt: "Draw a robot playing a guitar." });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "Give me a fun drawing prompt." }],
      }),
    });

    const data = await response.json();
    const prompt = data.choices?.[0]?.message?.content || "Draw a happy penguin.";
    res.json({ prompt });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Socket.io connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.emit("serverMessage", "Welcome to DrawBattle PoC!");
});

const PORT = 5001;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
