import { useState } from "react";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { useUser } from "@clerk/clerk-react";
import HotelCard from "./HotelCard";
import LocationTab from "./LocationTab";
import {
  useGetHotelsForSearchQueryQuery,
  useGetHotelLocationsQuery,
  useGetWishlistQuery,
} from "@/lib/api";
import { submit, resetSearch } from "@/lib/features/searchSlice";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const AMENITY_FILTERS = [
  "Free Wi-Fi",
  "Restaurant",
  "Swimming Pool",
  "Spa & Wellness",
  "Airport Shuttle",
];

const HotelListings = () => {
  const dispatch = useDispatch();
  const { isSignedIn } = useUser();
  const searchData = useSelector((state) => state.search.searchData);

  const [selectedLocation, setSelectedLocation] = useState("ALL");

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

  const {
    query,
    description,
    rating,
    location: searchLocation,
    price,
    amenities = [],
    checkIn,
    checkOut,
    sortBy = "ai_match",
  } = searchData;

  const locationForQuery =
    searchLocation || (selectedLocation === "ALL" ? undefined : selectedLocation);

  const {
    data: hotels,
    isLoading,
    isError,
    error,
  } = useGetHotelsForSearchQueryQuery({
    query,
    description,
    rating,
    location: locationForQuery,
    price,
    amenities,
    checkIn,
    checkOut,
    sortBy,
  });

  const handleSelectedLocation = (loc) => {
    setSelectedLocation(loc);
    if (searchLocation) {
      dispatch(submit({ location: "" }));
    }
  };

  const toggleAmenity = (amenity) => {
    const current = Array.isArray(amenities) ? amenities : [];
    const next = current.includes(amenity)
      ? current.filter((a) => a !== amenity)
      : [...current, amenity];
    dispatch(submit({ amenities: next }));
  };

  const handleSortChange = (val) => {
    dispatch(submit({ sortBy: val }));
  };

  const hotelList = hotels?.data || hotels || [];
  const hasSearchQuery = Boolean(
    query || description || rating || searchLocation || price || amenities?.length
  );

  return (
    <section className="px-6 md:px-8 py-10 lg:py-16 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            {hasSearchQuery
              ? "AI-Matched Stays For You"
              : "Top Trending Hotels Worldwide"}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            {hasSearchQuery
              ? `Showing ${hotelList.length} curated ${
                  hotelList.length === 1 ? "property" : "properties"
                } matching your preferences.`
              : "Discover luxury hand-picked properties with instant WhatsApp reservation."}
          </p>
        </div>

        {/* Sort Control */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Sort by:
          </span>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-48 bg-white">
              <SelectValue placeholder="Sort results" />
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

      {/* Dynamic Location Tabs + Quick Amenity Chips */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex items-center flex-wrap gap-2">
          {locations.map((loc) => (
            <LocationTab
              key={loc}
              selectedLocation={selectedLocation}
              name={loc}
              onClick={handleSelectedLocation}
            />
          ))}
        </div>

        <div className="flex items-center flex-wrap gap-1.5">
          {AMENITY_FILTERS.map((am) => {
            const active = (amenities || []).includes(am);
            return (
              <button
                key={am}
                type="button"
                onClick={() => toggleAmenity(am)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  active
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}
              >
                {am}
              </button>
            );
          })}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-52 w-full rounded-2xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center my-6">
          <p className="text-red-600 font-medium">
            Unable to load hotel listings ({error?.data?.message || "Check backend connection"}).
          </p>
        </div>
      ) : hotelList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
          {hotelList.map(({ hotel, confidence }) => (
            <motion.div
              key={hotel._id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <HotelCard
                hotel={hotel}
                confidence={confidence}
                isSaved={savedIds.has(String(hotel._id))}
                showConfidence={hasSearchQuery}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border bg-gray-50 p-10 text-center my-6 space-y-3">
          <p className="text-lg font-medium text-gray-700">
            No hotels matched your exact filters.
          </p>
          <p className="text-sm text-muted-foreground">
            Try relaxing your price limit, switching destinations, or clearing filters.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedLocation("ALL");
              dispatch(resetSearch());
            }}
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </section>
  );
};

export default HotelListings;
