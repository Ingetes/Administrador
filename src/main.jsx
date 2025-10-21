// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import IngetesAdmin from "./IngetesAdmin.jsx";   // <- default import (coincide con el export)
import AdminPortal from "./Portaladmin.jsx";     // <- tu vista completa
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

function render() {
  const hash = window.location.hash || "#ingetes_admin";
  if (hash === "#portal_admin") {
    root.render(<AdminPortal />);       // Vista full-screen del admin
  } else {
    root.render(<IngetesAdmin />);      // Login
  }
}

window.addEventListener("hashchange", render);
render();
