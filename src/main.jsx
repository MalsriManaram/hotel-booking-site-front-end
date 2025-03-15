import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";

// import redux store
import { store } from "./lib/store";
import { Provider } from "react-redux";

// import clerk provider
import { ClerkProvider } from "@clerk/clerk-react";

//import layouts
import RootLayout from "./layouts/root-layout.layout";
import MainLayout from "./layouts/main.layout";

// import pages
import App from "./App.jsx";
import HomePage from "./pages/home.page";
import SignInPage from "./pages/sign-in.page";
import SignUpPage from "./pages/sign-up.page";
import HotelsPage from "./pages/hotels.page";
import HotelPage from "./pages/hotel.page";
import CreateHotelPage from "./pages/create-hotel.page";
import AccountPage from "./pages/account-page";
import ProtectedLayout from "./layouts/protected.layout";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if(!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to .env.local file");
}



createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>

            <Route element={<RootLayout />}> 
              <Route element={<MainLayout />} > 

                <Route path="/" element={<HomePage />} />
                <Route path="/hotels" element={<HotelsPage />} />
                <Route path="/hotels/:id" element={<HotelPage />} /> 


                <Route element={<ProtectedLayout />}>
                  <Route path="/account" element={<AccountPage />} />
                  <Route path="/hotels/create" element={<CreateHotelPage />} /> 
                </Route>

              </Route>

                <Route path="/sign-in" element={<SignInPage />} />
                <Route path="/sign-up" element={<SignUpPage />} />

            </Route>

          </Routes>
        </BrowserRouter>
      </Provider>
    </ClerkProvider>
  </StrictMode>
);
