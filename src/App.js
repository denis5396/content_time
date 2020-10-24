import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom'
import Login from './components/login/Login'
import Home from './components/Home/home'
import './App.css';
import UserContextProvider from './contexts/User';

function App() {
  return (
    <HashRouter basename='/'>
      <div className="App">
        <Switch>
          <UserContextProvider>
            <Route path='/' exact component={Home} />
            <Route path='/login' component={Login} />
          </UserContextProvider>
        </Switch>
      </div>
    </HashRouter>
  );
}

export default App;
