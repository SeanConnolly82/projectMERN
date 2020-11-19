import React from 'react';
import { Link } from 'react-router-dom';

import { logout } from '../../services/auth-service';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleLogOut = this.handleLogOut.bind(this);
  }

  handleLogOut() {
    logout();
    this.props.setUser();
    this.props.setLoggedIn(false);
    this.props.setProfile(null);
  }

  render() {
    const loggedInNav = (
      <div className='collapse navbar-collapse' id='navbarNav'>
        <ul className='navbar-nav ml-auto'>
          <li className='ml-2 nav-item'>
            <Link to='/dashboard' className='nav-link'>
              <i className='fas fa-user mr-2'></i>
              MyProfile
            </Link>
          </li>
          <li className='ml-2 nav-item'>
            <Link to='/' className='nav-link' onClick={this.handleLogOut}>
              <i className='fas fa-sign-out-alt mr-2'></i>
              Logout
            </Link>
          </li>
        </ul>
      </div>
    );

    const loggedOutNav = (
      <div className='collapse navbar-collapse' id='navbarNav'>
        <ul className='navbar-nav ml-auto'>
          <li className='ml-2 nav-item'>
            <Link to='/login' className='nav-link'>
              Login
            </Link>
          </li>
          <li className='ml-2 nav-item'>
            <Link to='/register' className='nav-link'>
              Register
            </Link>
          </li>
        </ul>
      </div>
    );

    return (
      <nav className='navbar sticky-top navbar-expand-md navbar-dark bg-dark'>
        <Link to='/' className='navbar-brand'>
          <i className='fas fa-book-reader mr-2'></i>
          The BookShelf
        </Link>
        <button
          className='navbar-toggler'
          data-toggle='collapse'
          data-target='#navbarNav'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        {this.props.loggedIn ? loggedInNav : loggedOutNav}
      </nav>
    );
  }
}

export default Navbar;
