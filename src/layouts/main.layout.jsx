import { Outlet } from "react-router";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AIConcierge from "@/components/AIConcierge";

const MainLayout = () => {
  return (
    <>
      <Navigation />
      <Outlet />
      <AIConcierge />
      <Footer />
    </>
  );
};

export default MainLayout;
