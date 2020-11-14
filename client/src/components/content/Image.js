import React, { Component } from 'react';

class Image extends Component {
  constructor(props) {
    super(props);
    this.state = {
      img: null,
    };
  }

  decodeBuffer = () => {
    this.setState({
      img: `data:${this.props.imageFileType};base64,${this.props.image}`,
    });
  };

  componentDidMount() {
    this.decodeBuffer();
  }

  render() {

    if (this.props.image) {
      return (
        <img
          className='img-fluid'
          src={this.state.img}
          alt='Helpful alt text'
        />
      );
    } else {
      return (
        <img
          className='img-fluid'
          src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
          alt='Helpful alt text'
        />
      );
    }
  }
}

export default Image;
