import { Heart, MapPin, Sparkles, Star } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import { useToggleWishlistMutation } from "@/lib/api";
import { useCurrency } from "@/lib/currency";
import { Badge } from "@/components/ui/badge";

const FALLBACK_HOTEL_IMAGE = "/assets/grid/308797093.jpg";

const HotelCard = ({
  hotel,
  confidence,
  isSaved = false,
  showConfidence = false,
}) => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const [toggleWishlist, { isLoading: isToggling }] =
    useToggleWishlistMutation();
  const { formatPrice } = useCurrency();

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isSignedIn) {
      toast.info("Please sign in to save hotels to your wishlist");
      navigate("/sign-in");
      return;
    }
    try {
      const res = await toggleWishlist(hotel._id).unwrap();
      toast.success(
        res.saved ? `Saved ${hotel.name} to wishlist` : "Removed from wishlist"
      );
    } catch {
      toast.error("Could not update wishlist");
    }
  };

  const reviewCount = hotel.reviews ? hotel.reviews.toLocaleString() : "0";

  return (
    <Link
      to={`/hotels/${hotel._id}`}
      className="group relative bg-white rounded-2xl border border-neutral-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
        <img
          src={hotel.image || FALLBACK_HOTEL_IMAGE}
          alt={hotel.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_HOTEL_IMAGE;
          }}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />

        <button
          type="button"
          onClick={handleWishlistClick}
          disabled={isToggling}
          aria-label="Save to wishlist"
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/95 hover:bg-white shadow-md transition-transform active:scale-95"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isSaved ? "fill-red-500 text-red-500" : "text-neutral-700"
            }`}
          />
        </button>

        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
          {showConfidence && confidence !== undefined && confidence < 1 && (
            <Badge className="bg-neutral-950/85 hover:bg-neutral-950 text-amber-300 border-none flex items-center gap-1 text-xs">
              <Sparkles className="h-3 w-3" />
              {Math.round(confidence * 100)}% Match
            </Badge>
          )}
          {hotel.tags?.[0] && (
            <Badge
              variant="secondary"
              className="bg-white/95 text-neutral-900 font-medium text-xs shadow-xs"
            >
              {hotel.tags[0]}
            </Badge>
          )}
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <h3 className="font-semibold text-lg leading-snug text-neutral-900 group-hover:text-amber-700 transition-colors line-clamp-1">
            {hotel.name}
          </h3>

          <div className="flex items-center text-sm text-neutral-500">
            <MapPin className="h-3.5 w-3.5 mr-1 shrink-0 text-amber-600" />
            <span className="truncate">{hotel.location}</span>
          </div>

          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400 shrink-0" />
            <span className="font-semibold text-neutral-900">
              {hotel?.rating && hotel.rating > 0 ? hotel.rating : "New"}
            </span>
            <span className="text-neutral-500">{`(${reviewCount} reviews)`}</span>
          </div>
        </div>

        <div className="pt-2.5 border-t border-neutral-100 flex items-baseline justify-between">
          <div>
            <span className="text-xs text-neutral-500 block">From</span>
            <span className="text-xl font-bold text-neutral-950">
              {formatPrice(hotel.price)}
            </span>
            <span className="text-xs text-neutral-500"> / night</span>
          </div>
          <span className="text-xs font-semibold text-amber-700 group-hover:translate-x-0.5 transition-transform">
            View Suites →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;
