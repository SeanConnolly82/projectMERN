import React from 'react';
import axios from 'axios';
import AuthServices from '../../services/auth-service';
import { Redirect } from 'react-router-dom';

class BookCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookAdded: null,
      bookRemoved: null
    };
    this.handleAddBook = this.handleAddBook.bind(this);
    this.handleRemoveBook = this.handleRemoveBook.bind(this);
  }

  async handleAddBook(book) {
    const token = AuthServices.getAuthToken();
    try {
      await axios.put(
        `/profile/my-books`,
        { book },
        {
          headers: {
            'x-auth-token': token
          },
        }
      );
      this.setState({ bookAdded: true });
    } catch (err) {
      alert(err.response.data);
    }
  }

  async handleRemoveBook(book) {
    const token = AuthServices.getAuthToken();
    try {
      await axios.delete(`/profile/my-books/${book}`, {
        headers: {
          'x-auth-token': token,
        },
      });
      this.setState({ bookRemoved: true });
      this.props.setBookCount();
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    let button;
    let addBook = 'Add to books';

    if (this.state.bookAdded) {
      addBook = <i className="fas fa-check"></i>
    }

    if (this.state.bookRemoved) {
      return <Redirect to='/dashboard' />;
    }

    if (this.props.loggedIn) {
      button = (
        <button
          type='button'
          onClick={(e) => this.handleAddBook(this.props.data._id)}
          className='btn btn-link mt-auto'
        >{addBook}
        </button>
      );
    }

    if (this.props.profileView) {
      button = (
        <button
          type='button'
          onClick={() => this.handleRemoveBook(this.props.data._id)}
          className='btn btn-link mt-auto'
        >
          Remove Book
        </button>
      );
    }

    return (
      <div className='card-deck col-md-6 col-lg-4 col-xl-3 py-2 mt-4'>
        <div className='card text-center'>
          <div className='card-header'>{this.props.data.name}</div>
          <div className='card-body d-flex flex-column'>
            <h6 className='card-subtitle text-muted mt-2'>
              {this.props.data.author}
            </h6>
            <p className='card-text text-left mt-4'>
              {this.props.data.description}
            </p>
            {button}
          </div>
        </div>
      </div>
    );
  }
}

export default BookCard;
