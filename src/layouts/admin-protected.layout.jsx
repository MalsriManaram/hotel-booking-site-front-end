import { useUser } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";


const AdminProtectedLayout = () => {

  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
            <div className="container mx-auto px-4 py-8 min-h-screen">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {/* Skeleton for Input Fields */}
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-full rounded-lg" />
                    <Skeleton className="h-12 w-full rounded-lg" />
                    <Skeleton className="h-12 w-full rounded-lg" />
                  </div>

                  {/* Skeleton for Text Area */}
                  <div className="space-y-4">
                    <Skeleton className="h-32 w-full rounded-lg" />
                  </div>

                  {/* Skeleton for Select Dropdown */}
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-full rounded-lg" />
                  </div>

                  {/* Skeleton for Button */}
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-40 rounded-lg" />
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Skeleton for Multiple Inputs */}
                  <div className="flex justify-between space-x-4">
                    <div className="flex-1">
                      <Skeleton className="h-12 w-full rounded-lg" />
                    </div>
                    <div className="flex-1">
                      <Skeleton className="h-12 w-full rounded-lg" />
                    </div>
                  </div>

                  {/* Skeleton for Multiple Text Areas */}
                  <div className="space-y-4">
                    <Skeleton className="h-32 w-full rounded-lg" />
                    <Skeleton className="h-32 w-full rounded-lg" />
                  </div>

                  {/* Skeleton for Submit Button */}
                  <div className="flex justify-end">
                    <Skeleton className="h-12 w-32 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
        );
      }

    if (!user || user.publicMetadata?.role !== "admin") {
        return <Navigate to="/" />;
    }   

  return <Outlet />;
};

export default AdminProtectedLayout;