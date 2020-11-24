import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

import Uploader from '../utils/Uploader';

import { getAuthToken } from '../../services/auth-service';
import handleApiError from '../../services/error-handler';

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      about: null,
      favouriteBook: null,
      favouriteAuthor: null,
      favouriteGenre: null,
      image: { imageBase64: null, imageFileType: null },
      profileUpdated: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(e) {
    e.preventDefault();
    const token = getAuthToken();
    const {
      about,
      favouriteBook,
      favouriteAuthor,
      favouriteGenre,
      image,
    } = this.state;
    // post Request to submit new profile if no existing profile
    try {
      if (!this.props.profile) {
        await axios.post(
          '/profile',
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
        // put request to submit updated profile for existing profiles
        await axios.put(
          '/profile',
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
      this.setState({ profileUpdated: true });
    } catch (err) {
      handleApiError(err);
    }
  }

  setImage = (imageBase64, imageFileType) => {
    this.setState({ image: { imageBase64, imageFileType } });
  };

  render() {
    let profile = this.props.profile;
    // default greeting and button text if updating existing profiles
    let greeting = 'Set up your profile';
    let button = 'Submit';

    // initialise the form placeholder values
    let profilePlaceholderDefaults = {
      about: null,
      favouriteBook: null,
      favouriteAuthor: null,
      favouriteGenre: null,
    };

    // update the placeholder values if no profile
    if (!profile) {
      profilePlaceholderDefaults = {
        about: 'Tell us about yourself..',
        favouriteBook: 'What is your favourite book?',
        favouriteAuthor: 'Who is your favourite Author?',
        favouriteGenre: 'What is your favourite Genre?',
      };
    }

    // initialise the default form values
    let defaultValues = {};
    // inherit the current profile as default values if profile exists
    defaultValues.about = profile ? profile.about : null;
    defaultValues.favouriteBook = profile ? profile.favouriteBook : null;
    defaultValues.favouriteAuthor = profile ? profile.favouriteAuthor : null;
    defaultValues.favouriteGenre = profile ? profile.favouriteGenre : null;

    // set greeting and button text if updating existing profiles
    if (profile) {
      greeting = 'Update your profile';
      button = 'Update';
    }
    // redirect to dashboard when the profile is update
    if (this.state.profileUpdated) {
      return <Redirect to='/dashboard' />;
    }

    return (
      <div className='container'>
        <h2 className='mt-5 mb-5 text-center'>{greeting}</h2>
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
              <h4>Favourite Book</h4>
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
              <h4>Favourite Author</h4>
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
              <h4>Favourite Genre</h4>
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
