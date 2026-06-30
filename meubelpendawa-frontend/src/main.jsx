import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { ProdukProvider } from "./context/ProdukContext";
import { KategoriProvider } from "./context/KategoriContext";
import { MerekProvider } from "./context/MerekContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ProdukProvider>
      <KategoriProvider>
        <MerekProvider>
          <App />
        </MerekProvider>
      </KategoriProvider>
    </ProdukProvider>
  </StrictMode>,
);
