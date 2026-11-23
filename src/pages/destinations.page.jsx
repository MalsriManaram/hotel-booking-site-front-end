import { useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Compass, MapPin, Sparkles } from "lucide-react";
import { useGetHotelsQuery } from "@/lib/api";
import { useCurrency } from "@/lib/currency";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const DESTINATION_GUIDES = [
  {
    city: "Paris",
    country: "France",
    filterKey: "France",
    vibe: "Romance & Haute Gastronomy",
    bestSeason: "April – June & Sept – Oct",
    image: "/assets/grid/215355701.jpg",
    summary:
      "Golden Haussmann boulevards, rooftop views toward the Eiffel Tower, intimate Montmartre bistros, and twilight cruises along the Seine.",
    highlights: [
      "Sunrise café & Sacré-Cœur walk in Montmartre",
      "Private evening Louvre & Tuileries promenade",
      "Michelin rooftop dining overlooking the Seine",
    ],
  },
  {
    city: "Sydney",
    country: "Australia",
    filterKey: "Australia",
    vibe: "Harbour Glamour & Coastal Walks",
    bestSeason: "October – April",
    image: "/assets/hero/hero_1.jpg",
    summary:
      "Sail-lined harbour vistas, architectural icons at Circular Quay, sun-drenched Bondi coastal cliffs, and vibrant waterfront dining.",
    highlights: [
      "Private Opera House & Harbour Bridge sunset sail",
      "Bondi-to-Coogee cliffside ocean walk",
      "Darling Harbour contemporary seafood tasting",
    ],
  },
  {
    city: "Kyoto",
    country: "Japan",
    filterKey: "Japan",
    vibe: "Zen Gardens & Timeless Heritage",
    bestSeason: "March – May & Oct – Nov",
    image: "/assets/grid/489672294.jpg",
    summary:
      "Whispering bamboo groves, lantern-lit Gion teahouses, tranquil temple sanctuaries, and centuries-old kaiseki artistry.",
    highlights: [
      "Early-morning Fushimi Inari torii gate ascent",
      "Private matcha tea ceremony in historic Gion",
      "Arashiyama bamboo forest & Zen garden retreat",
    ],
  },
  {
    city: "Tokyo",
    country: "Japan",
    filterKey: "Japan",
    vibe: "Skyline Luxury & Culinary Craft",
    bestSeason: "March – May & Sept – Nov",
    image: "/assets/grid/308797093.jpg",
    summary:
      "Electric neon skylines paired with serene palace gardens, Ginza flagship ateliers, and the highest concentration of Michelin stars on Earth.",
    highlights: [
      "Tokyo Tower & Imperial Palace East Gardens",
      "Tsukiji artisan sushi breakfast & Ginza boutiques",
      "Panoramic Shibuya Sky & Shinjuku cocktail lounges",
    ],
  },
  {
    city: "Rome & Milan",
    country: "Italy",
    filterKey: "Italy",
    vibe: "Renaissance Grandeur & High Fashion",
    bestSeason: "April – June & Sept – Oct",
    image: "/assets/hero/hero.jpg",
    summary:
      "From the eternal Colosseum and Vatican masterpieces of Rome to Milan's Gothic Duomo spires and Quadrilatero della Moda.",
    highlights: [
      "After-hours Vatican & Colosseum heritage tour",
      "Duomo di Milano rooftop terraces & Galleria arcade",
      "Aperitivo in Brera & candlelit Roman trattorias",
    ],
  },
];

const DestinationsPage = () => {
  const { data: hotels = [] } = useGetHotelsQuery();
  const { formatPrice } = useCurrency();
  const [expandedCity, setExpandedCity] = useState("Paris");

  const getDestinationStats = (filterKey, city) => {
    const matches = hotels.filter(
      (h) =>
        h.location?.toLowerCase().includes(city.split(" ")[0].toLowerCase()) ||
        h.location?.toLowerCase().includes(filterKey.toLowerCase())
    );
    const minPrice =
      matches.length > 0
        ? Math.min(...matches.map((m) => Number(m.price) || 9999))
        : null;
    return {
      count: matches.length,
      minPrice,
    };
  };

  return (
    <main className="min-h-screen pb-16">
      {/* Editorial Hero */}
      <section className="bg-neutral-950 text-white py-16 px-4 md:px-8 border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-[0.22em] text-amber-400 font-semibold flex items-center gap-2">
            <Compass className="h-4 w-4" /> Curated World Dossiers
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold">
            Iconic Destinations & Insider Guides
          </h1>
          <p className="text-neutral-300 max-w-2xl text-sm md:text-base leading-relaxed">
            Hand-selected cities where architectural heritage meets effortless
            modern hospitality. Explore insider highlights and jump straight to
            verified StayLux properties in each region.
          </p>
        </div>
      </section>

      {/* Destinations Editorial Cards */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {DESTINATION_GUIDES.map((dest, idx) => {
            const stats = getDestinationStats(dest.filterKey, dest.city);
            const isExpanded = expandedCity === dest.city;

            return (
              <motion.div
                key={dest.city}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
              >
                <Card className="rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all h-full flex flex-col">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={dest.image}
                      alt={`${dest.city}, ${dest.country}`}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-neutral-950/85 text-amber-300 border-none">
                        {dest.vibe}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white flex items-end justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-neutral-300 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-amber-400" />
                          {dest.country}
                        </p>
                        <h2 className="font-display text-3xl font-bold">
                          {dest.city}
                        </h2>
                      </div>
                      {stats.minPrice && (
                        <div className="text-right">
                          <span className="text-[11px] text-neutral-300 block">
                            From
                          </span>
                          <span className="text-sm font-bold text-amber-300">
                            {formatPrice(stats.minPrice)}/nt
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-5">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-neutral-500">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-amber-600" />
                          Best: {dest.bestSeason}
                        </span>
                        {stats.count > 0 && (
                          <span className="font-semibold text-neutral-800">
                            {stats.count}{" "}
                            {stats.count === 1 ? "Property" : "Properties"}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-neutral-600 leading-relaxed">
                        {dest.summary}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          setExpandedCity(isExpanded ? null : dest.city)
                        }
                        className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        {isExpanded
                          ? "Hide 3-Day Curated Highlights"
                          : "View 3-Day Curated Highlights"}
                      </button>

                      {isExpanded && (
                        <ul className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 space-y-1.5 text-xs text-neutral-800">
                          {dest.highlights.map((item, i) => (
                            <li key={i} className="leading-relaxed">
                              • <strong>Day {i + 1}:</strong> {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <Button
                      asChild
                      className="w-full bg-neutral-950 hover:bg-neutral-800 text-white gap-2 rounded-xl"
                    >
                      <Link
                        to={`/hotels?destination=${encodeURIComponent(
                          dest.filterKey
                        )}`}
                      >
                        Explore {dest.city} Stays
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default DestinationsPage;
