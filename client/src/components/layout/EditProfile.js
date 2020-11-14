import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import Uploader from '../utils/Uploader';
import AuthServices from '../../services/auth-service';

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      about: null,
      favouriteBook: null,
      favouriteAuthor: null,
      favouriteGenre: null,
      image: { imageBase64: null, imageFileType: null },
      profileUpdateClick: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(e) {
    e.preventDefault();
    const token = AuthServices.getAuthToken();
    const {
      about,
      favouriteBook,
      favouriteAuthor,
      favouriteGenre,
      image,
    } = this.state;
    // Post Request to submit new profile
    try {
      if (!this.props.profile) {
        await axios.post(
          'http://localhost:3000/profile',
          {
            about,
            favouriteBook,
            favouriteAuthor,
            favouriteGenre,
            image,
          },
          {
            headers: {
              'x-auth-token': token,
            },
          }
        );
      } else if (
        about ||
        favouriteBook ||
        favouriteAuthor ||
        favouriteGenre ||
        image
      ) {
        // Put Request to submit updated profile
        await axios.put(
          'http://localhost:3000/profile',
          {
            about,
            favouriteBook,
            favouriteAuthor,
            favouriteGenre,
            image,
          },
          {
            headers: {
              'x-auth-token': token,
            },
          }
        );
      }
      this.setState({ profileUpdateClick: true });
    } catch (err) {
      console.log(err);
    }
  }

  setImage = (imageBase64, imageFileType) => {
    this.setState({ image: { imageBase64, imageFileType } });
  };

  render() {
    let profile = this.props.profile;
    let greeting = 'Set up your profile';
    let button = 'Submit';

    let profilePlaceholderDefaults = {};

    profilePlaceholderDefaults.about = profile
      ? ''
      : 'Tell us about yourself..';
    profilePlaceholderDefaults.favouriteBook = profile
      ? ''
      : 'What is your favourite book?';
    profilePlaceholderDefaults.favouriteAuthor = profile
      ? ''
      : 'Who is your favourite Author?';
    profilePlaceholderDefaults.favouriteGenre = profile
      ? ''
      : 'What is your favourite Genre?';

    let defaultValues = {};

    defaultValues.about = profile ? profile.about : '';
    defaultValues.favouriteBook = profile ? profile.favouriteBook : '';
    defaultValues.favouriteAuthor = profile ? profile.favouriteAuthor : '';
    defaultValues.favouriteGenre = profile ? profile.favouriteGenre : '';

    if (profile) {
      greeting = 'Update your profile';
      button = 'Update';
    }

    if (this.state.profileUpdateClick) {
      return <Redirect to='/dashboard' />;
    }

    return (
      <div className='container'>
        <h1 className='mt-5 mb-5 text-center'>{greeting}</h1>
        <div className='row mb-5'>
          <div className='col-md-5 d-flex flex-column justify-content-around'>
            <Uploader setImage={this.setImage} profile={this.props.profile} />
          </div>
          <div className='col-md-7 d-flex flex-column justify-content-around'>
            <div className='form-group'>
              <h3>About me</h3>
              <textarea
                type='about'
                className='form-control'
                rows='4'
                defaultValue={defaultValues.about}
                placeholder={profilePlaceholderDefaults.about}
                onChange={(e) => this.setState({ about: e.target.value })}
              />
            </div>
            <div className='form-group'>
              <h3>Favourite Book</h3>
              <input
                type='about'
                className='form-control'
                defaultValue={defaultValues.favouriteBook}
                placeholder={profilePlaceholderDefaults.favouriteBook}
                onChange={(e) =>
                  this.setState({ favouriteBook: e.target.value })
                }
              />
            </div>
            <div className='form-group'>
              <h3>Favourite Author</h3>
              <input
                type='about'
                className='form-control'
                defaultValue={defaultValues.favouriteAuthor}
                placeholder={profilePlaceholderDefaults.favouriteAuthor}
                onChange={(e) =>
                  this.setState({ favouriteAuthor: e.target.value })
                }
              />
            </div>
            <div className='form-group'>
              <h3>Favourite Genre</h3>
              <input
                type='about'
                className='form-control'
                defaultValue={defaultValues.favouriteGenre}
                placeholder={profilePlaceholderDefaults.favouriteGenre}
                onChange={(e) =>
                  this.setState({ favouriteGenre: e.target.value })
                }
              />
            </div>
            <button
              className='btn btn-primary btn-block mt-4 mb-3'
              onClick={this.handleSubmit}
            >
              {button}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default EditProfile;
