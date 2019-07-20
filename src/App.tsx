import * as React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "@material-ui/core";
import Main from "./pages/Main";
import Admin from "./pages/Admin";

import "./App.css";

export default function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">YouDance</h1>
        </header>

        <Container maxWidth="lg">
          <Route path="/" exact component={Main} />;
          <Route path="/admin" exact component={Admin} />;
        </Container>
      </div>
    </Router>
  );
}
