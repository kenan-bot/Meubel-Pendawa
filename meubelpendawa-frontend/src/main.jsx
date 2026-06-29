import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { ProdukProvider } from "./context/ProdukContext";

createRoot(document.getElementById("root")).render(
  <ProdukProvider>
    <App />
  </ProdukProvider>,
);
