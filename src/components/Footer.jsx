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
    <footer className="bg-black text-white py-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 text-center md:text-left justify-items-center md:justify-items-start gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <img className="h-12 w-auto" src={logo} alt="StayLux Icon" />
              <h2 className="text-2xl font-bold">StayLux</h2>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              AI-powered luxury staycations worldwide. Reserve effortlessly with instant WhatsApp Store confirmation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-lg font-semibold">Quick Links</h2>
            <ul className="mt-3 text-gray-400 space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="hover:text-white">
                  Contact Us
                </Link>
              </li>
              {isAdmin && (
                <>
                  <li>
                    <Link to="/hotels/create" className="hover:text-white">
                      Create Hotel
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin" className="text-amber-400 hover:text-amber-300">
                      Admin Control Center
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Contact & WhatsApp Store */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Support & WhatsApp Store</h2>
            <p className="text-sm text-gray-400">Email: support@staylux.com</p>
            <p className="text-sm text-gray-400">Phone: +94 77 123 1234</p>
            <a
              href="https://wa.me/94771231234?text=Hello%20StayLux!%20I%20would%20like%20assistance%20with%20a%20hotel%20reservation."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold bg-green-600 hover:bg-green-700 text-white px-3.5 py-2 rounded-lg mt-1 transition-colors"
            >
              <FaWhatsapp className="h-4 w-4" />
              Chat on WhatsApp Store
            </a>
          </div>

          {/* Social Media */}
          <div>
            <h2 className="text-lg font-semibold">Follow Us</h2>
            <div className="flex space-x-4 mt-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-gray-400 hover:text-white text-xl"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-gray-400 hover:text-white text-xl"
              >
                <FaTwitter />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-gray-400 hover:text-white text-xl"
              >
                <FaInstagram />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-gray-400 hover:text-white text-xl"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} StayLux Hospitality. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
