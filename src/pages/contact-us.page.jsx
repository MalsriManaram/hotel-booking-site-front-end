import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import {
  FaEnvelope,
  FaPhone,
  FaUser,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaMapMarkerAlt,
  FaWhatsapp,
} from "react-icons/fa";
import { toast } from "sonner";
import { useCreateContactMutation } from "@/lib/api";
import InteractiveMap from "@/components/InteractiveMap";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const ContactUs = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: "onTouched" });

  const [createContact, { isLoading: isSubmitting }] =
    useCreateContactMutation();
  const [sent, setSent] = useState(false);

  const onSubmit = async (data) => {
    try {
      await createContact(data).unwrap();
      toast.success("Message sent! Our concierge team will reply shortly.");
      setSent(true);
      reset();
      setTimeout(() => setSent(false), 4000);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="py-12 px-4 md:px-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="max-w-7xl mx-auto mb-10 text-center md:text-left"
      >
        <span className="text-xs uppercase tracking-[0.2em] text-amber-600 font-semibold">
          24/7 Hospitality Desk
        </span>
        <h1 className="font-display text-4xl md:text-6xl font-bold mt-1">
          Contact <span className="text-[#d49a2a]">StayLux</span>
        </h1>
        <p className="text-neutral-600 mt-2 max-w-2xl text-base md:text-lg">
          Questions about reservations, bespoke group bookings, or hotel
          partnerships — our dedicated concierge desk is ready to assist.
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Left Support Card (Full Height) */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="h-full">
          <Card className="rounded-3xl p-8 shadow-lg bg-white h-full flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-neutral-950 text-amber-400">
                  <FaUser className="text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Global Concierge Support</h2>
                  <p className="text-sm text-neutral-500">
                    Available 24/7 via phone, email, and WhatsApp Store
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm md:text-base">
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-amber-600 shrink-0" />
                  <a
                    href="mailto:support@staylux.com"
                    className="font-medium hover:text-amber-700"
                  >
                    support@staylux.com
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <FaPhone className="text-amber-600 shrink-0" />
                  <a
                    href="tel:+94771231234"
                    className="font-medium hover:text-amber-700"
                  >
                    +94 77 123 1234
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-amber-600 shrink-0" />
                  <span>Colombo 03, Sri Lanka</span>
                </div>
              </div>

              {/* Direct WhatsApp & FAQ Callout */}
              <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-5 space-y-3">
                <h3 className="font-semibold text-sm text-neutral-900">
                  Need Immediate Reservation Help?
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Chat directly with our reservations desk on WhatsApp for
                  instant room holds, airport transfers, or special celebration
                  requests, or browse our Help & FAQ guide.
                </p>
                <div className="flex flex-wrap gap-2.5 pt-1">
                  <Button
                    asChild
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                  >
                    <a
                      href="https://wa.me/94771231234?text=Hello%20StayLux%20Support!"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaWhatsapp className="h-4 w-4" />
                      Chat on WhatsApp
                    </a>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/faq">Visit Help & FAQ</Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-xs text-neutral-500">
                Follow StayLux Journeys
              </span>
              <div className="flex gap-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="text-xl text-neutral-600 hover:text-neutral-950 transition-colors"
                >
                  <FaFacebook />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="text-xl text-neutral-600 hover:text-neutral-950 transition-colors"
                >
                  <FaTwitter />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-xl text-neutral-600 hover:text-neutral-950 transition-colors"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="text-xl text-neutral-600 hover:text-neutral-950 transition-colors"
                >
                  <FaLinkedin />
                </a>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Right Contact Form Card (Full Height) */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="h-full">
          <Card className="rounded-3xl p-8 shadow-lg bg-white h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-13 h-13 p-3.5 flex items-center justify-center rounded-2xl bg-amber-500 text-neutral-950">
                  <FaEnvelope className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Send Us a Message</h2>
                  <p className="text-sm text-neutral-500">
                    We typically respond within 2 hours
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 mb-1 block">
                    Full Name
                  </label>
                  <Input
                    placeholder="Your full name"
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-700 mb-1 block">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...register("email", { required: "Email is required" })}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-700 mb-1 block">
                    Your Inquiry
                  </label>
                  <Textarea
                    rows={5}
                    placeholder="Tell us how we can tailor your upcoming stay..."
                    {...register("message", {
                      required: "Message is required",
                    })}
                  />
                  {errors.message && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2.5 pt-2">
                  <Button
                    type="submit"
                    className="w-full h-11 bg-neutral-950 hover:bg-neutral-800 text-white font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>

                  {sent && (
                    <p className="text-emerald-700 text-sm text-center font-medium">
                      Thank you! Your message has been received.
                    </p>
                  )}

                  <p className="text-xs text-neutral-500 text-center">
                    Protected by StayLux Guest Privacy Standards.
                  </p>
                </div>
              </form>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Working Interactive Colombo Map */}
      <div className="max-w-7xl mx-auto mt-10">
        <InteractiveMap
          location="Colombo, Sri Lanka"
          title="StayLux Headquarters — Colombo"
          className="h-80 md:h-96"
        />
      </div>
    </main>
  );
};

export default ContactUs;
