import * as React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Container } from "@material-ui/core";
import Main from "./pages/Main";
import Admin from "./pages/Admin";
import Classify from "./pages/Classify";

import "./App.css";

export default function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Link to="/">
            <h1 className="App-title">YouDance</h1>
          </Link>
        </header>

        <Container maxWidth="lg">
          <Route path="/" exact component={Main} />
          <Route path="/admin" exact component={Admin} />
          <Route path="/classify" component={Classify} />
        </Container>
      </div>
    </Router>
  );
}
