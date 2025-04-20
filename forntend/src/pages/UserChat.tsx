import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

interface Message {
  sender: "user" | "bot";
  text: string;
}

const UserChat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/v1/user/${id}`)
      .then((res) => res.json())
      .then((data) => setUser(data.data))
      .catch((err) => console.error("Error fetching user:", err));
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Send message to backend
    fetch("http://localhost:8000/api/v1/screening/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: id,
        message: userMessage.text,
      }),
    })
      .then((res) => {
        // Check if response is a redirect (status code 307)
        if (res.status === 307) {
          // Extract the URL for redirect
          const redirectUrl = res.headers.get("Location");
          if (redirectUrl) {
            // Redirect to the result page using react-router's useNavigate
            navigate(redirectUrl);  // react-router handles the navigation
          }
        } else {
          return res.json();
        }
      })
      .then((data) => {
        if (data?.redirect_url) {
          navigate(data.redirect_url); 
          return;
        }
        else if (data && data.message) {
          const botReply: Message = {
            sender: "bot",
            text: data.message || "Sorry, I didn’t understand that 🤖",
          };
          setMessages((prev) => [...prev, botReply]);
        }
      })
      .catch((err) => {
        console.error("Error sending message:", err);
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "Oops! Something went wrong 😓",
          },
        ]);
      })
      .finally(() => {
        setIsTyping(false);
      });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  if (!user) return <p className="text-center mt-10">Loading chat...</p>;

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="p-4 bg-white shadow-md text-xl font-semibold">
      Hi {user.name}, you're now chatting with your AI Mental Wellness Companion.
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-xl text-sm ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-900 shadow"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="bg-white text-gray-500 px-4 py-2 rounded-xl shadow text-sm flex items-center gap-2">
          <span>🤖 Please wait, AI is responding...</span>
          <span className="flex space-x-1">
            <span className="animate-bounce">.</span>
            <span className="animate-bounce delay-150">.</span>
            <span className="animate-bounce delay-300">.</span>
          </span>
        </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 bg-white border-t flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Send a message..."
          className="flex-1 px-4 py-2 border rounded-xl focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default UserChat;
