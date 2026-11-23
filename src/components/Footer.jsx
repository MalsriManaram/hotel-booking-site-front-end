import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";
import { Link } from "react-router";
import { useUser } from "@clerk/clerk-react";
import logo from "/assets/hero/logo.png";

const Footer = () => {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <footer className="bg-neutral-950 text-white pt-12 pb-20 md:pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 text-center sm:text-left gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <img className="h-11 w-auto" src={logo} alt="StayLux Icon" />
              <h2 className="font-display text-2xl font-bold">StayLux</h2>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Curated luxury hotels and suites worldwide. Discover by atmosphere
              and confirm effortlessly via our 24/7 WhatsApp Store desk.
            </p>
          </div>

          {/* Discover */}
          <div>
            <h2 className="text-sm uppercase tracking-wider font-bold text-amber-400">
              Discover
            </h2>
            <ul className="mt-3 text-neutral-400 space-y-2 text-sm">
              <li>
                <Link to="/hotels" className="hover:text-white transition-colors">
                  Explore All Hotels
                </Link>
              </li>
              <li>
                <Link
                  to="/destinations"
                  className="hover:text-white transition-colors"
                >
                  Destinations & Guides
                </Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-white transition-colors">
                  Exclusive Offers & Codes
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  Help Center & FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h2 className="text-sm uppercase tracking-wider font-bold text-amber-400">
              Company
            </h2>
            <ul className="mt-3 text-neutral-400 space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about-us"
                  className="hover:text-white transition-colors"
                >
                  About StayLux
                </Link>
              </li>
              <li>
                <Link
                  to="/contact-us"
                  className="hover:text-white transition-colors"
                >
                  Contact Support
                </Link>
              </li>
              {isAdmin && (
                <>
                  <li>
                    <Link
                      to="/hotels/create"
                      className="hover:text-white transition-colors"
                    >
                      Create Hotel
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin"
                      className="text-amber-400 hover:text-amber-300 font-medium"
                    >
                      Admin Control Center
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Support & WhatsApp Store */}
          <div className="space-y-2.5">
            <h2 className="text-sm uppercase tracking-wider font-bold text-amber-400">
              Reservations Desk
            </h2>
            <p className="text-sm text-neutral-400">support@staylux.com</p>
            <p className="text-sm text-neutral-400">+94 77 123 1234</p>
            <a
              href="https://wa.me/94771231234?text=Hello%20StayLux!%20I%20would%20like%20assistance%20with%20a%20hotel%20reservation."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-lg transition-colors"
            >
              <FaWhatsapp className="h-4 w-4" />
              Chat on WhatsApp Store
            </a>

            <div className="flex justify-center sm:justify-start space-x-4 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-neutral-400 hover:text-white text-lg"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-neutral-400 hover:text-white text-lg"
              >
                <FaTwitter />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-neutral-400 hover:text-white text-lg"
              >
                <FaInstagram />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-neutral-400 hover:text-white text-lg"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-10 pt-6 text-center text-neutral-500 text-xs">
          &copy; {new Date().getFullYear()} StayLux Hospitality. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
