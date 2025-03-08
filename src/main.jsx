import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";

// import redux store
import { store } from "./lib/store";
import { Provider } from "react-redux";

// import pages
import App from "./App.jsx";
import HomePage from "./pages/home.page";
import SignInPage from "./pages/sign-in.page";
import SignUpPage from "./pages/sign-up.page";
import HotelsPage from "./pages/hotels.page";
import HotelPage from "./pages/hotel.page";
import RootLayout from "./layouts/root-layout.layout";
import MainLayout from "./layouts/main.layout";
import AuthLayout from "./layouts/auth.layout";
import CreateHotelPage from "./pages/create-hotel.page";




createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>

          <Route element={<RootLayout />}> 
            <Route element={<MainLayout />} > 
              <Route path="/" element={<HomePage />} />
              <Route path="/hotels" element={<HotelsPage />} />
              <Route path="/hotels/:id" element={<HotelPage />} /> 
              <Route path="/hotels/create" element={<CreateHotelPage />} /> 
            </Route>

            <Route element={<AuthLayout />}> 
              <Route path="/sign-in" element={<SignInPage />} />
              <Route path="/sign-up" element={<SignUpPage />} />
            </Route>
          </Route>

        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
