import React from 'react';
import SubInput from './subinput';

class RootInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {question: props.data.question,type: props.data.type,
      subtype: props.data.subtype, input: props.data.input,
      subinputs: props.data.subinputs, error: ""};
    this.updateInput = this.updateInput.bind(this);
    this.addSubInput = this.addSubInput.bind(this);
    this.deleteSelf = this.deleteSelf.bind(this);
    this.deleteChild = this.deleteChild.bind(this);
    this.parentState = this;
  }

  addSubInput(e) {
    e.preventDefault();
    let subInputNumber = this.findNextNumber(Object.keys(this.state.subinputs));

    let newState = JSON.parse(localStorage.getItem('formInputs'));

    newState[this.props.input].subinputs[subInputNumber] =
    {conditionType: this.state.subtype, conditionInput: this.state.input,
      question: "", type: "text", input: "", subtype: "equals", subinputs: {}};

    let p = new Promise((resolve, reject) => {
      resolve(localStorage.setItem('formInputs', JSON.stringify(newState)));
    });

    p.then(() => {
      this.setState({['subinputs']: newState[this.props.input].
      subinputs});
    });
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

  updateInput(field) {
    return e => {
      let value;
      let newState;
      if (typeof e  === "string") {
        value = e;
      } else {
        value = e.currentTarget.value;
      }

      newState = JSON.parse(localStorage.getItem('formInputs'));
      this.updateChildren(newState, field, value);

      newState[this.props.input][`${field}`] = value;

      let p1 = new Promise((resolve, reject) => {
        resolve(localStorage.setItem('formInputs', JSON.stringify(newState)));
      });

      let p2 = new Promise((resolve, reject) => {
        resolve(this.setState({[field]: value}));
      });

      p1.then(() => p2.then(() => {
        this.updateSubType(field, value);
      }));

      if (field === 'type' && value === 'yes/no') {
        this.updateInput('input')('yes');
      } else if (field === 'type' && (this.state.input === 'yes' ||
        this.state.input === 'no')) {
        this.updateInput('input')('');
      } else if (field === 'subtype') {
        this.updateInput('type')('number');
      }
      if (!this.validateInput(field, value)) {
        this.setState({['error']:
          "Please type in numbers in the input field"});
      } else if (this.state.error.length > 0) {
        this.setState({['error']: ""});
      }
    };
  }

  updateSubType(field, value) {
    if (field === 'type' && value !== 'number' &&
    this.state.subtype !== 'equals') {
      let newState = JSON.parse(localStorage.getItem('formInputs'));
      newState[this.props.input]['subtype'] = 'equals';
      let p1 = new Promise((resolve, reject) => {
        resolve(localStorage.setItem('formInputs', JSON.stringify(newState)));
      });
      p1.then(() => this.setState({['subtype']: 'equals'}));
    }
  }

  updateChildren(state, field, value) {
    let childParam;
    if (field === 'input') {
      childParam = 'conditionInput';
    } else if (field === 'subtype') {
      childParam = 'conditionType';
    } else if (field === 'type' && value === 'text') {
      value = 'equals';
      childParam = 'conditionType';
    } else {
      return;
    }

    let keys = Object.keys(state[this.props.input].subinputs);

    for (let i = 0; i < keys.length; i++) {
      state[this.props.input].subinputs[keys[i]][childParam] = value;
    }
  }

  deleteSelf(input) {
    return e => {
      this.props.parentState.deleteInput(input);
    };
  }

  deleteChild(subinput) {
    let newState = JSON.parse(localStorage.getItem('formInputs'));
    delete newState[`${this.props.input}`].subinputs[subinput];

    let p = new Promise((resolve, reject) => {
      resolve(localStorage.setItem('formInputs', JSON.stringify(newState)));
    });

    p.then(() => {
      this.setState({['subinputs']:
        newState[`${this.props.input}`].subinputs});
    });
  }

  validateInput(field, value) {

    if (this.state.type === 'number' && parseInt(value) != value
    && field === 'input') {
        if (value.length > 0 && value !== 'yes') {
          return false;
        } else {
          return true;
        }
    } else if (field === 'type' && value === 'number'
      && parseInt(this.state.input) != this.state.input) {
      if (this.state.input.length > 0 && this.state.input !== 'no' &&
        this.state.input !== 'yes') {
        return false;
      } else {
        return true;
      }
    }
    return true;
  }

  checkSubtype() {
    let subtype;
    if (this.state.type === "number") {
      subtype = (
        <label className='secondary-section'>Sub-Type
          <select value={this.state.subtype} onChange={this.updateInput('subtype')}
            className='dropdown-box subtype'>
            <option value="greater-than">Greater than</option>
            <option value="equals">Equals</option>
            <option value="less-than">Less than</option>
          </select>
        </label>
      );
    }
    return subtype;
  }

  checkInput() {
    let input;
    if (this.state.type === 'yes/no') {
      input = (
        <select value={this.state.input} onChange={this.updateInput('input')}
          className='dropdown-box input'>
          <option value='yes'>Yes</option>
          <option value='no'>No</option>
        </select>
      );
    } else {
      input = (
        <input type='text' value={this.state.input}
          className='input-box input'
          onChange={this.updateInput('input')}/>
      );
    }
    return input;
  }

  render() {
    let subtype = this.checkSubtype();
    let input = this.checkInput();

    let subinputsKeys = [];
    if (this.state.subinputs) {
      subinputsKeys = Object.keys(this.state.subinputs);
    }
    let subinputs = (
      subinputsKeys.map(subinput => {
        let path = `${this.props.input}.subinputs.${subinput}`;
        return (
          <SubInput key={subinput} data={this.state.subinputs[subinput]}
            subinput={subinput} parentState={this.parentState}
            parentInfo={this.state} path={path}/> );
          })
    );
    return (
      <div className='parent-input-container'>
        <div className="input-container">
          <div className='error'>{this.state.error}</div>
          <label className='first-section'>Question
            <input type='text'
              value={this.state.question} className='input-box question'
              onChange={this.updateInput('question')}/>
          </label>
          <label className='secondary-section'>Type
            <select value={this.state.type} onChange={this.updateInput('type')}
              className='dropdown-box type'>
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="yes/no">Yes/No</option>
            </select>
          </label>
          {subtype}
          <label className='secondary-section'>Input
            {input}
          </label>
          <div className='buttons-container'>
            <button className='input-box-button' onClick={this.addSubInput}>
              Add Sub-Input</button>
            <button className='input-box-button'
              onClick={this.deleteSelf(this.props.input)}>
              Delete</button>
          </div>
        </div>
        {subinputs}
      </div>
    );
  }
}

export default RootInput;
