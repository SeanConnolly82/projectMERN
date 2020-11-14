import React from 'react';
import axios from 'axios';
import Image from '../content/Image';
import BookCard from '../content/BookCard';
import AuthServices from '../../services/auth-service';
import { Redirect } from 'react-router-dom';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      profileView: true,
      editProfile: null,
      deleteProfile: null,
      numberOfBooks: null,
      image: null,
      imageFileType: null,
    };
    this.setEditProfile = this.setEditProfile.bind(this);
    this.setDeleteProfile = this.setDeleteProfile.bind(this);
  }

  async getCurrentUserProfile() {
    try {
      const token = AuthServices.getAuthToken();
      const res = await axios.get(
        `http://localhost:3000/profile/${this.props.user}`,
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );
      const image = res.data.decodedImage;
      this.props.setProfile(res.data.profile);

      this.setState({
        isLoading: false,
        profileView: true,
        image: image,
        imageFileType: this.props.profile.imageFileType,
        numberOfBooks: this.props.profile.booksCollection.length,
      });
    } catch (err) {
      if (err.response.data.errors[0].msg === 'Profile not found') {
        this.setState({
          isLoading: false,
        });
      } else {
        console.log(err.response);
      }
    }
  };

  setBookCount = () => {
    this.setState({ numberOfBooks: this.state.numberOfBooks - 1 });
  };

  setEditProfile() {
    this.setState({ editProfile: true });
  };

  setDeleteProfile() {
    this.setState({ deleteProfile: true });
  };

  componentDidMount() {
    this.getCurrentUserProfile();
  };

  render() {
    let profile;

    if (this.props.profile) {
      profile = this.props.profile;
    }

    if (!this.state.isLoading && !profile) {
      return <Redirect to='/edit-profile' />;
    }

    if (this.state.editProfile) {
      return (
        <Redirect
          to='/edit-profile'
        />
      );
    }

    if (this.state.deleteProfile) {
      return <Redirect to='/delete-profile' />;
    }

    if (!this.state.isLoading && profile) {
      return (
        <div className='container'>
          <h1 className='mt-5 mb-5 text-center'>{`Welcome ${profile.user.name}`}</h1>
          <div className='row mb-5'>
            <div className='col-md-5 d-flex flex-column justify-content-around'>
              <Image
                image={this.state.image}
                imageFileType={this.state.imageFileType}
              ></Image>
              <button
                type='button'
                className='btn btn-primary btn-block mt-4'
                onClick={this.setEditProfile}
              >
                Edit Profile
              </button>
              <button
                type='button'
                className='btn btn-outline-primary btn-block'
              >
                Change Password
              </button>
              <button
                type='button'
                className='btn btn-outline-primary btn-block mb-3'
                onClick={this.setDeleteProfile}
              >
                Delete Profile
              </button>
            </div>
            <div className='col-md-7 d-flex flex-column justify-content-around'>
              <h3>About me</h3>
              <p>{profile.about}</p>
              <h3>Favourite Book</h3>
              <p>{profile.favouriteBook}</p>
              <h3>Favourite Author</h3>
              <p>{profile.favouriteAuthor}</p>
              <h3>Favourite Genre</h3>
              <p>{profile.favouriteGenre}</p>
            </div>
          </div>
          {this.state.numberOfBooks ? (
            <h2 className='mt-5'>My Books Collection</h2>
          ) : null}
          <div className='row mb-5'>
            {profile.booksCollection.map((element, i) => {
              return (
                <BookCard
                  key={i}
                  data={element}
                  profileView={this.state.profileView}
                  setBookCount={this.setBookCount}
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
