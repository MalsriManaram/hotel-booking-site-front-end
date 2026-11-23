import { useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { Award, Check, Copy, Gift, Sparkles, Tag } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PROMO_VOUCHERS = [
  {
    code: "STAYLUX10",
    discount: "10% OFF",
    title: "Signature Welcome Privilege",
    subtitle: "Valid on any room category across all global properties",
    condition: "No minimum nights • Instant checkout redemption",
    accent: "from-neutral-950 to-neutral-900 text-white border-amber-400/40",
  },
  {
    code: "WELCOME15",
    discount: "15% OFF",
    title: "Suite & Deluxe Upgrade Offer",
    subtitle: "Elevate your stay in Deluxe Panoramic Rooms & Executive Suites",
    condition: "Applies to Deluxe & Suite room categories",
    accent: "from-amber-500 to-amber-600 text-neutral-950 border-amber-700/30",
  },
  {
    code: "LUXURY20",
    discount: "20% OFF",
    title: "Extended Stay Sanctuary",
    subtitle: "Unwind longer with 20% savings on 4+ consecutive nights",
    condition: "Minimum 4-night stay • Any room category",
    accent: "from-neutral-900 to-stone-800 text-white border-amber-400/30",
  },
];

const CURATED_PACKAGES = [
  {
    title: "Honeymoon & Anniversary Escape",
    tag: "Romantic Package",
    perks: [
      "Complimentary late check-out until 14:00 (subject to availability)",
      "Priority panoramic or garden-view suite allocation",
      "Direct WhatsApp concierge celebration coordination",
    ],
    ctaLink: "/hotels?q=Romantic+luxury+hotel",
  },
  {
    title: "Executive City Workcation",
    tag: "Business & Remote",
    perks: [
      "High-speed Wi-Fi, espresso maker & quiet floor preference",
      "Express check-in & printable corporate expense voucher",
      "Flexible 48-hour free cancellation window",
    ],
    ctaLink: "/hotels?q=Modern+city+center+hotel+with+wifi",
  },
  {
    title: "Family Cultural Discovery",
    tag: "Family Stays",
    perks: [
      "Spacious Double, Deluxe & Multi-Guest Suite options",
      "Curated 3-day family-friendly city itinerary on request",
      "Pay on arrival or instant WhatsApp group confirmation",
    ],
    ctaLink: "/hotels",
  },
];

const LOYALTY_TIERS = [
  {
    tier: "Classic Member",
    points: "0 – 1,499 pts",
    highlight: "Instant access to member promo codes & saved wishlists",
  },
  {
    tier: "Silver Member",
    points: "1,500 – 4,999 pts",
    highlight: "Priority WhatsApp concierge desk & early check-in requests",
  },
  {
    tier: "Gold Member",
    points: "5,000 – 14,999 pts",
    highlight: "Complimentary room view upgrades when available",
  },
  {
    tier: "Platinum Elite",
    points: "15,000+ pts",
    highlight: "Dedicated travel curator & bespoke celebratory amenities",
  },
];

const OffersPage = () => {
  const [copiedCode, setCopiedCode] = useState("");

  const handleCopy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success(`Copied promo code ${code}! Apply it inside any Booking Dialog.`);
      setTimeout(() => setCopiedCode(""), 3000);
    } catch {
      toast.info(`Use promo code: ${code}`);
    }
  };

  return (
    <main className="min-h-screen pb-16">
      {/* Header */}
      <section className="bg-neutral-950 text-white py-16 px-4 md:px-8 border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-[0.22em] text-amber-400 font-semibold flex items-center gap-2">
            <Gift className="h-4 w-4" /> Seasonal Privileges & Rewards
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold">
            Exclusive Offers & Member Perks
          </h1>
          <p className="text-neutral-300 max-w-2xl text-sm md:text-base leading-relaxed">
            Copy any active StayLux privilege code below and apply it directly
            at checkout for instant savings on your next reservation.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-10 space-y-14">
        {/* Boarding-Pass Style Promo Vouchers */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-3xl font-bold flex items-center gap-2">
              <Tag className="h-6 w-6 text-amber-600" /> Active Privilege Codes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROMO_VOUCHERS.map((v, idx) => {
              const isCopied = copiedCode === v.code;
              const isLight = v.code === "WELCOME15";

              return (
                <motion.div
                  key={v.code}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                >
                  <div
                    className={`rounded-3xl bg-gradient-to-br ${v.accent} border p-6 shadow-lg h-full flex flex-col justify-between space-y-6 relative overflow-hidden`}
                  >
                    <div className="space-y-2">
                      <span
                        className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                          isLight
                            ? "bg-neutral-950 text-amber-400"
                            : "bg-amber-400 text-neutral-950"
                        }`}
                      >
                        {v.discount}
                      </span>
                      <h3 className="font-display text-2xl font-bold pt-1">
                        {v.title}
                      </h3>
                      <p
                        className={`text-sm leading-relaxed ${
                          isLight ? "text-neutral-900" : "text-neutral-300"
                        }`}
                      >
                        {v.subtitle}
                      </p>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-dashed border-current/20">
                      <p
                        className={`text-xs ${
                          isLight ? "text-neutral-800" : "text-neutral-400"
                        }`}
                      >
                        {v.condition}
                      </p>

                      <div className="flex items-center justify-between gap-2 bg-black/15 backdrop-blur-xs rounded-xl px-3.5 py-2.5">
                        <span className="font-mono font-bold tracking-wider text-sm">
                          {v.code}
                        </span>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleCopy(v.code)}
                          className={
                            isLight
                              ? "bg-neutral-950 hover:bg-neutral-800 text-white gap-1.5 h-8"
                              : "bg-white hover:bg-neutral-100 text-neutral-950 gap-1.5 h-8 font-semibold"
                          }
                        >
                          {isCopied ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              Copy Code
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Curated Experience Packages */}
        <section className="space-y-5">
          <h2 className="font-display text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-amber-600" /> Curated Stay Experiences
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CURATED_PACKAGES.map((pkg) => (
              <Card
                key={pkg.title}
                className="rounded-3xl bg-white shadow-sm hover:shadow-lg transition-shadow h-full flex flex-col"
              >
                <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <Badge variant="secondary" className="bg-amber-50 text-amber-900 border border-amber-200">
                      {pkg.tag}
                    </Badge>
                    <h3 className="font-display text-2xl font-bold">
                      {pkg.title}
                    </h3>
                    <ul className="space-y-2 text-sm text-neutral-600 pt-1">
                      {pkg.perks.map((perk, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button asChild variant="outline" className="w-full rounded-xl">
                    <Link to={pkg.ctaLink}>Browse Matching Hotels</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* StayLux Loyalty Program Overview */}
        <section className="rounded-3xl bg-white border border-neutral-200 p-8 md:p-10 space-y-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-amber-600 font-semibold">
                Earn 10 Points Per $1 USD Reserved
              </span>
              <h2 className="font-display text-3xl font-bold mt-1 flex items-center gap-2">
                <Award className="h-6 w-6 text-amber-600" /> StayLux Loyalty Tiers
              </h2>
            </div>
            <Button asChild className="bg-neutral-950 hover:bg-neutral-800 text-white">
              <Link to="/account">Check My Tier & Points</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {LOYALTY_TIERS.map((t) => (
              <div
                key={t.tier}
                className="rounded-2xl bg-neutral-50 border border-neutral-200 p-5 space-y-1.5"
              >
                <p className="text-xs font-mono font-semibold text-amber-700">
                  {t.points}
                </p>
                <h3 className="font-bold text-base text-neutral-950">
                  {t.tier}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {t.highlight}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default OffersPage;
