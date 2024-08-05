import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";

function App() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<
        Array<{ role: string; content: string }>
    >([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        setMessages((prev) => [...prev, { role: "user", content: input }]);
        try {
            const response = await invoke("chat", { message: input });
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: response as string },
            ]);
        } catch (error) {
            console.error("Error:", error);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "An error occurred. Please try again." },
            ]);
        }
        setInput("");
    };

    return (
        <div className="App">
            <h1>AI Code Explainer</h1>
            <div className="chat-window">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.role}`}>
                        <strong>{msg.role === "user" ? "You:" : "AI:"}</strong>{" "}
                        {msg.content}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter your code or question..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}

export default App;
