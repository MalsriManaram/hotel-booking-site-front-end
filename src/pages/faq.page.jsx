import { useState } from "react";
import { Link } from "react-router";
import {
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  MessageCircle,
  Search,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const FAQ_ITEMS = [
  {
    category: "Reservations & WhatsApp",
    q: "How does StayLux Instant WhatsApp Store Checkout work?",
    a: "When you complete the Booking Dialog on any property, StayLux immediately locks your room dates in our system, assigns a unique SLX-... booking reference, and opens a pre-formatted WhatsApp confirmation message with our 24/7 reservations desk. No upfront credit card is required to hold your room.",
  },
  {
    category: "Reservations & WhatsApp",
    q: "Can I choose to Pay at the Property instead?",
    a: "Yes! Inside the Booking Dialog, select 'Pay at Property on Arrival' under Checkout Option. Your reservation is confirmed immediately and you settle directly at the hotel front desk in local currency or card upon check-in.",
  },
  {
    category: "Cancellations & Policies",
    q: "What is the cancellation policy for reservations?",
    a: "Most StayLux properties include complimentary cancellation up to 48 hours prior to check-in (exact hours are displayed on every hotel page). You can cancel upcoming reservations in one click from your My Account → My Bookings tab.",
  },
  {
    category: "Cancellations & Policies",
    q: "What are the standard check-in and check-out times?",
    a: "Standard check-in begins at 14:00 and check-out is until 11:00 unless noted otherwise on the property page. Early check-in or late check-out can be requested in the Special Requests box when booking.",
  },
  {
    category: "Pricing & Promos",
    q: "How do I switch currencies (USD, LKR, EUR, AUD, JPY)?",
    a: "Click the currency selector (Globe icon) in the top navigation bar at any time to switch displayed nightly rates and totals between USD ($), Sri Lankan Rupees (Rs.), Euro (€), Australian Dollars (A$), and Japanese Yen (¥).",
  },
  {
    category: "Pricing & Promos",
    q: "How do I apply a promo code to my booking?",
    a: "Open the 'Book Now' modal on your chosen hotel, enter a valid code (such as STAYLUX10, WELCOME15, or LUXURY20) in the Promo Code field, and click Apply. Your discounted total updates immediately before you submit.",
  },
  {
    category: "Account & Loyalty",
    q: "How do StayLux Loyalty Points and Wishlists work?",
    a: "Every non-canceled reservation earns 10 StayLux Reward Points per $1 USD booked, unlocking Silver, Gold, and Platinum Elite perks on your My Account page. You can also tap the Heart icon on any hotel card to save properties to your Wishlist.",
  },
];

const CATEGORIES = [
  "All",
  "Reservations & WhatsApp",
  "Cancellations & Policies",
  "Pricing & Promos",
  "Account & Loyalty",
];

const FaqPage = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState(0);

  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    const matchesCat =
      activeCategory === "All" || item.category === activeCategory;
    const matchesSearch =
      !search.trim() ||
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <main className="min-h-screen pb-16">
      {/* Header */}
      <section className="bg-neutral-950 text-white py-16 px-4 md:px-8 border-b border-amber-500/20">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <span className="text-xs uppercase tracking-[0.22em] text-amber-400 font-semibold inline-flex items-center gap-2">
            <HelpCircle className="h-4 w-4" /> Guest Help Center & Policies
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold">
            How Can We Assist Your Journey?
          </h1>
          <p className="text-neutral-300 max-w-2xl mx-auto text-sm md:text-base">
            Everything you need to know about instant WhatsApp Store booking,
            flexible cancellations, multi-currency pricing, and member rewards.
          </p>

          <div className="max-w-xl mx-auto pt-3 relative">
            <Search className="h-4 w-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 mt-1.5" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions — e.g. 'WhatsApp', 'cancel', 'promo'..."
              className="h-12 pl-10 bg-white text-neutral-950 border-0"
            />
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 md:px-8 pt-10 space-y-12">
        {/* 3-Step Visual Booking Walkthrough */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              step: "01",
              title: "Choose Suite & Dates",
              desc: "Check live per-room availability on the green/red calendar and apply any promo code.",
            },
            {
              step: "02",
              title: "Instant SLX Reference",
              desc: "Submit your reservation—your room dates are locked immediately with a printable voucher.",
            },
            {
              step: "03",
              title: "Confirm on WhatsApp",
              desc: "One click opens our WhatsApp Store desk with your booking summary to finalize arrival details.",
            },
          ].map((s) => (
            <Card key={s.step} className="rounded-2xl bg-white shadow-xs">
              <CardContent className="p-6 space-y-2">
                <span className="font-mono text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">
                  STEP {s.step}
                </span>
                <h2 className="font-bold text-lg pt-1">{s.title}</h2>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {s.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Category Filter Tabs */}
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat);
                  setOpenIndex(0);
                }}
                className={`text-xs sm:text-sm px-4 py-2 rounded-full border font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-neutral-950 text-amber-300 border-neutral-950"
                    : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Accordion */}
          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <Card className="rounded-2xl p-8 text-center bg-white">
                <p className="text-neutral-600">
                  No FAQ articles matched "{search}". Try another keyword or
                  message our team below!
                </p>
              </Card>
            ) : (
              filteredFaqs.map((item, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <Card
                    key={item.q}
                    className="rounded-2xl bg-white overflow-hidden transition-shadow hover:shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                      className="w-full text-left px-6 py-4 flex items-center justify-between gap-4"
                    >
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 block mb-0.5">
                          {item.category}
                        </span>
                        <span className="font-semibold text-base text-neutral-950">
                          {item.q}
                        </span>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 text-neutral-500 shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-amber-600" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 pt-1 text-sm text-neutral-600 leading-relaxed border-t border-neutral-100">
                        {item.a}
                      </div>
                    )}
                  </Card>
                );
              })
            )}
          </div>
        </div>

        {/* Bottom Support Banner */}
        <Card className="rounded-3xl bg-neutral-950 text-white p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-amber-500/25">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="font-display text-2xl md:text-3xl font-bold flex items-center justify-center md:justify-start gap-2">
              <ShieldCheck className="h-6 w-6 text-amber-400" />
              Still Have a Specific Question?
            </h3>
            <p className="text-sm text-neutral-300">
              Our hospitality specialists reply within minutes on WhatsApp or
              via our Contact desk.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Button
              asChild
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            >
              <a
                href="https://wa.me/94771231234?text=Hello%20StayLux!%20I%20have%20a%20question."
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Support
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-neutral-700 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link to="/contact-us">Contact Form</Link>
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
};

export default FaqPage;
