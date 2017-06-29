import React from 'react';
import { hashHistory } from 'react-router';

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
    let createEl = (
      <div className='navbar-button'
        onClick={this.changePath('create')}>Create</div>
    );
    let previewEl = (
      <div className='navbar-button'
        onClick={this.changePath('preview')}>Preview</div>
    );

    let exportEl = (
      <div className='navbar-button'
        onClick={this.changePath('export')}>Export</div>
    );

    if (location.hash.includes('create')) {
      createEl = (<div className='navbar-button selected'
        onClick={this.changePath('create')}>Create</div>);
    } else if(location.hash.includes('preview')) {
      previewEl = (
        <div className='navbar-button selected'
          onClick={this.changePath('preview')}>Preview</div>
      );
    } else if (location.hash.includes('export')) {
      exportEl = (
        <div className='navbar-button selected'
          onClick={this.changePath('export')}>Export</div>
      );
    }

    return(
      <nav className='navbar-container'>
        {createEl}
        {previewEl}
        {exportEl}
      </nav>
    );
  }
}

export default NavBar;
