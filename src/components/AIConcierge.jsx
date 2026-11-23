import { useState } from "react";
import { Link } from "react-router";
import { Compass, RotateCcw, Send, Sparkles, Star, X } from "lucide-react";
import { useSendConciergeMessageMutation } from "@/lib/api";
import { useCurrency } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const FALLBACK_HOTEL_IMAGE = "/assets/grid/308797093.jpg";

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
  text: "Welcome to **StayLux Concierge**! Ask me for bespoke hotel matches, side-by-side suite comparisons, 3-day city itineraries, or privilege promo codes.",
  hotels: [],
};

const AIConcierge = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [interactionId, setInteractionId] = useState(null);
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
          text: "Our concierge service is momentarily unreachable. You can still browse all hotels or reach our 24/7 WhatsApp desk!",
          hotels: [],
        },
      ]);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {open ? (
        <div className="w-[calc(100vw-2rem)] sm:w-[390px] h-[min(500px,74vh)] bg-white border border-neutral-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-neutral-950 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-amber-400 text-neutral-950">
                <Compass className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm flex items-center gap-1">
                  StayLux Concierge
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                </h3>
                <p className="text-[11px] text-neutral-400">
                  24/7 Bespoke Travel & Suite Advisor
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                title="Reset conversation"
                className="text-neutral-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close Concierge"
                className="text-neutral-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50">
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
                      ? "bg-neutral-950 text-white rounded-br-sm"
                      : "bg-white border border-neutral-200 text-neutral-800 rounded-bl-sm shadow-xs"
                  }`}
                >
                  {renderFormattedText(m.text)}
                </div>

                {m.hotels?.length > 0 && (
                  <div className="w-[88%] space-y-2 mt-2">
                    {m.hotels.map((h) => (
                      <Link
                        key={h._id}
                        to={`/hotels/${h._id}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2.5 bg-white border border-neutral-200 rounded-xl p-2 shadow-xs hover:border-amber-500 transition-colors"
                      >
                        <img
                          src={h.image || FALLBACK_HOTEL_IMAGE}
                          alt={h.name}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = FALLBACK_HOTEL_IMAGE;
                          }}
                          className="w-12 h-12 rounded-lg object-cover shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-xs truncate text-neutral-900">
                            {h.name}
                          </p>
                          <p className="text-[11px] text-neutral-500 truncate">
                            {h.location}
                          </p>
                          <div className="flex items-center justify-between mt-0.5">
                            <span className="text-xs font-bold text-amber-700">
                              {formatPrice(h.price)}/night
                            </span>
                            <span className="text-[11px] flex items-center gap-0.5 text-neutral-700">
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
              <div className="text-xs text-neutral-500 italic px-2">
                Curating recommendations...
              </div>
            )}

            {messages.length <= 2 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {STARTER_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleAsk(q)}
                    className="text-[11px] bg-white border border-neutral-200 hover:border-amber-500 text-neutral-700 px-2.5 py-1 rounded-full transition-colors text-left"
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
            className="p-3 bg-white border-t border-neutral-200 flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask StayLux Concierge..."
              className="text-sm h-10 bg-white text-neutral-950"
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              className="h-10 w-10 shrink-0 bg-neutral-950 hover:bg-neutral-800 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      ) : (
        <Button
          onClick={() => setOpen(true)}
          className="h-11 px-4 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white shadow-xl gap-2 border border-amber-400/50"
        >
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span className="font-semibold text-xs sm:text-sm">Concierge</span>
        </Button>
      )}
    </div>
  );
};

export default AIConcierge;
