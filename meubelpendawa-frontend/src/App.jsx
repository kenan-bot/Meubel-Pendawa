import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import ProtectedRoute from "./route/ProtectedRoute";

import Home from "./home/Home";
import FormLogin from "./login/FormLogin";
import OwnerRoutes from "./route/OwnerRoutes";
import KasirRoutes from "./route/KasirRoutes";
import DriverRoutes from "./route/DriverRoutes";

function App() {
  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<FormLogin />} />

        {/* Protected */}
        <Route
          path="/owner/*"
          element={
            <ProtectedRoute>
              <OwnerRoutes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/kasir/*"
          element={
            <ProtectedRoute>
              <KasirRoutes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/driver/*"
          element={
            <ProtectedRoute>
              <DriverRoutes />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
