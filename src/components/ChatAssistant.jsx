// ChatAssistant.jsx

import {
    useEffect,
    useRef,
    useState,
} from "react";

import { GoogleGenerativeAI } from "@google/generative-ai";


// GEMINI SETUP
const genAI = new GoogleGenerativeAI(
    
    
    import.meta.env.VITE_GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
    model:  "gemini-2.5-flash",
});

function ChatAssistant({ properties }) {
    // STATES
    const [question, setQuestion] =
    useState("");
    
    const [messages, setMessages] =
    useState([
        {
            role: "ai",
            text: "Hello 👋 Ask me anything about the property data.",
      },
    ]);

    const [loading, setLoading] =
    useState(false);
    
    // AUTO SCROLL
    const chatEndRef = useRef(null);
    
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);
    
    // SUMMARY CREATION
    const createSummary = () => {
        const summary = {};
        
        properties.forEach((property) => {
            const city = property.tenant;
            
            // CREATE CITY OBJECT
            if (!summary[city]) {
                summary[city] = {
                    totalProperties: 0,
                    approved: 0,
                    rejected: 0,
                    pending: 0,
                    totalCollection: 0,
                    residential: 0,
                    commercial: 0,
          industrial: 0,
        };
    }
    
    // TOTAL PROPERTIES
    summary[city].totalProperties++;
    
    // STATUS COUNTS
    if (
        property.status === "Approved"
    ) {
        summary[city].approved++;
    }
    
    if (
        property.status === "Rejected"
    ) {
        summary[city].rejected++;
    }
    
    if (
        property.status === "Pending"
    ) {
        summary[city].pending++;
    }
    
    // COLLECTION
    summary[city].totalCollection +=
    property.collection_inr;
    
      // PROPERTY TYPES
      if (
        property.property_type ===
        "Residential"
    ) {
        summary[city].residential++;
    }
    
    if (
        property.property_type ===
        "Commercial"
    ) {
        summary[city].commercial++;
    }
    
    if (
        property.property_type ===
        "Industrial"
    ) {
        summary[city].industrial++;
    }
    });
    
    return summary;
};

// HANDLE AI REQUEST
const handleAsk = async () => {
    if (!question.trim()) return;

    // USER MESSAGE
    const userMessage = {
      role: "user",
      text: question,
    };
    
    setMessages((prev) => [
        ...prev,
        userMessage,
    ]);
    
    setLoading(true);

    try {
      const summary = createSummary();

      // AI PROMPT
      const prompt = `
You are an AI assistant for a Property Tax Analytics Dashboard.

You are provided summarized analytics data of multiple Indian cities.

Your job:
- Answer accurately
- Keep answers short and professional
- Use numbers when possible
- Compare cities clearly if asked

Dataset Summary:
${JSON.stringify(summary, null, 2)}

User Question:
${question}
`;

      // GEMINI RESPONSE
      const result =
        await model.generateContent(
          prompt
        );

      const response =
        result.response.text();

      // AI MESSAGE
      const aiMessage = {
        role: "ai",
        text: response,
      };

      setMessages((prev) => [
        ...prev,
        aiMessage,
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "AI service unavailable. Please check your API key.",
        },
      ]);
    }

    setLoading(false);

    setQuestion("");
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mt-10">
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          AI Chat Assistant
        </h2>

        <p className="text-slate-400 mt-1">
          Ask questions about property
          analytics
        </p>
      </div>

      {/* CHAT AREA */}
      <div className="h-[400px] overflow-y-auto bg-slate-950 rounded-xl p-4 space-y-4 mb-4 border border-slate-800">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-200"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* LOADING */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 text-slate-300 px-4 py-3 rounded-2xl text-sm">
              Thinking...
            </div>
          </div>
        )}

        {/* AUTO SCROLL */}
        <div ref={chatEndRef}></div>
      </div>

      {/* INPUT AREA */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Ask a question..."
          value={question}
          onChange={(e) =>
            setQuestion(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAsk();
            }
          }}
          className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none text-white placeholder:text-slate-500"
        />

        <button
          onClick={handleAsk}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 transition-all px-6 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Thinking..."
            : "Ask"}
        </button>
      </div>
    </div>
  );
}

export default ChatAssistant;