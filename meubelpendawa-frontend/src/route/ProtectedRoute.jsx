import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
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
