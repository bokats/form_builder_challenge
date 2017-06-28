import React from 'react';
import SubInput from '../subinput/subinput';

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {question: props.data.question,type: props.data.type,
      subtype: props.data.subtype, input: props.data.input,
      subinputs: props.data.subinputs};
    this.updateInput = this.updateInput.bind(this);
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
      question: "", type: "text", subtype: "equals", subinputs: {}};
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

  updateInput(field) {
    return e => {
      let value;
      let newState;
      if (typeof e  === "string") {
        value = e;
      } else {
        value = e.currentTarget.value;
      }
      this.localStorage[this.props.input][field] = value;
      this.updateChildren(field, value);

      let p1 = new Promise((resolve, reject) => {
        resolve(newState = JSON.stringify(this.localStorage));
      });

      let p2 = new Promise((resolve, reject) => {
        resolve(localStorage.setItem('formInputs', newState));
      });

      let p3 = new Promise((resolve, reject) => {
        resolve(this.setState({[field]: value}));
      });

      p1.then(() => p2.then(() => p3.then(() => {
        this.updateSubType(field, value);
      })));

      if (field === 'type' && value === 'yes/no') {
        this.updateInput('input')('yes');
      } else if (field === 'type') {
        this.updateInput('input')('');
      } else if (field === 'subtype') {
        this.updateInput('type')('number');
      }
    };
  }

  updateSubType(field, value) {
    if (field === 'type' && value !== 'number' &&
    this.state.subtype !== 'equals') {
      this.localStorage[this.props.input]['subtype'] = 'equals';
      let p1 = new Promise((resolve, reject) => {
        resolve(localStorage.setItem('formInputs', JSON.stringify(this.localStorage)));
      });
      p1.then(() => this.setState({['subtype']: 'equals'}));
    }
  }

  updateChildren(field, value) {
    let childParam;
    if (field === 'input') {
      childParam = 'conditionInput';
    } else if (field === 'subtype') {
      childParam = 'conditionType';
    } else {
      return;
    }
    let keys = Object.keys(this.localStorage[this.props.input].subinputs);

    for (let i = 0; i < keys.length; i++) {
      this.localStorage[this.props.input].subinputs[keys[i]][childParam]
      = value;
    }
    localStorage.setItem('formInputs', JSON.stringify(this.localStorage));
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
    let input;

    if (this.state.type === "number") {
      subtype = (
        <label>Input
          <select value={this.state.subtype} onChange={this.updateInput('subtype')}>
            <option value="greater-than">Greater than</option>
            <option value="equals">Equals</option>
            <option value="less-than">Less than</option>
          </select>
        </label>
      );
    }

    if (this.state.type === 'yes/no') {
      input = (
        <select value={this.state.input} onChange={this.updateInput('input')}>
          <option value='yes'>Yes</option>
          <option value='no'>No</option>
        </select>
      );
    } else {
      input = (
        <input type='text' placeholder='Type your input answer'
          value={this.state.input}
          onChange={this.updateInput('input')}/>
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
            onChange={this.updateInput('question')}/>
        </label>
        <label>Type
          <select value={this.state.type} onChange={this.updateInput('type')}>
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="yes/no">Yes/No</option>
          </select>
        </label>
        {subtype}
        <label>Input
          {input}
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
