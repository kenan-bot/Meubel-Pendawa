import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { ProdukProvider } from "./context/ProdukContext";
import { KategoriProvider } from "./context/KategoriContext";
import { MerekProvider } from "./context/MerekContext";
import { KaryawanProvider } from "./context/KaryawanContext";
import { LoginLogProvider } from "./context/LoginLogContext";
import { PengirimanProvider } from "./context/PengirimanContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ProdukProvider>
      <KategoriProvider>
        <MerekProvider>
          <KaryawanProvider>
            <LoginLogProvider>
              <PengirimanProvider>
                <App />
              </PengirimanProvider>
            </LoginLogProvider>
          </KaryawanProvider>
        </MerekProvider>
      </KategoriProvider>
    </ProdukProvider>
  </StrictMode>,
);
