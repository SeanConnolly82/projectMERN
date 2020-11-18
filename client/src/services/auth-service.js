import axios from 'axios';

const register = async (name, email, password) => {
  try {
    await axios.post('/users/register', {
      name,
      email,
      password,
    });
    return await login(email, password);
  } catch (err) {
    console.log(err);
  }
};

const login = async (email, password) => {
  try {
    const res = await axios.post('/users/login', {
      email,
      password,
    });

    if (res.data) {
      localStorage.setItem('user', res.data.user);
      localStorage.setItem('token', res.data.token);
    }
    return 'Success';
  } catch (err) {
    console.log(err);
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

    if (res.data) return 'Success';
  } catch (err) {
    console.log(err);
  }
};

const logout = () => {
  localStorage.clear();
};

const getCurrentUser = () => {
  return localStorage.getItem('user');
};

const getAuthToken = () => {
  return localStorage.getItem('token');
};

export default { register, logout, login, changePassword, getCurrentUser, getAuthToken };
