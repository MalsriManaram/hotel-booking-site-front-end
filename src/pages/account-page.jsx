import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProfileCoverImage from "/assets/hero/hero.jpg";
import { motion } from "framer-motion";
import { Award, CalendarCheck, Heart } from "lucide-react";
import MyBookings from "@/components/Mybookings";
import HotelCard from "@/components/HotelCard";
import {
  useGetWishlistQuery,
  useGetBookingsbyUserIdQuery,
} from "@/lib/api";

const AccountPage = () => {
  const { user } = useUser();
  const [profileHovered, setProfileHovered] = useState(false);
  const [activeTab, setActiveTab] = useState("bookings");

  const { data: wishlistData } = useGetWishlistQuery(undefined, {
    skip: !user?.id,
  });
  const { data: bookingData } = useGetBookingsbyUserIdQuery(user?.id, {
    skip: !user?.id,
  });

  const savedHotels = wishlistData?.hotels || [];
  const bookings = bookingData?.bookings || [];

  // Calculate StayLux Loyalty Points (10 pts per USD spent on non-canceled bookings)
  const validStays = bookings.filter((b) => b.status !== "Canceled");
  const totalSpentUsd = validStays.reduce(
    (sum, b) => sum + (Number(b.payment) || 0),
    0
  );
  const loyaltyPoints = Math.round(totalSpentUsd * 10);
  const loyaltyTier =
    loyaltyPoints >= 15000
      ? { name: "Platinum Elite", next: null, color: "bg-slate-900 text-amber-300" }
      : loyaltyPoints >= 5000
      ? { name: "Gold Member", next: 15000, color: "bg-amber-500 text-white" }
      : loyaltyPoints >= 1500
      ? { name: "Silver Member", next: 5000, color: "bg-gray-300 text-gray-900" }
      : { name: "Classic Member", next: 1500, color: "bg-emerald-600 text-white" };

  return (
    <motion.main
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen pb-16"
    >
      {/* Profile Cover Banner */}
      <div>
        <div className="relative w-full h-64 md:h-72 flex flex-col items-center overflow-hidden">
          <h1 className="text-3xl md:text-4xl uppercase mt-20 text-white font-bold z-10 drop-shadow">
            My Account
          </h1>
          <img
            src={ProfileCoverImage}
            alt="Profile Cover"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${
              profileHovered ? "scale-110 blur-sm" : ""
            }`}
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Avatar & Loyalty Badge */}
        <div className="mt-[-64px] md:mt-[-88px] relative z-10 flex flex-col items-center px-4">
          <Dialog>
            <div
              className="flex flex-col items-center transition-transform hover:scale-105"
              onMouseEnter={() => setProfileHovered(true)}
              onMouseLeave={() => setProfileHovered(false)}
            >
              <DialogTrigger>
                <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-white shadow-lg cursor-pointer">
                  <AvatarImage src={user?.imageUrl} alt={user?.fullName} />
                  <AvatarFallback>{user?.fullName?.charAt(0)}</AvatarFallback>
                </Avatar>
              </DialogTrigger>
              <h2 className="text-2xl md:text-3xl font-bold mt-2">
                {user?.fullName}
              </h2>
              <p className="text-muted-foreground text-sm md:text-base">
                {user?.emailAddresses?.[0]?.emailAddress}
              </p>
              <Badge className={`mt-2 px-3 py-1 ${loyaltyTier.color}`}>
                {loyaltyTier.name} • {loyaltyPoints.toLocaleString()} pts
              </Badge>
            </div>

            <DialogContent className="bg-transparent shadow-none border-none p-0 w-fit h-fit text-white">
              <Avatar className="w-60 h-60 border-4 border-white mx-auto">
                <AvatarImage src={user?.imageUrl} alt={user?.fullName} />
                <AvatarFallback className="text-4xl">
                  {user?.fullName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="flex flex-wrap gap-2 border-b pb-3 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab("bookings")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === "bookings"
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <CalendarCheck className="h-4 w-4" />
            My Bookings ({bookings.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("wishlist")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === "wishlist"
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Heart className="h-4 w-4" />
            Saved Wishlist ({savedHotels.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("loyalty")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === "loyalty"
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Award className="h-4 w-4" />
            StayLux Rewards
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === "bookings" && <MyBookings />}

        {activeTab === "wishlist" && (
          <div>
            {savedHotels.length === 0 ? (
              <Card className="rounded-2xl p-10 text-center bg-gray-50/70 border-dashed">
                <p className="text-lg font-medium text-gray-700">
                  Your wishlist is empty.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Tap the heart icon on any hotel card or property page to save it for later!
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedHotels.map((hotel) => (
                  <HotelCard
                    key={hotel._id}
                    hotel={hotel}
                    isSaved={true}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "loyalty" && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 text-white">
              <CardContent className="p-6 space-y-4">
                <p className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
                  StayLux Loyalty Program
                </p>
                <h3 className="text-3xl font-bold">{loyaltyTier.name}</h3>
                <p className="text-sm text-gray-300">
                  You have earned{" "}
                  <strong className="text-white">
                    {loyaltyPoints.toLocaleString()} points
                  </strong>{" "}
                  across {validStays.length} reservation
                  {validStays.length === 1 ? "" : "s"}.
                </p>
                {loyaltyTier.next && (
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs text-gray-300">
                      <span>Progress to next tier</span>
                      <span>
                        {loyaltyPoints.toLocaleString()} /{" "}
                        {loyaltyTier.next.toLocaleString()} pts
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round((loyaltyPoints / loyaltyTier.next) * 100)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardContent className="p-6 space-y-3">
                <h3 className="text-lg font-bold">Member Exclusive Promo Codes</h3>
                <p className="text-sm text-muted-foreground">
                  Apply these codes inside any hotel Booking Dialog:
                </p>
                <div className="space-y-2 text-sm">
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex justify-between items-center">
                    <span>
                      <strong>STAYLUX10</strong> — 10% off any room
                    </span>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex justify-between items-center">
                    <span>
                      <strong>WELCOME15</strong> — 15% off Deluxe & Suite
                    </span>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex justify-between items-center">
                    <span>
                      <strong>LUXURY20</strong> — 20% off 4+ night stays
                    </span>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </motion.main>
  );
};

export default AccountPage;
