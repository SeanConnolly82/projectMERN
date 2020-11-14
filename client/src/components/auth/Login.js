import React from 'react';
import AuthServices from '../../services/auth-service';
import { Redirect } from 'react-router-dom';


class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: { email: null, password: null },
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { email, password } = this.state;
    const loginResult = await AuthServices.login(email, password);
    if (loginResult === 'Success') {
      this.props.setUser()
      this.props.setLoggedIn(true);
    }
  }

  render() {
    if (this.props.loggedIn) {
      return <Redirect to='/' />;
    } else {
      return (
        <div className='container' onSubmit={this.handleSubmit}>
          <div className='row justify-content-center'>
            <form className='col-10 col-md-6 col-lg-4 mt-5'>
              <div className='form-group'>
                <label>Email address</label>
                <input
                  type='email'
                  className='form-control'
                  placeholder='Enter email'
                  onChange={(e) => this.setState({ email: e.target.value })}
                />
              </div>
              <div className='form-group'>
                <label>Password</label>
                <input
                  type='password'
                  className='form-control'
                  placeholder='Password'
                  onChange={(e) => this.setState({ password: e.target.value })}
                />
              </div>
              <div className='d-flex flex-column'>
                <button type='submit' className='btn btn-primary mt-3'>
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }
  }
}

export default Login;
