//import React, { Component } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import NavigationBar from './components/NavigationBar'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from './pages/Home.js'
import Login from './pages/Login'
import Producto from './pages/Producto'
import TipoProducto from './pages/TipoProducto'

function App() {
  return (
    <div className="App">
      <br />
      <Router>
        <NavigationBar/>
        <Switch>
          <Route exact path="/">
            <Home/>
          </Route>
          <Route path="/login">
            <Login/>
          </Route>
          <Route path="/producto">
            <Producto/>
          </Route>
          <Route path="/tipo_producto">
            <TipoProducto/>
          </Route>
        </Switch>
      </Router>
    </div>
  )

}

export default App;
