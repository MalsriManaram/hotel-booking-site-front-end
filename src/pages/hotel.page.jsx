import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  useGetHotelByIdQuery,
  useGetWishlistQuery,
  useToggleWishlistMutation,
} from "@/lib/api";
import { useCurrency } from "@/lib/currency";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import {
  Check,
  Clock,
  Heart,
  MapPin,
  ShieldCheck,
  Star,
  Users,
  Wifi,
} from "lucide-react";
import { useParams, useNavigate } from "react-router";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import BookingDialog from "@/components/BookingDialog";
import HotelReviews from "@/components/HotelReviews";
import InteractiveMap from "@/components/InteractiveMap";

const FALLBACK_HOTEL_IMAGE = "/assets/grid/308797093.jpg";

export default function HotelPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const { formatPrice } = useCurrency();

  const { data: hotel, isLoading, isError } = useGetHotelByIdQuery(id);
  const { data: wishlistData } = useGetWishlistQuery(undefined, {
    skip: !isSignedIn,
  });
  const [toggleWishlist, { isLoading: isToggling }] =
    useToggleWishlistMutation();

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [preferredRoomType, setPreferredRoomType] = useState("single");

  const isSaved = (wishlistData?.hotelIds || []).includes(String(id));

  const handleFavorite = async () => {
    if (!isSignedIn) {
      toast.info("Please sign in to save hotels to your wishlist");
      navigate("/sign-in");
      return;
    }
    try {
      const res = await toggleWishlist(id).unwrap();
      toast.success(
        res.saved ? "Added to your wishlist" : "Removed from wishlist"
      );
    } catch {
      toast.error("Could not update wishlist");
    }
  };

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 min-h-screen">
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="w-full h-[420px] rounded-2xl" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        </div>
      </main>
    );
  }

  if (isError || !hotel) {
    return (
      <main className="container mx-auto px-4 py-16 text-center space-y-4 min-h-[60vh]">
        <p className="text-xl font-semibold text-red-600">
          Property not found or unavailable.
        </p>
        <Button onClick={() => navigate("/hotels")}>Browse All Hotels</Button>
      </main>
    );
  }

  const gallery =
    hotel.images && hotel.images.length > 0 ? hotel.images : [hotel.image];
  const activeImage =
    gallery[selectedImageIdx] || hotel.image || FALLBACK_HOTEL_IMAGE;
  const amenities =
    hotel.amenities && hotel.amenities.length > 0
      ? hotel.amenities
      : ["Free Wi-Fi", "Restaurant", "Flat-screen TV", "Coffee maker"];
  const roomTypes =
    hotel.roomTypes && hotel.roomTypes.length > 0
      ? hotel.roomTypes
      : [
          {
            type: "single",
            name: "Classic Single Room",
            price: hotel.price,
            capacityAdults: 2,
            capacityChildren: 1,
            totalRooms: 5,
          },
          {
            type: "double",
            name: "Superior Double Room",
            price: Math.round(hotel.price * 1.3),
            capacityAdults: 3,
            capacityChildren: 2,
            totalRooms: 5,
          },
          {
            type: "deluxe",
            name: "Deluxe Panoramic Room",
            price: Math.round(hotel.price * 1.65),
            capacityAdults: 4,
            capacityChildren: 2,
            totalRooms: 3,
          },
          {
            type: "suite",
            name: "Executive Luxury Suite",
            price: Math.round(hotel.price * 2.15),
            capacityAdults: 5,
            capacityChildren: 3,
            totalRooms: 2,
          },
        ];

  const reviewCount = hotel.reviews ? hotel.reviews.toLocaleString() : "0";

  return (
    <motion.main
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-7xl mx-auto px-4 md:px-8 py-8 min-h-screen"
    >
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="relative w-full h-[360px] md:h-[440px] rounded-2xl overflow-hidden shadow-lg bg-neutral-100">
            <img
              src={activeImage}
              alt={hotel.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = FALLBACK_HOTEL_IMAGE;
              }}
              className="w-full h-full object-cover"
            />
            {hotel.tags?.length > 0 && (
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {hotel.tags.map((tag) => (
                  <Badge
                    key={tag}
                    className="bg-neutral-950/85 text-amber-300 border-none"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {gallery.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`relative h-20 w-28 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    selectedImageIdx === idx
                      ? "border-amber-500 scale-[1.02]"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${hotel.name} ${idx + 1}`}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_HOTEL_IMAGE;
                    }}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info & Booking Callout */}
        <div className="space-y-6">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h1 className="font-display text-3xl md:text-5xl font-bold text-neutral-950">
                {hotel.name}
              </h1>
              <div className="flex items-center mt-2 text-neutral-600">
                <MapPin className="h-5 w-5 mr-1.5 text-amber-600 shrink-0" />
                <span>{hotel.location}</span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleFavorite}
              disabled={isToggling}
              className="gap-2 rounded-xl bg-white shrink-0"
            >
              <Heart
                className={`h-4 w-4 ${
                  isSaved ? "fill-red-500 text-red-500" : ""
                }`}
              />
              <span>{isSaved ? "Saved" : "Save"}</span>
            </Button>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-bold text-amber-950">
                {hotel.rating && hotel.rating > 0 ? hotel.rating : "New"}
              </span>
              <span className="text-xs text-amber-900">
                {`(${reviewCount} reviews)`}
              </span>
            </div>
            <Badge
              variant="outline"
              className="gap-1 text-emerald-700 border-emerald-200 bg-emerald-50"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Free cancellation ({hotel.policies?.freeCancellationHours ?? 48}h)
            </Badge>
          </div>

          <p className="text-neutral-700 leading-relaxed">{hotel.description}</p>

          <Card className="rounded-2xl bg-white">
            <CardContent className="p-5">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Wifi className="h-4 w-4 text-amber-600" /> Property Amenities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {amenities.map((item) => (
                  <div
                    key={item}
                    className="flex items-center text-sm text-neutral-700"
                  >
                    <Check className="h-4 w-4 mr-2 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4 text-sm bg-white border border-neutral-200 rounded-2xl p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-600 shrink-0" />
              <span>
                <strong>Check-In:</strong> From{" "}
                {hotel.policies?.checkIn || "14:00"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-600 shrink-0" />
              <span>
                <strong>Check-Out:</strong> Until{" "}
                {hotel.policies?.checkOut || "11:00"}
              </span>
            </div>
          </div>

          {/* High-Contrast Luxury Price & Book Now Action Bar */}
          <div className="flex items-center justify-between gap-4 bg-neutral-950 text-white p-5 rounded-2xl shadow-xl border border-amber-500/25">
            <div>
              <p className="text-xs text-neutral-400">Starting nightly rate</p>
              <p className="text-2xl md:text-3xl font-bold text-amber-400">
                {formatPrice(hotel.price)}
                <span className="text-sm font-normal text-neutral-300">
                  {" "}
                  / night
                </span>
              </p>
            </div>
            <BookingDialog
              hotel={hotel}
              defaultRoomType={preferredRoomType}
              triggerClassName="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold shadow-md px-7"
            />
          </div>
        </div>
      </div>

      {/* Room Categories & Working Interactive Map */}
      <div className="grid lg:grid-cols-3 gap-8 mt-14">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-display text-3xl font-bold">
            Available Room Categories
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {roomTypes.map((rt) => (
              <Card
                key={rt.type}
                onClick={() => setPreferredRoomType(rt.type)}
                className={`rounded-2xl cursor-pointer transition-all bg-white ${
                  preferredRoomType === rt.type
                    ? "border-2 border-amber-500 shadow-md"
                    : "hover:border-neutral-400"
                }`}
              >
                <CardContent className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base">{rt.name}</h3>
                    <Badge variant="secondary" className="capitalize">
                      {rt.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-neutral-500 flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-amber-600" /> Up to{" "}
                    {rt.capacityAdults}{" "}
                    {rt.capacityAdults === 1 ? "Adult" : "Adults"},{" "}
                    {rt.capacityChildren}{" "}
                    {rt.capacityChildren === 1 ? "Child" : "Children"} •{" "}
                    {rt.totalRooms} {rt.totalRooms === 1 ? "room" : "rooms"}
                  </p>
                  <p className="text-xl font-bold pt-1 text-neutral-950">
                    {formatPrice(rt.price)}{" "}
                    <span className="text-xs font-normal text-neutral-500">
                      / night
                    </span>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-display text-3xl font-bold">Location & Map</h2>
          <InteractiveMap
            location={hotel.location}
            title={hotel.name}
            className="h-64"
          />
        </div>
      </div>

      <HotelReviews
        hotelId={id}
        hotelRating={hotel.rating}
        hotelReviewsCount={hotel.reviews}
      />
    </motion.main>
  );
}
