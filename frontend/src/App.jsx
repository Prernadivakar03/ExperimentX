

import { Routes, Route } from "react-router-dom";
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
  return (
    <Routes>
      {/* Public marketing pages with shared Navbar & Footer */}
      <Route element={<MarketingLayout />}>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/product" element={<Product />} />
        <Route path="/pricing" element={<Pricing />} /> 
        {/* Add /pricing, /solutions, /docs, /about, /contact here later */}
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