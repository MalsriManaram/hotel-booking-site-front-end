import { useUser } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";

const ProtectedLayout = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  console.log(isSignedIn);

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        {/* Profile Section */}
        <div className="absolute border right-0 top-0 left-0 w-full h-96"></div>
        <div className="flex flex-col items-center space-y-4 mt-40">
          <Skeleton className="h-52 w-52 rounded-full" />
          <Skeleton className="h-6 w-48 rounded-lg" />
          <Skeleton className="h-4 w-64 rounded-lg" />
        </div>

        {/* My Bookings Section */}
        <div className="mt-8">
          <Skeleton className="h-8 w-40 rounded-lg mb-4" />
          <div className="space-y-6">
            {/* Booking Card Skeletons */}
            {[...Array(2)].map((_, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg shadow-lg space-y-3"
              >
                <Skeleton className="h-6 w-1/2 rounded-lg" />
                <Skeleton className="h-4 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-1/2 rounded-lg" />
                <Skeleton className="h-4 w-1/3 rounded-lg" />
                <Skeleton className="h-4 w-full rounded-lg" />
                <Skeleton className="h-4 w-2/3 rounded-lg" />
                <Skeleton className="h-4 w-1/4 rounded-lg" />
                <Skeleton className="h-10 w-24 rounded-lg" />
              </div>
            ))}
          </div>
        </div>

        {/* Completed & Canceled Bookings */}
        <div className="mt-8 space-y-4">
          <Skeleton className="h-8 w-40 rounded-lg" />
          <Skeleton className="h-4 w-64 rounded-lg" />
          <Skeleton className="h-8 w-40 rounded-lg" />
          <Skeleton className="h-4 w-64 rounded-lg" />
        </div>

        {/* Footer Section */}
        <div className="mt-12 py-6 border-t text-center">
          <Skeleton className="h-6 w-32 mx-auto rounded-lg" />
          <div className="flex justify-center space-x-4 mt-4">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" />;
  }

  return <Outlet />;
};

export default ProtectedLayout;
