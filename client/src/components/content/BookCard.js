import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

import { getAuthToken } from '../../services/auth-service';
import handleApiError from '../../services/error-handler';

class BookCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookAdded: null,
      bookRemoved: null,
    };
    this.handleAddBook = this.handleAddBook.bind(this);
    this.handleRemoveBook = this.handleRemoveBook.bind(this);
  }

  async handleAddBook(book) {
    const token = getAuthToken();
    try {
      await axios.put(
        `/profile/my-books`,
        { book },
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );
      this.setState({ bookAdded: true });
    } catch (err) {
      handleApiError(err);
    }
  }

  async handleRemoveBook(book) {
    const token = getAuthToken();
    try {
      await axios.delete(`/profile/my-books/${book}`, {
        headers: {
          'x-auth-token': token,
        },
      });
      this.setState({ bookRemoved: true });
      // set the book count for the dashboard view
      this.props.setBookCount();
    } catch (err) {
      handleApiError(err);
    }
  }

  render() {
    let button;
    let addBook = 'Add to books';

    // add a tick mark when book is added
    if (this.state.bookAdded) {
      addBook = <i className='fas fa-check'></i>;
    }

    // re-render dashboard when a book is removed
    if (this.state.bookRemoved) {
      return <Redirect to='/dashboard' />;
    }

    // button view visible when a user is logged in
    if (!this.props.profileView && this.props.loggedIn) {
      button = (
        <button
          type='button'
          onClick={() => this.handleAddBook(this.props.data._id)}
          className='btn btn-link mt-auto'
        >
          {addBook}
        </button>
      );
    }

    // button view visible on profile page
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
