import './App.css';
import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from "./components/Home"
import Nav from './components/Nav';
import Projects from './components/Projects';
import Bugs from './components/Bugs';
import Login from './components/Login';
import ProjectsForTesters from './components/ProjectsForTesters';


class App extends Component {
  render() {
    return (
    <BrowserRouter>
    <div className="App">
      <Nav/>
      <Switch>
    <Route path="/home" exact component={Home}/>
    <Route path="/projects" exact component={Projects}/>
    <Route path="/bugs" exact component={Bugs}/>
    <Route path="/" exact component={Login}/>
    <Route path ="/testers" exact component={ProjectsForTesters}></Route>
    </Switch>
    </div>
    </BrowserRouter>
)
  }
}

export default App;
