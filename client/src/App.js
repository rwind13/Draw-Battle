import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    socket.on("serverMessage", (msg) => {
      console.log("Socket message:", msg);
    });
  }, []);

  const getPrompt = async () => {
    const res = await fetch("http://localhost:5000/api/prompt");
    const data = await res.json();
    setPrompt(data.prompt);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "4rem", fontFamily: "sans-serif" }}>
      <h1>🎨 DrawBattle Proof of Concept</h1>
      <button onClick={getPrompt} style={{ padding: "0.6rem 1rem", marginTop: "1rem" }}>
        Get AI Prompt
      </button>
      {prompt && <h3 style={{ marginTop: "2rem" }}>{prompt}</h3>}
    </div>
  );
}

export default App;
