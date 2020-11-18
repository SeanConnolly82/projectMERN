import React, { Component } from 'react';

class Image extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {

    if (this.props.profile.image.imageBase64) {
      return (
        <img
          className='img-fluid'
          src={`data:${this.props.profile.image.imageFileType};base64,${this.props.profile.image.imageBase64}`}
          alt='Helpful alt text'
        />
      );
    } else {
      return (
        // add a placeholder image as a default profile picture
        <img
          className='img-fluid'
          src='https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
          alt='Helpful alt text'
        />
      );
    }
  }
}

export default Image;
