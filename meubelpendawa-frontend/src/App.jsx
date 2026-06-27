import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Home from "./home/Home";
import FormLogin from "./login/FormLogin";
import OwnerRoutes from "./route/OwnerRoutes";

function App() {

  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<FormLogin />} />
        <Route path="/owner/*" element={<OwnerRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;