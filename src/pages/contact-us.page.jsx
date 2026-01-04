import React, { useState } from "react";
import { motion } from "framer-motion";
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
} from "react-icons/fa";
import { toast } from "sonner";
import { useCreateContactMutation } from "@/lib/api";

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.06,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, ease: "easeOut" },
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
      toast.success("Message sent successfully!");
      setSent(true);
      reset();
      setTimeout(() => setSent(false), 4000);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <section className="relative py-16 px-4">
      {/* Animated header */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={container}
        className="max-w-7xl mx-auto mb-10 text-center md:text-left"
      >
        <motion.h1
          variants={fadeUp}
          className="text-4xl md:text-5xl font-extrabold"
        >
          Contact <span className="text-[#f7b436]">StayLux</span>
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="text-muted-foreground mt-2 max-w-2xl"
        >
          Questions about bookings, partnerships, or feedback — we’re here to
          help. Fill the form and our friendly team will reply as soon as
          possible.
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={container}
        className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-start"
      >
        {/* LEFT INFO (animated) */}
        <motion.div variants={fadeUp} className="space-y-6">
          <Card className="rounded-3xl p-8 shadow-xl backdrop-blur bg-white/80">
            <motion.div variants={fadeUp} className="flex items-center gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#f7b436] to-[#e79c0f] text-white">
                <FaUser className="text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Customer Support</h3>
                <p className="text-sm text-muted-foreground">
                  Available 24/7 for your convenience
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-6 space-y-4">
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-[#f7b436]" />
                <a href="mailto:support@staylux.com" className="font-medium">
                  support@staylux.com
                </a>
              </div>

              <div className="flex items-center gap-3">
                <FaPhone className="text-[#f7b436]" />
                <a href="tel:+94771231234" className="font-medium">
                  +94 77 123 1234
                </a>
              </div>

              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-[#f7b436]" />
                <span className="text-sm">Colombo, Sri Lanka</span>
              </div>
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-sm text-muted-foreground"
            >
              Follow us for travel inspiration, exclusive offers, and updates.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-4 flex gap-4">
              <FaFacebook className="text-2xl text-blue-600 cursor-pointer" />
              <FaTwitter className="text-2xl text-sky-400 cursor-pointer" />
              <FaInstagram className="text-2xl text-pink-500 cursor-pointer" />
              <FaLinkedin className="text-2xl text-blue-700 cursor-pointer" />
            </motion.div>
          </Card>
        </motion.div>

        {/* RIGHT FORM (animated) */}
        <motion.div variants={fadeUp}>
          <Card className="rounded-3xl p-8 shadow-xl">
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-4 mb-6"
            >
              <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#f7b436] to-[#e79c0f] text-white">
                <FaEnvelope className="!w-6 !h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Send us a message</h3>
                <p className="text-sm text-muted-foreground">
                  We usually reply within 2 hours
                </p>
              </div>
            </motion.div>

            <motion.form
              variants={fadeUp}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <motion.div variants={fadeUp}>
                <Input
                  placeholder="Your name"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </motion.div>

              <motion.div variants={fadeUp}>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </motion.div>

              <motion.div variants={fadeUp}>
                <Textarea
                  rows={5}
                  placeholder="Tell us how we can help you..."
                  {...register("message", { required: "Message is required" })}
                />
                {errors.message && (
                  <p className="text-xs text-red-500">
                    {errors.message.message}
                  </p>
                )}
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>

                {sent && (
                  <p className="text-green-600 text-sm text-center">
                    Thank you! Your message has been sent.
                  </p>
                )}

                <p className="text-xs text-muted-foreground text-center">
                  By submitting this form, you agree to our privacy policy.
                </p>
              </motion.div>
            </motion.form>
          </Card>
        </motion.div>
      </motion.div>

      {/* Animated map section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
        className="max-w-7xl mx-auto mt-6 rounded-3xl overflow-hidden shadow-lg"
      >
        <iframe
          title="Colombo Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63371.3517463306!2d79.821185!3d6.927079!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2593c9b1b6f59%3A0x6b6c7b3baf9e5b1!2sColombo!5e0!3m2!1sen!2slk!4v1700000000000"
          className="w-full h-96 rounded-2xl border shadow-sm"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </motion.div>
    </section>
  );
};

export default ContactUs;
