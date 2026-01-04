import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { FaHotel, FaUsers, FaGlobe, FaStar } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";
import ProfileCoverImage from "/assets/hero/hero.jpg";
import AboutUsTeam from "/assets/hero/Team.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const AboutUs = () => {
  const isLoading = false;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-12 w-1/3 mb-6" />
        <Skeleton className="h-96 w-full rounded-2xl mb-8" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <section className="mx-4 my-10">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center md:text-left"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold">
            About <span className="text-[#f7b436]">StayLux</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Redefining luxury travel with curated hotel experiences and
            world-class service.
          </p>
        </motion.div>

        {/* Hero */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="relative"
        >
          <img
            src={ProfileCoverImage}
            alt="Luxury hotel"
            className="w-full h-[420px] object-cover rounded-3xl shadow-xl"
          />
          <div className="absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center">
            <h2 className="text-white text-3xl md:text-4xl font-bold text-center px-6">
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
          <Card className="rounded-3xl p-10 bg-gradient-to-br from-indigo-50 to-sky-50 shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              Founded in 2025, StayLux connects travelers with the world’s most
              exceptional hotels. Using intelligent recommendations and trusted
              partnerships, we personalize every stay - from serene beach
              escapes to iconic city adventures - making luxury travel
              effortless and accessible.
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
          <h3 className="text-2xl font-semibold mb-8 text-center">
            Why Choose StayLux
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <FaStar className="text-yellow-500" />,
                title: "Premium Quality",
                desc: "Hand-picked hotels that meet the highest standards of luxury.",
              },
              {
                icon: <FaUsers className="text-green-500" />,
                title: "Human Support",
                desc: "Real people available 24/7 to assist with your journey.",
              },
              {
                icon: <FaGlobe className="text-indigo-500" />,
                title: "Global Coverage",
                desc: "Trusted partners across the world’s top destinations.",
              },
            ].map((item, i) => (
              <Card
                key={i}
                className="p-6 rounded-2xl text-center shadow-md hover:shadow-lg transition"
              >
                <div className="text-4xl mb-4 mx-auto">{item.icon}</div>
                <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                <p className="text-muted-foreground">{item.desc}</p>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Team */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h3 className="text-2xl font-semibold mb-8 text-center">Our Team</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <img
              src={AboutUsTeam}
              alt="StayLux Team"
              className="w-full h-72 object-cover rounded-3xl shadow-lg"
            />
            <Card className="flex items-center rounded-3xl p-8 shadow-md h-72  ">
              <p className="text-lg text-gray-700 leading-relaxed">
                Our multidisciplinary team of travel experts, engineers, and
                hospitality specialists is united by a passion for innovation
                and exceptional customer experiences. With decades of combined
                industry knowledge, we blend technology, design, and human
                insight to create seamless journeys from discovery to check-out.
                Together, we’re redefining what it means to explore the world in
                luxury.
              </p>
            </Card>
          </div>
        </motion.section>

        {/* Global Reach + Map */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h3 className="text-2xl font-semibold mb-8 text-center">
            Our Global Reach
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Card className="rounded-2xl p-6 text-center shadow-md">
              <FaHotel className="text-4xl text-indigo-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold">10,000+ Hotels</h4>
              <p className="text-muted-foreground">
                Luxury properties worldwide
              </p>
            </Card>
            <Card className="rounded-2xl p-6 text-center shadow-md">
              <FaUsers className="text-4xl text-green-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold">24/7 Support</h4>
              <p className="text-muted-foreground">
                Always here when you need us
              </p>
            </Card>
            <Card className="rounded-2xl p-6 text-center shadow-md">
              <FaGlobe className="text-4xl text-purple-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold">100+ Countries</h4>
              <p className="text-muted-foreground">
                Across every major continent
              </p>
            </Card>
          </div>
        </motion.section>
      </div>
    </section>
  );
};

export default AboutUs;
