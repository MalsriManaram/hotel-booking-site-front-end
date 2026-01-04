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
import ProtectedLayout from "./layouts/protected.layout";
import AdminProtectedLayout from "./layouts/admin-protected.layout";

// import pages
import HomePage from "./pages/home.page";
import SignInPage from "./pages/sign-in.page";
import SignUpPage from "./pages/sign-up.page";
import HotelPage from "./pages/hotel.page";
import CreateHotelPage from "./pages/create-hotel.page";
import AccountPage from "./pages/account-page";
import ContactUs from "./pages/contact-us.page";
import AboutUs from "./pages/about-us.page";


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if(!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to .env.local file");
}

const App = () => {
   return(
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>

            <Route element={<RootLayout />}> 
              <Route element={<MainLayout />} > 

                <Route path="/" element={<HomePage />} />
                <Route path="/hotels/:id" element={<HotelPage />} /> 
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/contact-us" element={<ContactUs />} />


                <Route element={<ProtectedLayout />}>
                  <Route path="/account" element={<AccountPage />} />
                </Route>

                <Route element={<AdminProtectedLayout />}>
                  <Route path="/hotels/create" element={<CreateHotelPage />} /> 
                </Route>

                <Route path="/sign-in" element={<SignInPage />} />
                <Route path="/sign-up" element={<SignUpPage />} />

              </Route>
            </Route>

          </Routes>
        </BrowserRouter>
      </Provider>
    </ClerkProvider>
   );
};

export default App;