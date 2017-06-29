import React from 'react';
import { hashHistory } from 'react-router';

class Export extends React.Component {
  constructor(props) {
    super(props);
  }

  convertToJSON() {
    let currentState = JSON.parse(localStorage.getItem('formInputs'));
    let parent = {json: currentState};
    return JSON.stringify(parent);
  }

  render() {
    return (
      <textarea className='json-textarea' defaultValue={this.convertToJSON()}>
      </textarea>
    );
  }
}

export default Export;
