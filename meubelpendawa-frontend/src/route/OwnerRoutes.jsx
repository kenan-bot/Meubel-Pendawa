import { Routes, Route, Navigate } from "react-router-dom";

import OwnerLayout from "../owner/OwnerLayout";
import Dashboard from "../owner/Dashboard";

function OwnerRoutes() {
  return (
    <Routes>
      <Route element={<OwnerLayout />}>
        {/* Ketika akses /owner langsung */}
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<Dashboard />}
        />
      </Route>
    </Routes>
  );
}

export default OwnerRoutes;