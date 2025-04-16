import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";
import "./styles/theme.css";
import AuthPage from "./components/AuthPage";
import AppPage from "./components/AppPage";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFoundPage from "./components/NotFoundPage"; // Optional

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<AppPage />} />
          </Route>
          {/* Optional: Catch-all route for 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
