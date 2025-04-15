// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";
import "./styles/theme.css";
import AuthPage from "./components/AuthPage";
import AppPage from "./components/AppPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<AppPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
