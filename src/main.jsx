import React from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import { Session } from "./Session.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Session />
  </React.StrictMode>,
);
