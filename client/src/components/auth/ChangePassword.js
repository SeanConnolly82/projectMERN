import React from 'react';
import AuthServices from '../../services/auth-service';
import { Redirect } from 'react-router-dom';

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        password: null,
        newPassword: null,
        confirmNewPassword: null,
        passwordChanged: null,
      },
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { password, newPassword, confirmNewPassword } = this.state;
    if (newPassword !== confirmNewPassword) {
      console.log("Passwords don't mnatch");
      return;
    }

    try {
      let result = await AuthServices.changePassword(password, newPassword);
      if (result === 'Success') {
        this.setState({ passwordChanged: true });
      }
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    if (this.state.passwordChanged) {
      return <Redirect to='/dashboard' />;
    }

    return (
      <div className='container' onSubmit={this.handleSubmit}>
        <div className='row justify-content-center'>
          <form className='col-10 col-md-6 col-lg-4 mt-5'>
            <div className='form-group'>
              <label>Current Password</label>
              <input
                type='password'
                className='form-control'
                placeholder='Current Password'
                onChange={(e) => this.setState({ password: e.target.value })}
              />
            </div>
            <div className='form-group'>
              <label>New Password</label>
              <input
                type='password'
                className='form-control'
                placeholder='New Password'
                onChange={(e) => this.setState({ newPassword: e.target.value })}
              />
            </div>
            <div className='form-group'>
              <label>Confirm Password</label>
              <input
                type='password'
                className='form-control'
                placeholder='Confirm Password'
                onChange={(e) =>
                  this.setState({ confirmNewPassword: e.target.value })
                }
              />
            </div>
            <div className='d-flex flex-column'>
              <button type='submit' className='btn btn-primary mt-3'>
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default ChangePassword;
