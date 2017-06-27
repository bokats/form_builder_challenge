import React from 'react';
import SubInput from '../subinput/subinput';

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {question: props.data.question,type: props.data.type,
      subtype: props.data.subtype, input: props.data.input,
      subinputs: props.data.subinputs};
    this.update = this.update.bind(this);
    this.addSubInput = this.addSubInput.bind(this);
    this.deleteSelf = this.deleteSelf.bind(this);
    this.deleteChild = this.deleteChild.bind(this);
    this.localStorage = JSON.parse(localStorage.getItem('formInputs'));
    this.parentState = this;
  }

  addSubInput(e) {
    e.preventDefault();
    let subInputNumber = this.findNextNumber(Object.keys(this.state.subinputs));

    this.localStorage[this.props.input].subinputs[subInputNumber] =
    {conditionType: this.state.subtype, conditionInput: this.state.input,
      question: "", type: "text", subtype: "", subinputs: {}};
    let newState = JSON.stringify(this.localStorage);

    let p = new Promise((resolve, reject) => {
      resolve(localStorage.setItem('formInputs', newState));
    });

    p.then(() => {
      this.setState({['subinputs']: this.localStorage[this.props.input].
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

  update(field) {
    return e => {
      this.localStorage[this.props.input][field] = e.currentTarget.value;
      let newState = JSON.stringify(this.localStorage);
      setTimeout(function(){
        localStorage.setItem('formInputs', newState);
      }, 500);
      this.setState({[field]: e.currentTarget.value});
      if (field === 'type' && e.currentTarget.value !== 'number' &&
        this.state.subtype !== 'equals') {
          this.updateSubType();
        }
    };
  }

  updateSubType() {
    this.localStorage[this.props.input]['subtype'] = 'equals';
    localStorage.setItem('formInputs', JSON.stringify(this.localStorage));
    this.setState({['subtype']: 'equals'});
  }

  deleteSelf(input) {
    return e => {
      this.props.parentState.deleteInput(input);
    };
  }

  deleteChild(subinput) {
    delete this.localStorage[`${this.props.input}`].subinputs[subinput];
    let newState = JSON.stringify(this.localStorage);

    let p = new Promise((resolve, reject) => {
      resolve(localStorage.setItem('formInputs', newState));
    });

    p.then(() => {
      this.setState({['subinputs']:
        this.localStorage[`${this.props.input}`].subinputs});
    });
  }

  render() {
    let subtype;
    if (this.state.type === "number") {
      subtype = (
        <label>Number type
          <select value={this.state.subtype} onChange={this.update('subtype')}>
            <option value="greater-than">Greater than</option>
            <option value="equals">Equals</option>
            <option value="less-than">Less than</option>
          </select>
        </label>
      );
    }
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
      <div className="input-container">
        <label>Question
          <input type='text' placeholder='Type your input question'
            value={this.state.question}
            onChange={this.update('question')}/>
        </label>
        <label>Type
          <select value={this.state.type} onChange={this.update('type')}>
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="yes/no">Yes/No</option>
          </select>
        </label>
        {subtype}
        <label>Input
          <input type='text' placeholder='Type your input answer'
            value={this.state.input}
            onChange={this.update('input')}/>
        </label>
        <button onClick={this.addSubInput}>Add Sub-Input</button>
        <button onClick={this.deleteSelf(this.props.input)}>
          Delete Input</button>
        <div>
          {subinputs}
        </div>
      </div>
    );
  }
}

export default Input;
