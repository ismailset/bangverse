import React, { useState, useRef, useEffect } from "react";
import { Message } from "../types";
import { Sparkles, Send, Bot, User, CheckCircle2, RefreshCw } from "lucide-react";

export default function AIFashionAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "assistant",
      text: "Yo! I'm your BongVerse AI Stylist. ⚡ Ask me anything about campus style, sizing, or how to pair our oversized boxy fits for your university vibes. ki khobor?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const starterPrompts = [
    "Recommend a fit for a campus hangout",
    "What size should I get if I'm 5'9?",
    "Tell me about the Shonalu Tee details",
    "Style the Brutalist Cargo Pants"
  ];

  // Auto-scroll on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      // Build conversation history in a structured format for the backend prompt
      const conversationHistory = messages.concat(userMessage).map(m => 
        `${m.sender === "user" ? "Student" : "BongVerse Stylist"}: ${m.text}`
      ).join("\n");

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: textToSend, history: conversationHistory })
      });

      if (!response.ok) {
        throw new Error("Failed to consult AI Stylist");
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        sender: "assistant",
        text: data.reply || "Ami ektu confused, bro! Can you ask again? (Double check if API keys are set in Settings).",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage: Message = {
        sender: "assistant",
        text: "My backend uplink is loading! Ensure your GEMINI_API_KEY is configured in the secrets menu. In the meantime, the heavy boxy 260GSM Shonalu Tee paired with Brutalist Cargos is the ultimate campus cheat code. 🔥",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(inputText);
  };

  return (
    <div id="ai-assistant-section" className="w-full py-12 px-4 sm:px-6 lg:px-8 border border-neutral-100 dark:border-neutral-900 rounded-3xl bg-white dark:bg-[#09090A] shadow-xl overflow-hidden transition-all duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Editorial introduction */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-medium tracking-wide rounded-full text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-900/30">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              BongVerse Neural Engine
            </span>
            <h2 className="text-4xl lg:text-5xl font-sans font-extrabold tracking-tighter uppercase text-neutral-900 dark:text-white leading-none">
              Meet Your Campus<br className="hidden sm:inline" /> AI Style Assistant
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed">
              Get modular outfit suggestions, personalized size mappings, and direct street combos instantly. Programmed to translate Bangladeshi streetwear needs with international design standards.
            </p>
          </div>

          <div className="space-y-3.5 pt-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#2563EB] dark:text-[#3B82F6] font-bold block">Quick Styling Prompts:</span>
            <div className="flex flex-wrap gap-2">
              {starterPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  disabled={isLoading}
                  className="px-3.5 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-800 transition-all text-left block cursor-pointer disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-4 border-t border-neutral-100 dark:border-neutral-900/60 text-xs text-neutral-500 dark:text-neutral-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Fully integrated model training via Gemini 3.5 Flash</span>
          </div>
        </div>

        {/* Right Side: Animated/Fully Interactive Chat interface */}
        <div className="lg:col-span-7 flex flex-col h-[460px] rounded-2xl bg-neutral-50 dark:bg-[#0E0E10] border border-neutral-200/50 dark:border-neutral-800/60 overflow-hidden shadow-inner font-sans">
          
          {/* Chat Header */}
          <div className="px-4 py-3 bg-white dark:bg-[#121215] border-b border-neutral-200/60 dark:border-neutral-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-neutral-950 rounded-full" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white">BongVerse Stylist v3.5</h4>
                <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-450">SYSTEM AGENT ONLINE</span>
              </div>
            </div>
            
            <button 
              onClick={() => setMessages([{
                sender: "assistant",
                text: "Yo! We refreshed. Let's design another custom combo. Sizing questions?",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }])}
              className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-850 text-neutral-400 hover:text-neutral-700 transition"
              title="Reset Chat"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Logs Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex max-w-[85%] ${m.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                  m.sender === "user" 
                    ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 ml-2.5" 
                    : "bg-blue-600/10 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 mr-2.5"
                }`}>
                  {m.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`p-3 rounded-2xl text-[13px] leading-relaxed relative ${
                  m.sender === "user"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-white dark:bg-[#141418] text-neutral-800 dark:text-neutral-200 rounded-tl-none border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm"
                }`}>
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  <span className={`block mt-1 text-[9px] text-right ${
                    m.sender === "user" ? "text-blue-200" : "text-neutral-400"
                  }`}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-1.5 p-3 max-w-[120px] bg-white dark:bg-[#141418] rounded-2xl rounded-tl-none border border-neutral-200/50 dark:border-neutral-800/50 mr-auto">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Form Actions */}
          <form 
            onSubmit={handleFormSubmit}
            className="p-3 bg-white dark:bg-[#121215] border-t border-neutral-200/60 dark:border-neutral-800/80 flex gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask for outfit recommendations, fits or size..."
              disabled={isLoading}
              className="flex-1 px-3.5 py-2 text-sm bg-neutral-50 dark:bg-[#18181C] border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-neutral-900 dark:text-white placeholder-neutral-400"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-neutral-200 dark:disabled:bg-neutral-800 disabled:text-neutral-400 rounded-xl transition cursor-pointer flex items-center justify-center shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
