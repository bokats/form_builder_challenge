import React from 'react';
import { hashHistory, router } from 'react-router';
import Input from '../input/input';

class Create extends React.Component {
  constructor(props) {
    super(props);
    if (localStorage.formInputs) {
      this.state = {formState: JSON.parse(localStorage.getItem('formInputs'))};
    } else {
      this.state = {formState: {}};
      localStorage.setItem('formInputs',JSON.stringify({}));
    }
    this.createInput = this.createInput.bind(this);
  }

  createInput(e) {
    e.preventDefault();
    let currentInputs = this.state.formState;
    currentInputs[`input${Object.keys(currentInputs).length + 1}`] = {};
    localStorage.setItem('formInputs', JSON.stringify(currentInputs));
    this.setState({['formState']: currentInputs});
  }

  render() {
    let inputs = Object.keys(this.state.formState);
    return (
      <div className='create-container'>
        {inputs.map(input => {
          return (
          <Input key={input} data={this.state.formState.input} input={input}/>);
        })}
        <button className='add-input-button' onClick={this.createInput}>
          Add Input
        </button>
      </div>
    );
  }
}

export default Create;
