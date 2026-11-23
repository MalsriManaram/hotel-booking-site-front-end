import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { FaHotel, FaUsers, FaGlobe, FaStar } from "react-icons/fa";
import ProfileCoverImage from "/assets/hero/hero.jpg";
import AboutUsTeam from "/assets/hero/Team.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const AboutUs = () => {
  return (
    <main className="px-4 md:px-8 py-12">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center md:text-left"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-amber-600 font-semibold">
            Our Heritage & Philosophy
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold mt-1">
            About <span className="text-[#d49a2a]">StayLux</span>
          </h1>
          <p className="mt-3 max-w-2xl text-neutral-600 text-base md:text-lg">
            Redefining luxury travel with curated hotel sanctuaries, intelligent
            discovery, and bespoke human hospitality.
          </p>
        </motion.div>

        {/* Hero Banner */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="relative rounded-3xl overflow-hidden shadow-xl h-[360px] md:h-[420px]"
        >
          <img
            src={ProfileCoverImage}
            alt="Luxury hotel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 flex items-center justify-center">
            <h2 className="font-display text-white text-3xl md:text-5xl font-bold text-center px-6 drop-shadow">
              Experience Luxury Like Never Before
            </h2>
          </div>
        </motion.div>

        {/* Mission */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <Card className="rounded-3xl p-8 md:p-10 bg-neutral-950 text-white border border-amber-500/20 shadow-lg">
            <h3 className="font-display text-3xl font-bold mb-3 text-amber-400">
              Our Mission
            </h3>
            <p className="text-base md:text-lg text-neutral-200 leading-relaxed">
              Founded in 2025, StayLux connects discerning travelers with the
              world’s most exceptional sanctuaries. Combining intelligent
              preference matching with trusted hospitality partnerships, we
              personalize every stay — from serene Kyoto garden retreats to
              iconic Parisian palaces — making luxury travel effortless and
              memorable.
            </p>
          </Card>
        </motion.section>

        {/* Values */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h3 className="font-display text-3xl font-bold mb-8 text-center">
            Why Discerning Travelers Choose StayLux
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <FaStar className="text-amber-500" />,
                title: "Curated Excellence",
                desc: "Every property is vetted for architectural character, comfort, and service.",
              },
              {
                icon: <FaUsers className="text-emerald-600" />,
                title: "24/7 Concierge Desk",
                desc: "Direct WhatsApp & human concierge assistance from reservation to check-out.",
              },
              {
                icon: <FaGlobe className="text-neutral-800" />,
                title: "Global Destinations",
                desc: "Iconic city palaces and coastal retreats across Europe, Asia, and Australia.",
              },
            ].map((item, i) => (
              <Card
                key={i}
                className="p-6 rounded-2xl text-center bg-white shadow-sm hover:shadow-lg transition h-full flex flex-col items-center justify-center"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Team (Symmetric Equal-Height Grid) */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h3 className="font-display text-3xl font-bold mb-8 text-center">
            Our Team
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            <div className="rounded-3xl overflow-hidden shadow-lg min-h-[280px]">
              <img
                src={AboutUsTeam}
                alt="StayLux Team"
                className="w-full h-full object-cover"
              />
            </div>
            <Card className="flex items-center rounded-3xl p-8 bg-white shadow-md h-full">
              <p className="text-base md:text-lg text-neutral-700 leading-relaxed">
                Our multidisciplinary team of travel curators, engineers, and
                hospitality specialists is united by a passion for refined
                guest experiences. We blend thoughtful design, smart discovery,
                and warm human service so every stay feels effortless from the
                first search to farewell breakfast.
              </p>
            </Card>
          </div>
        </motion.section>

        {/* Global Reach */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h3 className="font-display text-3xl font-bold mb-8 text-center">
            Our Global Reach
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="rounded-2xl p-6 text-center bg-white shadow-sm">
              <FaHotel className="text-4xl text-amber-600 mx-auto mb-3" />
              <h4 className="text-xl font-bold">Curated Properties</h4>
              <p className="text-sm text-neutral-500 mt-1">
                Boutique & five-star residences worldwide
              </p>
            </Card>
            <Card className="rounded-2xl p-6 text-center bg-white shadow-sm">
              <FaUsers className="text-4xl text-emerald-600 mx-auto mb-3" />
              <h4 className="text-xl font-bold">24/7 Concierge</h4>
              <p className="text-sm text-neutral-500 mt-1">
                Instant WhatsApp & email travel desk
              </p>
            </Card>
            <Card className="rounded-2xl p-6 text-center bg-white shadow-sm">
              <FaGlobe className="text-4xl text-neutral-800 mx-auto mb-3" />
              <h4 className="text-xl font-bold">Multi-Currency Ease</h4>
              <p className="text-sm text-neutral-500 mt-1">
                Transparent rates in USD, LKR, EUR, AUD & JPY
              </p>
            </Card>
          </div>
        </motion.section>
      </div>
    </main>
  );
};

export default AboutUs;
