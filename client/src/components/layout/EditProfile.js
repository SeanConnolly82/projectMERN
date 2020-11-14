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
      profileUpdated: null,
      image: null,
      imageFileType: null,
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
    } = this.state;
    await axios.put(
      'http://localhost:3000/profile',
      {
        about,
        favouriteBook,
        favouriteAuthor,
        favouriteGenre,
      },
      {
        headers: {
          'x-auth-token': token,
        },
      }
    );
    this.imageUploadHandler();
    this.setState({ profileUpdated: true });
  }

  async imageUploadHandler() {
    const token = AuthServices.getAuthToken();
    try {
      if (!this.state.image) return;
      await axios.put(
        `http://localhost:3000/profile/image-upload/${this.props.user}`,
        {
          file: this.state.image,
          fileType: this.state.imageFileType,
        },
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );
    } catch (err) {
      console.error(err);
    }
  }

  setImage = (image, imageFileType) => {
    this.setState({ image });
    this.setState({ imageFileType });
  };

  render() {

    let profile = this.props.profile;
    let greeting = 'Set up your profile';
    let button = 'Submit';
  

    let profilePlaceholderDefaults = {}
    
    profilePlaceholderDefaults.about = profile ? '' : 'Tell us about yourself..';
    profilePlaceholderDefaults.favouriteBook = profile ? '' : 'What is your favourite book?';
    profilePlaceholderDefaults.favouriteAuthor = profile ? '' : 'Who is your favourite Author?';
    profilePlaceholderDefaults.favouriteGenre = profile ? '' : 'What is your favourite Genre?';

    let defaultValues = {}

    defaultValues.about = profile ? profile.about : '';
    defaultValues.favouriteBook = profile ? profile.favouriteBook : '';
    defaultValues.favouriteAuthor = profile ? profile.favouriteAuthor : '';
    defaultValues.favouriteGenre = profile ? profile.favouriteGenre : '';



    if (profile) {
      //profilePlaceholderDefaults = this.props.profile;
      greeting = 'Update your profile';
      button = 'Update';
    }

    if (this.state.profileUpdated) {
      return <Redirect to='/dashboard' />;
    }

    return (
      <div className='container'>
        <h1 className='mt-5 mb-5 text-center'>{greeting}</h1>
        <div className='row mb-5'>
          <div className='col-md-5 d-flex flex-column justify-content-around'>
            <Uploader setImage={this.setImage} />
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
