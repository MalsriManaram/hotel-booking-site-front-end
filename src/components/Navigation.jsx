import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { Link } from "react-router";

// import { useSelector } from "react-redux";

// import clerk components
import { SignedOut, SignedIn, UserButton } from "@clerk/clerk-react";

function Navigation(p) {
  // const userSlice = useSelector((state) => state.user);
  // console.log(userSlice);

  return (
    <nav className="z-10 bg-black flex  items-center justify-between px-8 text-white py-4">
      <div className="flex items-center space-x-8">
        <Link to="/" className="text-2xl font-bold ">
          Horizone
        </Link>
        <div className="hidden md:flex space-x-6">
          <Link to={`/`} className="transition-colors">
            Home
          </Link>
          <Link to={`/hotels/create`} className="transition-colors">
            Create Hotel
          </Link>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" className="">
          <Globe className="h-5 w-5 mr-2" />
          EN
        </Button>
        {/* if user signout show this componet */}
        <SignedOut>
          <Button variant="ghost" asChild>
            <Link to="/sign-in">Log In</Link>
          </Button>
          <Button asChild>
            <Link to="/sign-up">Sign Up</Link>
          </Button>
        </SignedOut>
        {/* if user signin show this componet */}
        <SignedIn>
          <UserButton />
          <Button asChild>
            <Link to="/account">My Account</Link>
          </Button>
        </SignedIn>
        
        <div>
          {/* <p>{userSlice.user.name}</p> */}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;