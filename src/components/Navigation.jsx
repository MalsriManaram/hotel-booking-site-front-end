import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe, LayoutDashboard, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useUser, SignedOut, SignedIn, UserButton } from "@clerk/clerk-react";
import { useCurrency } from "@/lib/currency";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import logo from "/assets/hero/logo.png";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/hotels", label: "Hotels" },
  { to: "/destinations", label: "Destinations" },
  { to: "/offers", label: "Offers" },
  { to: "/faq", label: "FAQ" },
  { to: "/about-us", label: "About" },
  { to: "/contact-us", label: "Contact" },
];

function Navigation() {
  const { user } = useUser();
  const { pathname } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const { code, currencies, changeCurrency } = useCurrency();

  const isAdmin = user?.publicMetadata?.role === "admin";

  const isActive = (target) =>
    target === "/" ? pathname === "/" : pathname.startsWith(target);

  return (
    <header className="sticky top-0 z-40 bg-neutral-950 border-b border-white/10 text-white">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 md:px-8 py-3.5">
        <div className="flex items-center gap-6 lg:gap-8">
          <Link
            to="/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <img className="h-10 w-auto" src={logo} alt="StayLux Logo" />
            <span className="font-display text-xl sm:text-2xl font-bold tracking-wide text-white">
              StayLux
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-6 text-sm">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`font-medium transition-colors ${
                  isActive(item.to)
                    ? "text-amber-400 font-semibold"
                    : "text-neutral-300 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {isAdmin && (
              <>
                <Link
                  to="/hotels/create"
                  className={`font-medium transition-colors ${
                    isActive("/hotels/create")
                      ? "text-amber-400 font-semibold"
                      : "text-neutral-300 hover:text-white"
                  }`}
                >
                  Add Hotel
                </Link>
                <Link
                  to="/admin"
                  className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Admin
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Opaque White Currency Selector Popover */}
          <Popover open={currencyOpen} onOpenChange={setCurrencyOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-neutral-200 hover:text-white hover:bg-white/10 gap-1.5 px-2.5"
              >
                <Globe className="h-4 w-4 text-amber-400" />
                <span className="text-xs sm:text-sm font-semibold">{code}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-48 p-2 bg-white text-neutral-950 border border-neutral-200 shadow-2xl"
              align="end"
            >
              <p className="text-[11px] uppercase tracking-wider font-bold text-neutral-500 px-2.5 py-1.5">
                Display Currency
              </p>
              <div className="space-y-1">
                {currencies.map((curr) => (
                  <button
                    key={curr.code}
                    type="button"
                    onClick={() => {
                      changeCurrency(curr.code);
                      setCurrencyOpen(false);
                    }}
                    className={`w-full text-left text-xs px-2.5 py-2 rounded-lg flex justify-between items-center transition-colors ${
                      code === curr.code
                        ? "bg-neutral-950 text-amber-300 font-semibold"
                        : "hover:bg-amber-50 text-neutral-900"
                    }`}
                  >
                    <span>{curr.label}</span>
                    {code === curr.code && <span>✓</span>}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <div className="hidden lg:flex items-center gap-2">
            <SignedOut>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-neutral-200 hover:bg-white/10 hover:text-white"
              >
                <Link to="/sign-in">Log In</Link>
              </Button>
              <Button
                size="sm"
                asChild
                className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold"
              >
                <Link to="/sign-up">Sign Up</Link>
              </Button>
            </SignedOut>
            <SignedIn>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-neutral-200 hover:bg-white/10 hover:text-white"
              >
                <Link to="/account">My Account</Link>
              </Button>
              <UserButton />
            </SignedIn>
          </div>

          {/* Mobile / Tablet Hamburger Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden text-white p-1.5 rounded-lg hover:bg-white/10"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile & Tablet Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-neutral-950 border-t border-neutral-800 px-6 py-5 space-y-3 shadow-2xl">
          <div className="grid grid-cols-2 gap-2.5">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive(item.to)
                    ? "bg-amber-500/15 text-amber-400 font-semibold"
                    : "text-neutral-200 hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {isAdmin && (
              <>
                <Link
                  to="/hotels/create"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm text-neutral-200 hover:bg-white/5"
                >
                  Add Hotel
                </Link>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-semibold text-amber-400 hover:bg-white/5"
                >
                  Admin Panel
                </Link>
              </>
            )}
          </div>

          <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
            <SignedOut>
              <div className="flex gap-2.5 w-full">
                <Button
                  variant="outline"
                  asChild
                  className="flex-1 bg-transparent border-neutral-700 text-white hover:bg-white/10 hover:text-white"
                >
                  <Link to="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                    Log In
                  </Link>
                </Button>
                <Button
                  asChild
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold"
                >
                  <Link to="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </div>
            </SignedOut>

            <SignedIn>
              <Link
                to="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-amber-400 hover:underline"
              >
                My Account & Bookings →
              </Link>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navigation;
