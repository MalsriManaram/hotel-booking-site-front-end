import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";

// import pages
import App from "./App.jsx";
import HomePage from "./pages/home.page";
import SignInPage from "./pages/sign-in.page";
import SignUpPage from "./pages/sign-up.page";
import HotelPage from "./pages/hotel.page";
import RootLayout from "./layouts/root-layout.layout";
import MainLayout from "./layouts/main.layout";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/*  Wrap the routes in the RootLayout component */}
        <Route element={<RootLayout />}> 
          <Route element={<MainLayout />} > 
            <Route path="/" element={<HomePage />} />
            <Route path="/hotels/:id" element={<HotelPage />} />  
          </Route>
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
