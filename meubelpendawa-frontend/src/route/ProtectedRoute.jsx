import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (location.pathname.startsWith("/owner") && role !== "OWNER") {
    return <Navigate to="/login" replace />;
  }

  if (location.pathname.startsWith("/kasir") && role !== "CASHIER_SALES") {
    return <Navigate to="/login" replace />;
  }

  if (location.pathname.startsWith("/driver") && role !== "DRIVER") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
