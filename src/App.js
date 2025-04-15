import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

import "./App.css";
import "./styles/theme.css";
import AuthPage from "./components/AuthPage";
import AppPage from "./components/AppPage";

function App() {
  

  return(
    <Router>
      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
            <Routes>
        <Route path="/" element={<AuthPage />}/>
          {/* <Route index element={<AuthPage />} /> */}
          <Route path="/app" element={<AppPage />} />
          {/* <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NoPage />} /> */}
        {/* </Route> */}
      </Routes>
        {/* <Switch>
          <Route path="/app">
            <AppPage />
          </Route>
          <Route path="/">
            <AuthPage />
          </Route>
        </Switch> */}
      </div>
    </Router>
  )
 
}

export default App;
