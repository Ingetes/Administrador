// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";

// 👇 IMPORTA SIEMPRE EL CSS (si falta, se rompe el estilo)
import "./index.css";

import AdminAccessPortal from "./IngetesAdmin.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AdminAccessPortal />
  </React.StrictMode>
);
