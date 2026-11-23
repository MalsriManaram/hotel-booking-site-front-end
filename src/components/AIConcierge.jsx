import { useState } from "react";
import { Link } from "react-router";
import { Bot, MessageSquare, RotateCcw, Send, Sparkles, Star, X } from "lucide-react";
import { useSendConciergeMessageMutation } from "@/lib/api";
import { useCurrency } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STARTER_QUESTIONS = [
  "Romantic stay in Paris under $250",
  "Plan a 3-day Kyoto itinerary",
  "Compare Sydney luxury hotels",
  "Any promo codes available?",
];

function renderFormattedText(text) {
  return String(text || "")
    .split("\n")
    .map((line, idx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={idx} className="leading-relaxed">
          {parts.map((part, i) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={i}>{part.slice(2, -2)}</strong>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </p>
      );
    });
}

const INITIAL_GREETING = {
  role: "assistant",
  text: "Welcome to **StayLux AI Concierge** (powered by Google Gemini)! Ask me for hotel recommendations, side-by-side comparisons, multi-day itineraries, or active promo codes.",
  hotels: [],
};

const AIConcierge = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [interactionId, setInteractionId] = useState(null);
  const [providerMode, setProviderMode] = useState(null);
  const [messages, setMessages] = useState([INITIAL_GREETING]);

  const [sendMessage, { isLoading }] = useSendConciergeMessageMutation();
  const { formatPrice } = useCurrency();

  const handleResetChat = () => {
    setInteractionId(null);
    setMessages([INITIAL_GREETING]);
  };

  const handleAsk = async (questionText) => {
    const trimmed = (questionText ?? input).trim();
    if (!trimmed || isLoading) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: trimmed, hotels: [] },
    ]);
    setInput("");

    try {
      const res = await sendMessage({
        message: trimmed,
        previousInteractionId: interactionId || undefined,
      }).unwrap();

      if (res.interactionId) {
        setInteractionId(res.interactionId);
      }
      if (res.provider) {
        setProviderMode(res.provider);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: res.reply,
          hotels: res.recommendedHotels || [],
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "I couldn't reach the concierge server right now. Please make sure the backend is running!",
          hotels: [],
        },
      ]);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open ? (
        <div className="w-[350px] sm:w-[400px] h-[530px] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-black text-white px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-400 text-black">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm flex items-center gap-1">
                  StayLux AI Concierge
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                </h3>
                <p className="text-[11px] text-gray-300">
                  {providerMode === "gemini-3.8-flash"
                    ? "Google Gemini 3.8 Flash • Multi-Turn Memory"
                    : "Smart Property Advisor & Trip Planner"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                title="Start new conversation"
                className="text-gray-400 hover:text-white p-1"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/70">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  m.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm space-y-1 ${
                    m.role === "user"
                      ? "bg-black text-white rounded-br-sm"
                      : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm"
                  }`}
                >
                  {renderFormattedText(m.text)}
                </div>

                {/* Recommended Hotel Cards */}
                {m.hotels?.length > 0 && (
                  <div className="w-[88%] space-y-2 mt-2">
                    {m.hotels.map((h) => (
                      <Link
                        key={h._id}
                        to={`/hotels/${h._id}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2.5 bg-white border rounded-xl p-2 shadow-sm hover:border-amber-500 transition-colors"
                      >
                        <img
                          src={h.image}
                          alt={h.name}
                          className="w-14 h-14 rounded-lg object-cover shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-xs truncate">
                            {h.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {h.location}
                          </p>
                          <div className="flex items-center justify-between mt-0.5">
                            <span className="text-xs font-bold text-amber-700">
                              {formatPrice(h.price)}/night
                            </span>
                            <span className="text-[11px] flex items-center gap-0.5">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              {h.rating || "New"}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="text-xs text-muted-foreground italic px-2">
                Gemini is thinking...
              </div>
            )}

            {/* Quick Starter Chips */}
            {messages.length <= 2 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {STARTER_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleAsk(q)}
                    className="text-[11px] bg-white border border-gray-200 hover:border-amber-400 text-gray-700 px-2.5 py-1 rounded-full transition-colors text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk();
            }}
            className="p-3 bg-white border-t flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Gemini about hotels, trips, promos..."
              className="text-sm h-10"
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              className="h-10 w-10 shrink-0 bg-black hover:bg-neutral-800"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      ) : (
        <Button
          onClick={() => setOpen(true)}
          className="h-14 px-5 rounded-full bg-black hover:bg-neutral-800 text-white shadow-2xl gap-2.5 border border-amber-400/40"
        >
          <MessageSquare className="h-5 w-5 text-amber-400" />
          <span className="font-semibold text-sm">Gemini Concierge</span>
        </Button>
      )}
    </div>
  );
};

export default AIConcierge;
