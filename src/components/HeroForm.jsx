import { useRef, useState } from "react";
import { Sparkles, RotateCcw, SlidersHorizontal, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { submit, resetSearch } from "@/lib/features/searchSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const QUICK_PROMPTS = [
  "Romantic hotel in Paris under $250",
  "Harbour view luxury stay in Sydney",
  "Peaceful garden retreat in Kyoto",
  "Top rated city suite in Tokyo",
];

const HeroForm = () => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const currentSearch = useSelector((state) => state.search.searchData);

  const [query, setQuery] = useState(currentSearch.query || "");
  const [location, setLocation] = useState(currentSearch.location || "");
  const [price, setPrice] = useState(currentSearch.price || "");
  const [rating, setRating] = useState(currentSearch.rating || "");
  const [checkIn, setCheckIn] = useState(currentSearch.checkIn || "");
  const [checkOut, setCheckOut] = useState(currentSearch.checkOut || "");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasActiveFilters = Boolean(
    query.trim() || location.trim() || price || rating || checkIn || checkOut
  );

  const handleSearch = (e) => {
    e.preventDefault();
    if (!hasActiveFilters) {
      toast.info(
        "Enter a destination, vibe, or filter to search — or tap one of the quick prompts!"
      );
      inputRef.current?.focus();
      return;
    }

    dispatch(
      submit({
        query: query.trim(),
        description: query.trim(),
        location: location.trim(),
        price: price ? Number(price) : "",
        rating: rating ? Number(rating) : "",
        checkIn,
        checkOut,
      })
    );
  };

  const handleQuickPrompt = (promptText) => {
    setQuery(promptText);
    dispatch(
      submit({
        query: promptText,
        description: promptText,
        location: "",
        price: "",
        rating: "",
      })
    );
  };

  const handleReset = () => {
    setQuery("");
    setLocation("");
    setPrice("");
    setRating("");
    setCheckIn("");
    setCheckOut("");
    dispatch(resetSearch());
  };

  return (
    <div className="w-full max-w-5xl mt-8 md:mt-10 px-1">
      <form
        onSubmit={handleSearch}
        className="bg-white text-neutral-950 p-4 md:p-5 rounded-2xl shadow-2xl border border-white/60 space-y-3"
      >
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          <div className="relative flex-1">
            <Search className="h-5 w-5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by vibe, city, or budget — e.g. 'Romantic hotel in Paris under $250'"
              className="h-12 pl-11 text-sm sm:text-base text-neutral-950 placeholder:text-neutral-400 border-neutral-200 focus-visible:ring-amber-500"
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAdvanced((prev) => !prev)}
              className="h-12 px-3.5 border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-100"
              title="Toggle optional filters"
            >
              <SlidersHorizontal className="h-4 w-4 mr-1.5" />
              Filters
            </Button>

            {hasActiveFilters && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleReset}
                className="h-12 px-3 text-neutral-600 hover:text-neutral-950"
                title="Reset search"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}

            <Button
              type="submit"
              className="h-12 px-6 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-semibold gap-2 flex-1 md:flex-none"
            >
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>AI Search</span>
            </Button>
          </div>
        </div>

        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-3 border-t border-neutral-200 text-left">
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1 block">
                Destination
              </label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City or Country"
                className="h-10 text-sm text-neutral-950"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1 block">
                Max Price (USD / night)
              </label>
              <Input
                type="number"
                min="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 250"
                className="h-10 text-sm text-neutral-950"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1 block">
                Min Rating (1–5)
              </label>
              <Input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                placeholder="e.g. 4.5"
                className="h-10 text-sm text-neutral-950"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1 block">
                Check-In Date
              </label>
              <Input
                type="date"
                min={new Date().toISOString().slice(0, 10)}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="h-10 text-sm text-neutral-950"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1 block">
                Check-Out Date
              </label>
              <Input
                type="date"
                min={checkIn || new Date().toISOString().slice(0, 10)}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="h-10 text-sm text-neutral-950"
              />
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 pt-1 text-left">
          <span className="text-xs font-semibold text-neutral-500">Try:</span>
          {QUICK_PROMPTS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handleQuickPrompt(item)}
              className="text-xs bg-neutral-100 hover:bg-amber-100 hover:text-amber-950 text-neutral-700 px-2.5 py-1 rounded-full transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
};

export default HeroForm;
