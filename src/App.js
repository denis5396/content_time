import React, {useEffect} from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom'
import Login from './components/login/Login'
import Home from './components/Home/home'
import ArticleSite from './components/Article/ArticleSite'
import './App.css';
import UserContextProvider from './contexts/User';

function App() {
  useEffect(() => {
    document.querySelector('body').classList.add('visible-scrollbar')
  }, [])
  return (
    <HashRouter basename='/'>
      <div className="App">
        <Switch>
          <UserContextProvider>
            <Route path='/' exact component={Home} />
            <Route path='/article/:articleId' component={ArticleSite} />
            <Route path='/login' component={Login} />
          </UserContextProvider>
        </Switch>
      </div>
    </HashRouter>
  );
}

export default App;
