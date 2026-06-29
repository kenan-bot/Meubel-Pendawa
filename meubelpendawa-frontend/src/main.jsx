import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { ProdukProvider } from "./context/ProdukContext";
import { KategoriProvider } from "./context/KategoriContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ProdukProvider>
      <KategoriProvider>
        <App />
      </KategoriProvider>
    </ProdukProvider>
  </StrictMode>
);
