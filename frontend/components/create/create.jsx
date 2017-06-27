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
    this.deleteInput = this.deleteInput.bind(this);
    this.parentState = this;
  }

  createInput(e) {
    e.preventDefault();
    let currentInputs = this.state.formState;

    let p1 = new Promise((resolve, reject) => {
      let newInputNumber = this.findNextNumber(Object.keys(currentInputs));
      resolve(currentInputs[`${newInputNumber}`] =
      {question: "", type: "text", subtype: "equals", input: "", subinputs: {}});
    });

    let p2 = new Promise((resolve, reject) => {
      resolve(localStorage.setItem('formInputs', JSON.stringify(currentInputs)));
    });

    p1.then(() => p2.then(() => this.setState({['formState']: currentInputs})));
  }

  findNextNumber(array) {
    if (array.length < 1) {
      return 1;
    }
    let max = Infinity * -1;
    for (let i = 0; i < array.length; i++) {
      let num = parseInt(array[i]);
      if (num > max) {
        max = num;
      }
    }
    return max + 1;
  }

  deleteInput(input) {
    let currentInputs = this.state.formState;
    delete currentInputs[input];

    let p1 = new Promise((resolve, reject) => {
      resolve(localStorage.setItem('formInputs', JSON.stringify(currentInputs)));
    });

    p1.then(() => this.setState({['formState']: currentInputs}));
  }

  render() {
    let inputs = Object.keys(this.state.formState);
    return (
      <div className='create-container'>
        {inputs.map(input => {
          return (
          <Input key={input} data={this.state.formState[`${input}`]}
            input={input} parentState={this.parentState}/>);
        })}
        <button className='add-input-button' onClick={this.createInput}>
          Add Input
        </button>
      </div>
    );
  }
}

export default Create;
