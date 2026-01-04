import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router";
import { useUser } from "@clerk/clerk-react";
import logo from "/assets/hero/logo.png";

const Footer = () => {
    const { user } = useUser();
  return (
    <footer className="bg-black text-white py-8">
      <div className="w-full max-w-full mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 text-center md:text-left justify-items-center md:justify-items-start gap-6">
          {/* About */}
          <div className="grid grid-cols-1 md:grid-cols-4 justify-items-center md:justify-items-start">
            <div className="flex items-center ">
                <img className="h-16 w-auto md:h-14 lg:h-16 transition duration-300 ease-in-out hover:shadow-lg hover:shadow-yellow-500/50 hover:brightness-110" src={logo} alt="StayLux Icon" />
            </div>
            <div className="col-span-3 md:ml-3">
                <h2 className="text-3xl font-semibold">StayLux</h2>
                <p className="text-lg mt-2 text-gray-400">
                Discover luxury stays worldwide. Book your dream staycation with ease and comfort.
                </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-2xl font-semibold">Quick Links</h2>
            <ul className="mt-2 text-gray-400 space-y-2 text-md">
              <li><Link to={`/`} className="hover:text-white">Home</Link></li>
                {user?.publicMetadata?.role === "admin" && (
                    <li><Link to={`/hotels/create`} className="hover:text-white">Create Hotel</Link></li>
                )}
              <li><Link to={`/about-us`} className="hover:text-white">About Us</Link></li>
              <li><Link to={`/contact-us`} className="hover:text-white">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-2xl font-semibold">Contact</h2>
            <p className="text-md mt-2 text-gray-400">Email: support@staylux.com</p>
            <p className="text-md text-gray-400">Phone: +94 77 123 1234</p>
          </div>

          {/* Social Media */}
          <div>
            <h2 className="text-2xl font-semibold">Follow Us</h2>
            <div className="flex space-x-4 mt-2">
              <a href="#" className="text-gray-400 hover:text-white text-2xl">
                <FaFacebookF />
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-2xl">
                <FaTwitter />
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-2xl">
                <FaInstagram />
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-2xl">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-500 text-sm">
          &copy; 2025 StayLux. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
