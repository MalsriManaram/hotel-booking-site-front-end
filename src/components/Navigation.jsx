import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe, LayoutDashboard, Menu, X } from "lucide-react";
import { Link } from "react-router";
import { useUser, SignedOut, SignedIn, UserButton } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { useCurrency } from "@/lib/currency";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import logo from "/assets/hero/logo.png";

function Navigation() {
  const { user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { code, currencies, changeCurrency } = useCurrency();

  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <nav className="relative z-30 bg-[#000000] flex items-center justify-between px-6 md:px-8 text-white py-4">
        <div className="flex items-center space-x-8">
          <Link
            to="/"
            className="text-2xl font-bold flex items-center space-x-3 transition-transform duration-300 ease-in-out hover:scale-105"
          >
            <img
              className="h-11 w-auto transition duration-300 ease-in-out hover:brightness-110"
              src={logo}
              alt="StayLux Icon"
            />
            <span className="hidden sm:block">StayLux</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-7 items-center text-sm">
            <Link
              to="/"
              className="text-gray-300 hover:text-white font-semibold transition-colors"
            >
              Home
            </Link>

            <Link
              to="/about-us"
              className="text-gray-300 hover:text-white font-semibold transition-colors"
            >
              About Us
            </Link>

            <Link
              to="/contact-us"
              className="text-gray-300 hover:text-white font-semibold transition-colors"
            >
              Contact Us
            </Link>

            {isAdmin && (
              <>
                <Link
                  to="/hotels/create"
                  className="text-gray-300 hover:text-white font-semibold transition-colors"
                >
                  Create Hotel
                </Link>
                <Link
                  to="/admin"
                  className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Admin Panel
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Live Multi-Currency Switcher */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-200 hover:text-white hover:bg-white/10 gap-1.5"
              >
                <Globe className="h-4 w-4 text-amber-400" />
                <span>{code}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-44 p-2" align="end">
              <p className="text-xs font-semibold text-muted-foreground px-2 py-1">
                Display Currency
              </p>
              <div className="space-y-1">
                {currencies.map((curr) => (
                  <button
                    key={curr.code}
                    type="button"
                    onClick={() => changeCurrency(curr.code)}
                    className={`w-full text-left text-xs px-2.5 py-1.5 rounded-md flex justify-between items-center transition-colors ${
                      code === curr.code
                        ? "bg-black text-white font-semibold"
                        : "hover:bg-gray-100 text-gray-800"
                    }`}
                  >
                    <span>{curr.label}</span>
                    {code === curr.code && <span>✓</span>}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <div className="hidden md:flex items-center space-x-2">
            <SignedOut>
              <Button variant="ghost" asChild className="hover:bg-white/10 hover:text-white">
                <Link to="/sign-in">Log In</Link>
              </Button>
              <Button asChild className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">
                <Link to="/sign-up">Sign Up</Link>
              </Button>
            </SignedOut>
            <SignedIn>
              <Button variant="ghost" asChild className="hover:bg-white/10 hover:text-white">
                <Link to="/account">My Account</Link>
              </Button>
              <UserButton />
            </SignedIn>
          </div>

          {/* Mobile Hamburger Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-1"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-black border-t border-gray-800 p-5 flex flex-col items-center space-y-4 md:hidden z-40 shadow-xl">
            <Link
              to="/"
              className="text-white text-base hover:text-amber-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about-us"
              className="text-white text-base hover:text-amber-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              to="/contact-us"
              className="text-white text-base hover:text-amber-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact Us
            </Link>

            {isAdmin && (
              <>
                <Link
                  to="/hotels/create"
                  className="text-white text-base hover:text-amber-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Create Hotel
                </Link>
                <Link
                  to="/admin"
                  className="text-amber-400 font-semibold text-base"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              </>
            )}

            <SignedOut>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" asChild className="text-black">
                  <Link to="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                    Log In
                  </Link>
                </Button>
                <Button asChild className="bg-amber-500 text-black">
                  <Link to="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </div>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center gap-3 pt-2">
                <Link
                  to="/account"
                  className="text-white text-base hover:text-amber-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Account
                </Link>
                <UserButton />
              </div>
            </SignedIn>
          </div>
        )}
      </nav>
    </motion.div>
  );
}

export default Navigation;
