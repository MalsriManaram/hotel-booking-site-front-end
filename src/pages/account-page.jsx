import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ProfileCoverImage from "/assets/hero/hero.jpg";
import { motion } from "framer-motion";
import MyBookings from "@/components/Mybookings";

const AccountPage = () => {
  const { user } = useUser();
  const [profileHovered, setProfileHovered] = useState(false);

  return (
       <motion.main
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="min-h-screen"
          >
        <div>
          {/* Profile Cover Image */}
          <div className="relative w-full h-72 md:h-80 flex flex-col items-center overflow-hidden">
            <h1 className="text-3xl md:text-4xl uppercase mt-28 text-white font-bold z-10">
              My Account
            </h1>
            <img
              src={ProfileCoverImage}
              alt="Profile Cover Image"
              className={`absolute left-0 right-0 w-full h-72 md:h-80 object-cover transition-all duration-300 ${
                profileHovered ? "scale-110 blur-sm" : ""
              }`}
            />
          </div>

          {/* Profile Info */}
          <div className="mt-[-60px] md:mt-[-100px]">
            <Dialog>
              <div className="flex flex-col transition-transform transform items-center hover:scale-110" onMouseEnter={() => setProfileHovered(true)} onMouseLeave={() => setProfileHovered(false)}>
                <DialogTrigger>
                  <Avatar
                    className="w-32 h-32 md:w-48 md:h-48 border-4 border-white cursor-pointer" >
                    <AvatarImage src={user?.imageUrl} alt={user?.fullName} />
                    <AvatarFallback>{user?.fullName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </DialogTrigger>
                <h2 className="text-2xl md:text-3xl font-semibold">{user?.fullName}</h2>
                <p className="text-muted-foreground text-md md:text-lg">{user?.emailAddresses[0]?.emailAddress}</p>
              </div>

              {/* Minimal Profile Image Popup */}
              <DialogContent className="bg-transparent shadow-none border-none p-0 w-fit h-fit text-white">
                <Avatar className="w-66 h-66 border-4 border-white mx-auto">
                  <AvatarImage src={user?.imageUrl} alt={user?.fullName} />
                  <AvatarFallback className="text-4xl">
                    {user?.fullName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Booking History */}
        <div className="mx-4 my-5">
           <MyBookings />
        </div>
    </motion.main>
  );
};

export default AccountPage;
