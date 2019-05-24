import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';
import Index from './pages/index';
import Appbar from './components/appbar';

const css = ({

})
class App extends Component {
  render() {
    return (
      <div className="App">
        <Appbar />
          <Router>
            <Route exact path="/" component={Index} />
          </Router>
      </div>
    )
  }
}
export default withStyles(css)(App);
