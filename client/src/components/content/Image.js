import React, { Component } from 'react';
import axios from 'axios';

class Image extends Component {
  constructor(props) {
    super(props);
    this.state = {
      img: null,
    };
  }

  decodeBuffer = () => {
    axios
      .get('http://localhost:3000/profile/image/5fa6d7aba5058f060587b3b1')
      .then((res) => {
        this.setState({
          img: `data:image/jpeg;base64,${res.data}`,
        });
      });
  };

  componentDidMount() {
    this.decodeBuffer();
  }

  render() {
    return (
      <div>
        <img src={this.state.img} alt='Helpful alt text' width='200' />
        <button onClick={this.decodeBuffer}>Click me too!!!</button>
      </div>
    );
  }
}

export default Image;
