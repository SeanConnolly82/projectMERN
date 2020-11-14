import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import AuthServices from '../../services/auth-service';

class DeleteProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      noDelete: null,
      userDeleted: null
    };
    this.handleClickDelete = this.handleClickDelete.bind(this);
    this.handleClickNo = this.handleClickNo.bind(this);
  }

  async deleteProfile() {
    try {
      const token = AuthServices.getAuthToken();
      await axios.delete(
        `http://localhost:3000/users/remove-user/${this.props.user}`,
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );
      AuthServices.logout();
      this.props.setUser();
      this.props.setLoggedIn(false);
      this.props.setProfile(null);
      this.setState({ userDeleted: true });
    } catch (err) {
      console.log(err.message);
    }
  }

  handleClickDelete() {
    this.deleteProfile();
  }

  handleClickNo() {
    this.setState({ noDelete: true });
  }

  render() {
    if (this.state.userDeleted) {
      return <Redirect to='/'></Redirect>;
    }
    if (this.state.noDelete) {
      return <Redirect to='/dashboard'></Redirect>;
    }

    return (
      <div className='container'>
        <h1 className='mt-5 text-center'>
          Are you sure you want to delete your profile?
        </h1>
        <div className='row justify-content-center'>
          <div className='col-md-4'>
            <button
              className='btn btn-primary btn-block mt-5'
              onClick={this.handleClickNo}
            >
              No way, never!
            </button>
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
