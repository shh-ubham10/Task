import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

import "./index.css";

import { AuthProvider } from "./context/AuthContext";
import { TestProvider } from "./context/TestContext";

createRoot(
  document.getElementById("root")!
).render(
  <StrictMode>
    <AuthProvider>
      <TestProvider>
        <App />
      </TestProvider>
    </AuthProvider>
  </StrictMode>
);