import React from 'react';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';

import { getAuthToken, logout } from '../../services/auth-service';
import handleApiError from '../../services/error-handler';

class DeleteProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userDeleted: null,
    };
    this.handleClickDelete = this.handleClickDelete.bind(this);
  }

  async handleClickDelete() {
    try {
      const token = getAuthToken();
      await axios.delete(`/users/remove-user/${this.props.user}`, {
        headers: {
          'x-auth-token': token,
        },
      });
      logout();
      this.props.setUser();
      this.props.setLoggedIn(false);
      this.props.setProfile(null);
      this.setState({ userDeleted: true });
    } catch (err) {
      handleApiError(err);
    }
  }

  render() {
    if (this.state.userDeleted) {
      return <Redirect to='/'></Redirect>;
    }

    return (
      <div className='container'>
        <h1 className='mt-5 text-center'>
          Are you sure you want to delete your profile?
        </h1>
        <div className='row justify-content-center'>
          <div className='col-md-4'>
            <Link
              to='/edit-profile'
              className='mt-4'
              style={{ textDecoration: 'none' }}
            >
              <button className='btn btn-primary btn-block mt-5'>
                No way, never!
              </button>
            </Link>
            <button
              className='btn btn-outline-primary btn-block mt-3'
              onClick={this.handleClickDelete}
            >
              Delete my Profile
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default DeleteProfile;
