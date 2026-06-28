import { Routes, Route, Navigate } from "react-router-dom";

import DriverLayout from "../driver/DriverLayout";
import StatusPengiriman from "../driver/StatusPengiriman";

function DriverRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DriverLayout />}>
        <Route index element={<Navigate to="statuspengiriman" replace />} />

        <Route
          path="statuspengiriman"
          element={<StatusPengiriman />}
        />
      </Route>
    </Routes>
  );
}

export default DriverRoutes;