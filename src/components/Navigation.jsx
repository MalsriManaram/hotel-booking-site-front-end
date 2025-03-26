import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe, Menu, X } from "lucide-react"; 
import { Link } from "react-router";
import { useUser } from "@clerk/clerk-react";
import logo from "/assets/hero/logo.png";



// import clerk components
import { SignedOut, SignedIn, UserButton } from "@clerk/clerk-react";

function Navigation() {
  
  const {user} = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="z-10 bg-[#000000] flex  items-center justify-between px-8 text-white py-5">
      <div className="flex items-center space-x-9">
      <Link to="/" className="text-2xl font-bold flex items-center space-x-3 transition-transform duration-300 ease-in-out hover:scale-105 ">
        <img className="h-12 w-auto md:h-10 lg:h-12 transition duration-300 ease-in-out  hover:shadow-lg hover:shadow-yellow-500/50 hover:brightness-110" src={logo} alt="StayLux Icon" />
        <span className="hidden md:block ">StayLux</span>
      </Link>
      
      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-8 items-center">
          <Link 
            to={`/`} 
            className="relative text-gray-300 transition-colors duration-300 hover:text-white font-semibold
                      after:content-[''] after:absolute after:left-0 after:bottom-0 
                      after:w-0 after:h-[2px] after:bg-white after:transition-all 
                      after:duration-300 hover:after:w-full"
          >
            Home
          </Link>

          {user?.publicMetadata?.role === "admin" && (
            <Link 
              to={`/hotels/create`} 
              className="relative text-gray-300 transition-colors duration-300 hover:text-white font-semibold
                        after:content-[''] after:absolute after:left-0 after:bottom-0 
                        after:w-0 after:h-[2px] after:bg-white after:transition-all 
                        after:duration-300 hover:after:w-full"
            >
              Create Hotel
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Icon */}
      <div className="md:hidden flex items-center  z-40">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-black p-5 flex flex-col items-center space-y-4 md:hidden z-40">
          <Link 
            to={`/`} 
            className="text-white text-lg transition-colors duration-300 hover:text-yellow-400"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>

          {user?.publicMetadata?.role === "admin" && (
            <Link 
              to={`/hotels/create`} 
              className="text-white text-lg transition-colors duration-300 hover:text-yellow-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              Create Hotel
            </Link>
          )}

          <Button variant="ghost"  >
            <Globe className="h-5 w-5 mr-2" />
            EN
          </Button>
        </div>
      )}


      <div className="flex items-center space-x-4">
        <div className="hidden md:block">
          <Button variant="ghost">
            <Globe className="h-5 w-5 mr-2" />
            EN
          </Button>
        </div>
        {/* if user signout show this componet */}
        <SignedOut>
          <Button variant="ghost" asChild>
            <Link to="/sign-in">Log In</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/sign-up">Sign Up</Link>
          </Button>
        </SignedOut>
        {/* if user signin show this componet */}
        <SignedIn>
          <UserButton />
          <Button variant="ghost" asChild>
            <Link to="/account">My Account</Link>
          </Button>
        </SignedIn>
      </div>
    </nav>
  );
};

export default Navigation;