import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { RotateCcw, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import HotelCard from "@/components/HotelCard";
import {
  useGetHotelsForSearchQueryQuery,
  useGetHotelLocationsQuery,
  useGetWishlistQuery,
} from "@/lib/api";
import { useCurrency } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AMENITY_OPTIONS = [
  "Free Wi-Fi",
  "Restaurant",
  "Swimming Pool",
  "Spa & Wellness",
  "Airport Shuttle",
  "Air Conditioning",
  "Coffee maker",
];

const BUDGET_PRESETS = [
  { label: "Any Budget", value: "" },
  { label: "Up to $180", value: "180" },
  { label: "Up to $250", value: "250" },
  { label: "Up to $350", value: "350" },
];

const ExploreHotelsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isSignedIn } = useUser();
  const { formatPrice } = useCurrency();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [selectedLocation, setSelectedLocation] = useState(
    searchParams.get("destination") || "ALL"
  );
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [minRating, setMinRating] = useState(searchParams.get("rating") || "");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sortBy, setSortBy] = useState("ai_match");

  useEffect(() => {
    const dest = searchParams.get("destination");
    if (dest) setSelectedLocation(dest);
  }, [searchParams]);

  const { data: locData } = useGetHotelLocationsQuery();
  const locations = locData?.locations || [
    "ALL",
    "France",
    "Italy",
    "Australia",
    "Japan",
  ];

  const { data: wishlistData } = useGetWishlistQuery(undefined, {
    skip: !isSignedIn,
  });
  const savedIds = new Set(wishlistData?.hotelIds || []);

  const { data: results, isLoading } = useGetHotelsForSearchQueryQuery({
    query: query.trim() || undefined,
    description: query.trim() || undefined,
    location: selectedLocation === "ALL" ? undefined : selectedLocation,
    price: maxPrice ? Number(maxPrice) : undefined,
    rating: minRating ? Number(minRating) : undefined,
    amenities: selectedAmenities,
    sortBy,
  });

  const hotelsList = results?.data || results || [];

  const toggleAmenity = (am) => {
    setSelectedAmenities((prev) =>
      prev.includes(am) ? prev.filter((item) => item !== am) : [...prev, am]
    );
  };

  const handleClearAll = () => {
    setQuery("");
    setSelectedLocation("ALL");
    setMaxPrice("");
    setMinRating("");
    setSelectedAmenities([]);
    setSortBy("ai_match");
    setSearchParams({});
  };

  const hasFilters = Boolean(
    query ||
      selectedLocation !== "ALL" ||
      maxPrice ||
      minRating ||
      selectedAmenities.length > 0
  );

  return (
    <main className="min-h-screen pb-16">
      {/* Editorial Dark Header */}
      <section className="bg-neutral-950 text-white py-14 px-4 md:px-8 border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-[0.22em] text-amber-400 font-semibold">
            Global Collection
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold">
            Explore Luxury Hotels & Suites
          </h1>
          <p className="text-neutral-300 max-w-2xl text-sm md:text-base">
            Search naturally by atmosphere or refine by destination, nightly
            rate, guest rating, and signature amenities.
          </p>

          {/* Search Bar */}
          <div className="pt-3 max-w-3xl flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="h-4 w-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Describe your ideal hotel — e.g. 'Quiet boutique suite near museums'"
                className="h-12 pl-10 bg-white text-neutral-950 border-0"
              />
            </div>
            {hasFilters && (
              <Button
                type="button"
                variant="outline"
                onClick={handleClearAll}
                className="h-12 border-neutral-700 bg-neutral-900 text-white hover:bg-neutral-800 hover:text-white gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content: Sticky Filter Sidebar + Results Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-8 grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Sidebar Filters */}
        <Card className="rounded-2xl p-5 bg-white space-y-6 lg:sticky lg:top-6">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="font-bold text-base flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-amber-600" />
              Refine Stays
            </h2>
            {hasFilters && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs font-semibold text-amber-700 hover:underline"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Destination */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Destination
            </label>
            <div className="flex flex-wrap gap-1.5">
              {locations.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setSelectedLocation(loc)}
                  className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                    selectedLocation === loc
                      ? "bg-neutral-950 text-amber-300 border-neutral-950"
                      : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Nightly Budget */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Max Nightly Rate
            </label>
            <div className="grid grid-cols-2 gap-2">
              {BUDGET_PRESETS.map((b) => (
                <button
                  key={b.label}
                  type="button"
                  onClick={() => setMaxPrice(b.value)}
                  className={`text-xs px-2.5 py-2 rounded-xl border font-medium transition-colors ${
                    maxPrice === b.value
                      ? "bg-amber-50 border-amber-500 text-amber-950 font-semibold"
                      : "bg-white border-neutral-200 text-neutral-700 hover:border-neutral-400"
                  }`}
                >
                  {b.value ? `≤ ${formatPrice(Number(b.value))}` : b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Guest Rating */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Minimum Rating
            </label>
            <div className="flex gap-2">
              {[
                { label: "Any", val: "" },
                { label: "4.5★+", val: "4.5" },
                { label: "4.8★+", val: "4.8" },
              ].map((r) => (
                <button
                  key={r.label}
                  type="button"
                  onClick={() => setMinRating(r.val)}
                  className={`flex-1 text-xs py-2 rounded-xl border font-medium transition-colors ${
                    minRating === r.val
                      ? "bg-neutral-950 text-white border-neutral-950"
                      : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Amenities
            </label>
            <div className="space-y-1.5">
              {AMENITY_OPTIONS.map((am) => {
                const checked = selectedAmenities.includes(am);
                return (
                  <label
                    key={am}
                    className="flex items-center gap-2.5 text-sm text-neutral-700 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAmenity(am)}
                      className="rounded border-neutral-300 accent-neutral-950 h-4 w-4"
                    />
                    <span>{am}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Right Hotel Grid */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-neutral-200 rounded-2xl px-4 py-3">
            <p className="text-sm text-neutral-700 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-600" />
              Showing <strong>{hotelsList.length}</strong> curated{" "}
              {hotelsList.length === 1 ? "property" : "properties"}
              {selectedLocation !== "ALL" && (
                <span>
                  {" "}
                  in <strong>{selectedLocation}</strong>
                </span>
              )}
            </p>

            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500 whitespace-nowrap">
                Sort by:
              </span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ai_match">AI Best Match</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating_desc">Highest Guest Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="space-y-3">
                  <Skeleton className="h-52 w-full rounded-2xl" />
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : hotelsList.length === 0 ? (
            <Card className="rounded-2xl p-12 text-center bg-white space-y-3">
              <h3 className="text-lg font-bold">
                No properties match your active filters
              </h3>
              <p className="text-sm text-neutral-500 max-w-md mx-auto">
                Try broadening your budget or clearing selected amenities to see
                more StayLux hotels.
              </p>
              <Button variant="outline" onClick={handleClearAll}>
                Clear All Filters
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {hotelsList.map(({ hotel, confidence }) => (
                <motion.div
                  key={hotel._id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <HotelCard
                    hotel={hotel}
                    confidence={confidence}
                    isSaved={savedIds.has(String(hotel._id))}
                    showConfidence={Boolean(query.trim())}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default ExploreHotelsPage;
