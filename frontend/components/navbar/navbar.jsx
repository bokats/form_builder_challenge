import React from 'react';
import { hashHistory, router } from 'react-router';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.changePath = this.changePath.bind(this);
  }

  changePath(location) {
    return e => {
      hashHistory.push(`/${location}`);
    };
  }

  render() {
    return(
      <nav className='navbar-container'>
        <div className='navbar-button' onClick={this.changePath('create')}>
          Create</div>
        <div className='navbar-button' onClick={this.changePath('preview')}>
          Preview</div>
        <div className='navbar-button' onClick={this.changePath('export')}>
          Export</div>
      </nav>
    );
  }
}

export default NavBar;
