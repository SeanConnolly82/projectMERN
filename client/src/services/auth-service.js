import axios from 'axios';
import handleApiError from './error-handler'

const register = async (name, email, password) => {
  try {
    await axios.post('/users/register', {
      name,
      email,
      password
    });
    // register will call login to give user full access
    return login(email, password);
  } catch (err) {
    handleApiError(err);
  }
};

const login = async (email, password) => {
  try {
    const res = await axios.post('/users/login', {
      email,
      password,
    });
    // add user and token to local storage and return true
    if (res.data.token) {
      localStorage.setItem('user', res.data.user);
      localStorage.setItem('token', res.data.token);
      return true;
    }
    
  } catch (err) {
    handleApiError(err);
  }
};

const changePassword = async (password, newPassword) => {
  const token = getAuthToken();
  try {
    const res = await axios.put(
      '/users/change-password',
      {
        password,
        newPassword,
      },
      {
        headers: {
          'x-auth-token': token,
        },
      }
    );
    if (res.data.msg) return true;
  } catch (err) {
    handleApiError(err);
  }
};

// clear local storage on log out
const logout = () => {
  localStorage.clear();
};

const getCurrentUser = () => {
  return localStorage.getItem('user');
};

const getAuthToken = () => {
  return localStorage.getItem('token');
};

export { register, login,  changePassword, logout, getCurrentUser, getAuthToken };
