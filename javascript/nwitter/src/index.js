import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import firebase from "./fBase";
import "./styles/global.css";
import "./styles/styles.css";

console.log(firebase);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
