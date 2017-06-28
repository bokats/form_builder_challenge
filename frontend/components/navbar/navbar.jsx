import React from 'react';
import { hashHistory, router } from 'react-router';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
  }

  changeClasses(element) {
    let selectedElement = document.getElementsByClassName('selected')[0];
    if (element === selectedElement) {
      return;
    }
    element.classList.add('selected');
    selectedElement.classList.remove('selected');
  }

  changePath(location) {
    return e => {
      hashHistory.push(`/${location}`);
      this.changeClasses(e.currentTarget);
    };
  }

  render() {
    return(
      <nav className='navbar-container'>
        <div className='navbar-button selected' onClick={this.changePath('create')}>
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
