import React from 'react';
import axios from 'axios';
import Image from '../content/Image';
import BookCard from '../content/BookCard';
import { Redirect, Link } from 'react-router-dom';

import { getAuthToken } from '../../services/auth-service';
import handleApiError from '../../services/error-handler';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      profileView: true,
      library: [],
    };
  }

  async getCurrentUserProfile() {
    try {
      const token = getAuthToken();
      const res = await axios.get(`/profile/${this.props.user}`, {
        headers: {
          'x-auth-token': token,
        },
      });
      this.props.setProfile(res.data.profile);
      this.setLibrary(res.data.profile.booksCollection);
    } catch (err) {
      handleApiError(err);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  setLibrary = (library) => {
    this.setState({ library });
  };

  componentDidMount() {
    this.getCurrentUserProfile();
  }

  render() {
    let profile = this.props.profile;
    let booksHeader;

    if (!this.state.isLoading && !profile) {
      return <Redirect to='/edit-profile' />;
    }

    if (this.state.library.length !== 0) {
      booksHeader = <h2 className='mt-5'>My Books Collection</h2>;
    }

    if (profile) {
      return (
        <div className='container'>
          <h1 className='mt-5 mb-5 text-center'>{`Welcome ${profile.user.name}`}</h1>
          <div className='row mb-5'>
            <div className='col-md-5 d-flex flex-column justify-content-around'>
              <Image profile={this.props.profile}></Image>
              <Link to='/edit-profile' className='mt-4'>
                <button type='button' className='btn btn-primary btn-block'>
                  Edit Profile
                </button>
              </Link>
              <Link to='/change-password' className='mt-4'>
                <button
                  type='button'
                  className='btn btn-outline-primary btn-block'
                >
                  Change Password
                </button>
              </Link>
              <Link to='/delete-account' className='mt-2 mb-3'>
                <button
                  type='button'
                  className='btn btn-outline-primary btn-block'
                >
                  Delete Account
                </button>
              </Link>
            </div>
            <div className='col-md-7 d-flex flex-column justify-content-around'>
              <h3>About me</h3>
              <p>{profile.about}</p>
              <h4>Favourite Book</h4>
              <p>{profile.favouriteBook}</p>
              <h4>Favourite Author</h4>
              <p>{profile.favouriteAuthor}</p>
              <h4>Favourite Genre</h4>
              <p>{profile.favouriteGenre}</p>
            </div>
          </div>
          {booksHeader}
          <div className='row mb-5'>
            {this.state.library.map((element, i) => {
              return (
                <BookCard
                  key={i}
                  data={element}
                  profileView={this.state.profileView}
                  setLibrary={this.setLibrary}
                />
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  }
}

export default Dashboard;
