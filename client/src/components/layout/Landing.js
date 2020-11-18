import React from 'react';
import axios from 'axios';
import BookCard from '../content/BookCard';
import Search from '../content/Search';

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      library: [],
    };
  }

  async getLibrary() {
    try {
      const res = await axios.get('/library');
      this.setLibrary(res.data);
    } catch (err) {
      console.log(err.message);
    }
  }

  setLibrary = (library) => {
    this.setState({ library });
  };

  componentDidMount() {
    this.getLibrary();
  }

  render() {
    let signUpPrompt;

    if (!this.props.loggedIn) {
      signUpPrompt = (
        <h2 className='mt-5 text-center text-muted font-weight-light'>
          Sign up and add books to your collection!
        </h2>
      );
    }

    return (
      <div className='container'>
        <h1 className='mt-5 text-center display-4'>Welcome to the BookShelf</h1>
        {signUpPrompt};
        <Search setLibrary={this.setLibrary} getLibrary={this.getLibrary} />
        <div className='row'>
          {this.state.library.map((element, i) => {
            return (
              <BookCard key={i} data={element} loggedIn={this.props.loggedIn} />
            );
          })}
        </div>
        <div className='row mb-5'></div>
      </div>
    );
  }
}

export default Landing;
