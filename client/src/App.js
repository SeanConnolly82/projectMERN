import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import Landing from './components/layout/Landing';
import NavBar from './components/layout/NavBar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/layout/Dashboard';
import EditProfile from './components/layout/EditProfile';
import ChangePassword from './components/auth/ChangePassword';
import DeleteProfile from './components/layout/DeleteProfile';
import FourZeroFour from './components/layout/FourZeroFour';

import { getCurrentUser } from './services/auth-service';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: getCurrentUser(),
      loggedIn: Boolean(getCurrentUser()),
      profile: null,
    };
  }

  // set user will get the user from local storage
  setUser = () => {
    const user = getCurrentUser();
    this.setState({ user });
  };

  // user profile is held in state
  setProfile = (profile) => {
    this.setState({ profile });
  };

  // used to restrict URL access
  setLoggedIn = (loggedIn) => {
    this.setState({ loggedIn });
  };

  render() {
    return (
      <BrowserRouter>
        <NavBar
          user={this.state.user}
          loggedIn={this.state.loggedIn}
          setUser={this.setUser}
          setProfile={this.setProfile}
          setLoggedIn={this.setLoggedIn}
        />
        <Switch>
          <Route
            exact
            path='/'
            component={() => (
              <Landing user={this.state.user} loggedIn={this.state.loggedIn} />
            )}
          />
          <Route
            exact
            path='/login'
            component={() => (
              <Login
                setUser={this.setUser}
                loggedIn={this.state.loggedIn}
                setLoggedIn={this.setLoggedIn}
              />
            )}
          />
          <Route
            exact
            path='/register'
            component={() => (
              <Register
                setUser={this.setUser}
                loggedIn={this.state.loggedIn}
                setLoggedIn={this.setLoggedIn}
              />
            )}
          />
          <Route exact path='/dashboard'>
            {this.state.loggedIn ? (
              <Dashboard
                user={this.state.user}
                profile={this.state.profile}
                setProfile={this.setProfile}
              />
            ) : (
              <Redirect to='/' />
            )}
          </Route>
          <Route exact path='/edit-profile'>
            {this.state.loggedIn ? (
              <EditProfile
                user={this.state.user}
                profile={this.state.profile}
                setProfile={this.setProfile}
              />
            ) : (
              <Redirect to='/' />
            )}
          </Route>
          <Route exact path='/change-password'>
            {this.state.loggedIn ? <ChangePassword /> : <Redirect to='/' />}
          </Route>
          <Route exact path='/delete-account'>
            {this.state.loggedIn ? (
              <DeleteProfile
                user={this.state.user}
                setUser={this.setUser}
                setProfile={this.setProfile}
                setLoggedIn={this.setLoggedIn}
              />
            ) : (
              <Redirect to='/' />
            )}
          </Route>
          <Route component={FourZeroFour} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
