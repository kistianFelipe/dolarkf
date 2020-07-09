import React, { Component } from 'react';
import './App.css';
import { Switch, Route, withRouter } from 'react-router-dom';
import Landing from './components/landing';

class App extends Component {

  render() {

    return (
      <div className="App" >
        <Switch>
          <Route path="/" component={Landing} />
        </Switch>
      </div>
    )
  }

}

export default withRouter(App);

