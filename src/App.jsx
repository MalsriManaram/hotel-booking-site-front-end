import { useEffect } from "react";
import { BrowserRouter, Link, Route, Routes, useLocation } from "react-router";
import "./index.css";

import { store } from "./lib/store";
import { Provider } from "react-redux";
import { ClerkProvider } from "@clerk/clerk-react";

import RootLayout from "./layouts/root-layout.layout";
import MainLayout from "./layouts/main.layout";
import ProtectedLayout from "./layouts/protected.layout";
import AdminProtectedLayout from "./layouts/admin-protected.layout";

import HomePage from "./pages/home.page";
import ExploreHotelsPage from "./pages/explore-hotels.page";
import DestinationsPage from "./pages/destinations.page";
import OffersPage from "./pages/offers.page";
import FaqPage from "./pages/faq.page";
import SignInPage from "./pages/sign-in.page";
import SignUpPage from "./pages/sign-up.page";
import HotelPage from "./pages/hotel.page";
import CreateHotelPage from "./pages/create-hotel.page";
import AdminDashboardPage from "./pages/admin-dashboard.page";
import AccountPage from "./pages/account-page";
import ContactUs from "./pages/contact-us.page";
import AboutUs from "./pages/about-us.page";
import { Button } from "./components/ui/button";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to .env.local file");
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function NotFoundPage() {
  return (
    <main className="min-h-[65vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
      <span className="text-xs font-mono uppercase tracking-widest text-amber-600 font-semibold">
        404 — Page Not Found
      </span>
      <h1 className="font-display text-4xl md:text-5xl font-bold">
        We Couldn&apos;t Find That Destination
      </h1>
      <p className="text-neutral-600 max-w-md text-sm md:text-base">
        The page you requested may have moved. Explore our curated hotel
        collection or return home.
      </p>
      <div className="flex gap-3 pt-2">
        <Button asChild className="bg-neutral-950 text-white hover:bg-neutral-800">
          <Link to="/">Back to Home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/hotels">Explore Hotels</Link>
        </Button>
      </div>
    </main>
  );
}

const App = () => {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Provider store={store}>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route element={<RootLayout />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/hotels" element={<ExploreHotelsPage />} />
                <Route path="/hotels/:id" element={<HotelPage />} />
                <Route path="/destinations" element={<DestinationsPage />} />
                <Route path="/offers" element={<OffersPage />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/contact-us" element={<ContactUs />} />

                <Route element={<ProtectedLayout />}>
                  <Route path="/account" element={<AccountPage />} />
                </Route>

                <Route element={<AdminProtectedLayout />}>
                  <Route path="/hotels/create" element={<CreateHotelPage />} />
                  <Route path="/admin" element={<AdminDashboardPage />} />
                </Route>

                <Route path="/sign-in" element={<SignInPage />} />
                <Route path="/sign-up" element={<SignUpPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </ClerkProvider>
  );
};

export default App;
