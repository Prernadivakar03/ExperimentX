
import { Routes, Route } from "react-router-dom";
import SplashScreen from "./pages/SplashScreen";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import VariantA from "./pages/VariantA";
import VariantB from "./pages/VariantB";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
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