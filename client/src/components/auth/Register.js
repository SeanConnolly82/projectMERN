import React from 'react';
import AuthServices from '../../services/auth-service';
import { Redirect } from 'react-router-dom';


class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: { name: null, email: null, password: null, password2: null },
      registered: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(e) {
    const { name, email, password, password2 } = this.state;
    if (password !== password2) {
      console.log("Passwords don't match");
      return; 
    }
    e.preventDefault();
    const registerResult = await AuthServices.register(name, email, password);
    if (registerResult === "Success") {
      this.setState({ registered: true });
      this.props.setUser();
      this.props.setLoggedIn(true);
    }
  }

  render() {
    if (this.props.loggedIn) {
      return <Redirect to='/edit-profile' />;
    } else {
      return (
        <div className='container' onSubmit={this.handleSubmit}>
          <div className='row justify-content-center'>
            <form className='col-10 col-md-6 col-lg-4 mt-5'>
              <div className='form-group'>
                <label>Name</label>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Enter name'
                  onChange={(e) => this.setState({ name: e.target.value })}
                />
              </div>
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
              <div className='form-group mb-4'>
                <label>Confirm Password</label>
                <input
                  type='password'
                  className='form-control'
                  placeholder='Confirm Password'
                  onChange={(e) => this.setState({ password2: e.target.value })}
                />
              </div>
              <div className='d-flex flex-column'>
                <button type='submit' className='btn btn-primary'>
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }
  }
}

export default Register;
