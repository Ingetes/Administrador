import React from "react";
import ReactDOM from "react-dom/client";
import IngetesAdmin from "./IngetesAdmin.jsx";
import Portaladmin from "./Portaladmin.jsx";

const root = ReactDOM.createRoot(document.getElementById("root")); // ← solo una vez

function renderRoute() {
  const hash = window.location.hash.replace("#", "");
  if (hash === "/portal_admin") {
    root.render(<Portaladmin />);           // ← re-renderiza, desmonta la vista previa
  } else {
    root.render(<IngetesAdmin />);
  }
}

window.addEventListener("hashchange", renderRoute);
renderRoute(); // primera carga
