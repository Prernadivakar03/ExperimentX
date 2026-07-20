
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Preloader from "./components/Preloader";
import SplashScreen from "./pages/SplashScreen";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import VariantA from "./pages/VariantA";
import VariantB from "./pages/VariantB";
import ProtectedRoute from "./components/ProtectedRoute";
import Product from "./pages/Product";
import Pricing from "./pages/Pricing";
import MarketingLayout from "./layouts/MarketingLayout";

function App() {
  // Show preloader only on first visit (per session)
  const [showPreloader, setShowPreloader] = useState(() => {
    return !sessionStorage.getItem("experimentx_preloader_shown");
  });

  const handlePreloaderComplete = () => {
    sessionStorage.setItem("experimentx_preloader_shown", "true");
    setShowPreloader(false);
  };

  // If preloader should be shown, render it; otherwise, render the app routes
  if (showPreloader) {
    return <Preloader onComplete={handlePreloaderComplete} />;
  }

  return (
    <Routes>
      {/* Public marketing pages with shared Navbar & Footer */}
      <Route element={<MarketingLayout />}>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/product" element={<Product />} />
        <Route path="/pricing" element={<Pricing />} />
        {/* Add /solutions, /docs, /about, /contact here later */}
      </Route>

      {/* Auth routes (no navbar/footer) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected app routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/variant-a" element={<VariantA />} />
      <Route path="/variant-b" element={<VariantB />} />
    </Routes>
  );
}

export default App;