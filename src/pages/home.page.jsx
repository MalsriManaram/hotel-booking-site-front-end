import { motion } from "framer-motion";
import React from "react";
import Hero from "@/components/Hero";
import HotelListings from "@/components/HotelListings";

const HomePage = () => {
  return (
    <main>
      <div className="min-h-fit">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Hero />
        </motion.div>
        
        <img
          src="/assets/hero/cover_image.jpg"
          alt=""
          className="absolute top-0 left-0 w-full h-4/5 object-cover -z-10"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
      >
        <HotelListings />
      </motion.div>
    </main>
  );
};
export default HomePage;