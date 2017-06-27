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
    this.deleteInput = this.deleteInput.bind(this);
    this.localStorage = JSON.parse(localStorage.getItem('formInputs'));
    this.parentState = this;
  }

  addSubInput(e) {
    e.preventDefault();
    let subInputNumber;
    if (this.state.subinputs) {
      subInputNumber = Object.keys(this.localStorage[this.props.input].
        subinputs).length + 1;
    } else {
      this.localStorage[this.props.input]['subinputs']= {};
      subInputNumber = 1;
    }
    this.localStorage[this.props.input].subinputs[subInputNumber] =
    {conditionType: this.state.subtype, conditionInput: this.state.input,
      question: "", type: "text", subtype: "", subinputs: {}};

    localStorage.setItem('formInputs', JSON.stringify(this.localStorage));
    this.setState({['subinputs']: this.localStorage[this.props.input].
      subinputs});
  }

  update(field) {
    return e => {
      this.localStorage[this.props.input][field] = e.currentTarget.value;
      let newState = JSON.stringify(this.localStorage);
      setInterval(function(){
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

  deleteInput(input) {
    return e => {
      this.props.parentState.deleteInput(input);
    };
  }

  render() {
    console.log(this.state);
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

    let subinputsKeys = Object.keys(this.state.subinputs);
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
        <button onClick={this.deleteInput(this.props.input)}>
          Delete Input</button>
        <div>
          {subinputs}
        </div>
      </div>
    );
  }
}

export default Input;
