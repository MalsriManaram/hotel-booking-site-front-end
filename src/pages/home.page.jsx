import { motion } from "framer-motion";
import { Link } from "react-router";
import { ArrowRight, Compass, Gift, ShieldCheck, Sparkles } from "lucide-react";
import Hero from "@/components/Hero";
import HotelListings from "@/components/HotelListings";
import { Button } from "@/components/ui/button";
import coverImage from "/assets/hero/cover_image.jpg";

const HomePage = () => {
  return (
    <main>
      {/* Contained Hero Section with Dark Fallback & Editorial Gradient Scrim */}
      <section className="relative overflow-hidden bg-neutral-950">
        <img
          src={coverImage}
          alt="Luxury StayLux Hotel"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-neutral-950/90" />

        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10"
        >
          <Hero />
        </motion.div>
      </section>

      {/* Hotel Listings Section */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
      >
        <HotelListings />
      </motion.div>

      {/* Editorial Signature Banner Linking to Destinations & Offers */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 pb-16">
        <div className="rounded-3xl bg-neutral-950 text-white p-8 md:p-12 grid md:grid-cols-3 gap-8 items-center border border-amber-500/20 shadow-xl">
          <div className="md:col-span-2 space-y-3">
            <span className="text-xs uppercase tracking-[0.2em] text-amber-400 font-semibold">
              The StayLux Privilege
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight">
              Tailored Destinations, Member Offers & Instant WhatsApp Booking
            </h2>
            <p className="text-sm md:text-base text-neutral-300 max-w-2xl leading-relaxed">
              Explore curated city guides across Europe, Asia-Pacific, and Sri Lanka, unlock up to 20% off with seasonal privilege codes, and confirm your suite in seconds with zero upfront card friction.
            </p>
            <div className="flex flex-wrap gap-6 pt-2 text-xs text-neutral-300">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-amber-400" /> 48h Free Cancellation
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-amber-400" /> AI-Matched Sanctuaries
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 md:items-end">
            <Button
              asChild
              size="lg"
              className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold gap-2 w-full sm:w-auto md:w-56"
            >
              <Link to="/offers">
                <Gift className="h-4 w-4" />
                View Exclusive Offers
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-neutral-700 bg-transparent text-white hover:bg-white/10 hover:text-white gap-2 w-full sm:w-auto md:w-56"
            >
              <Link to="/destinations">
                <Compass className="h-4 w-4" />
                Destination Guides
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
