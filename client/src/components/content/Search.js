import { Component } from 'react';
import axios from 'axios';

import handleApiError from '../../services/error-handler';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: '',
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  async handleSearch() {
    try {
      const res = await axios.get('/library/search', {
        params: { keyword: this.state.keyword },
      });
      this.props.setLibrary(res.data);
    } catch (err) {
      handleApiError(err);
    }
  }

  handleClear() {
    Array.from(document.querySelectorAll('input')).forEach(
      (input) => (input.value = '')
    );
    this.setState({ keyword: '' });
    this.props.getLibrary();
  }

  render() {
    return (
      <div className='row justify-content-center'>
        <div className='row col-md-8 col-lg-6'>
          <div className='input-group mt-5 mb-4'>
            <input
              type='text'
              className='form-control'
              placeholder='Search the collection...'
              onChange={(e) => this.setState({ keyword: e.target.value })}
            />
            <div className='input-group-append'>
              <button
                className='btn btn-outline-secondary'
                type='button'
                onClick={this.handleSearch}
              >
                Search
              </button>
              <button
                className='btn btn-outline-secondary'
                type='button'
                onClick={this.handleClear}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Search;
