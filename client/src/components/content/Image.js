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
      .get('http://localhost:3000/profile/5fa822b9859682052107a27e')
      .then((res) => {
        this.setState({
          img: `data:image/jpeg;base64,${res.data.image}`,
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
