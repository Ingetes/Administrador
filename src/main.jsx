import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import AdminAccessPortal from "./IngetesAdmin.jsx"; // 👈 este es tu componente exportado por defecto

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AdminAccessPortal />
  </React.StrictMode>
);
