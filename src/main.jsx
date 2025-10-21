// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import IngetesAdmin from "./IngetesAdmin.jsx";  // <-- que coincida con el default de arriba
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <IngetesAdmin />
  </React.StrictMode>
);
