import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

//Firebase Imports
import firebase from "firebase/app"
import "firebase/auth";
import auth from './Firebase/firebaseAuth';

//Pages imports
import Contacts from "./pages/Contacts";
import Login from './pages/Login';
import AddContacts from './pages/AddContacts';
import PageNotFound from './pages/PageNotFound';
import Header from './Layout/Header';

//import redux stuff;
import { useSelector, useDispatch } from "react-redux"


function App() {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(state => state?.data?.user);

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) {
        dispatch({ type: "SET_USER", user })
        console.log("onAuthStateChange wala", user);
        // history.push("/contacts") Better be commented and onl used for dispatch
      } else {
        dispatch({ type: "SET_USER", user: null })
      }

    })
  }, [user, history])


  return (
    <div className="App">
      <Router>
        <Header />
        <Switch>
          <Route exact path="/contacts" component={Contacts} />
          <Route exact path="/add" component={AddContacts} />
          <Route exact path="/" component={Login} />
          <Route exact path="*" component={PageNotFound} />
        </Switch>
      </Router>

    </div>
  );
}

export default App;
