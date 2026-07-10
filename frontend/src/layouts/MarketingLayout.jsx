import { Outlet } from "react-router-dom";   // ← this was missing
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MarketingLayout() {
  return (
    <>
      <Navbar />
      <main className="pt-16">   {/* offset for fixed navbar */}
        <Outlet />
      </main>
      <Footer />
    </>
  );
}