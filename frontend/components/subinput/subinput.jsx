import React from 'react';
import set from 'lodash/set';

class SubInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {conditionType: props.parentInfo.subtype,
      conditionInput: props.parentInfo.input,
      question: props.data.question, type: props.data.type,
      subtype: props.data.subtype, input: props.data.input,
      subinputs: props.data.subinputs};
      this.updateInput = this.updateInput.bind(this);
      this.updateConditional = this.updateConditional.bind(this);
      this.addSubInput = this.addSubInput.bind(this);
      this.localStorage = JSON.parse(localStorage.getItem('formInputs'));
      this.parentState = this;
      console.log(props.parentInfo.input, 'subinput');
  }

  addSubInput(e) {

  }

  componentWillReceiveProps(nextProps) {
    this.setState({['conditionType']: nextProps.parentInfo.subtype,
      ['conditionInput']: nextProps.parentInfo.input});
  }

  updateInput(field) {
    return e => {
      let path = this.props.path.split(".subinputs.");
      let currentElement = this.findElement(path);
      currentElement[field] = e.currentTarget.value;
      this.localStorage = set(this.localStorage, this.props.path, currentElement);
      localStorage.setItem('formInputs', JSON.stringify(this.localStorage));
      this.setState({[field]: e.currentTarget.value});
    };
  }

  updateConditional(field) {
    let parentType;
    if (field === 'conditionType') {
      parentType = 'subtype';
    } else {
      parentType = 'input';
    }
    return e => {
      this.props.parentState.update(parentType)(e);
      this.updateInput(field)(e);
    };

  }

  findElement(path) {
    let currentElement = this.localStorage;
    for (let i = 0; i < path.length; i++) {
      if (i === path.length - 1) {
        currentElement = currentElement[path[i]];
      } else {
        currentElement = currentElement[path[i]].subinputs;
      }
    }
    return currentElement;
  }

  render() {

    let conditionInput;
    if (this.state.conditionType === 'yes/no') {
      conditionInput = (
        <select value={this.state.conditionInput}
          onChange={this.updateConditional('conditionInput')}>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      );
    } else {
      conditionInput = (
        <input type='text' placeholder='Type your input answer'
          value={this.state.conditionInput}
          onChange={this.updateConditional('conditionInput')}/>
      );
    }

    let subtype;
    if (this.state.type === "number") {
      subtype = (
        <label>Number type
          <select value={this.state.subtype}
            onChange={this.updateInput('subtype')}>
            <option value="greater-than">Greater than</option>
            <option value="equals">Equals</option>
            <option value="less-than">Less than</option>
          </select>
        </label>
      );
    }

    let subinputs = Object.keys(this.state.subinputs);

    return (
      <div className="sub-input-container">
        <label>Condition
          <select value={this.state.conditionType}
            onChange={this.updateConditional('conditionType')}>
            <option value="equals">Equals</option>
            <option value="greater-than">Greater than</option>
            <option value="less-than">Less than</option>
          </select>
          {conditionInput}
        </label>
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
          <input type='text' placeholder='Type your input answer'
            value={this.state.input}
            onChange={this.updateInput('answer')}/>
        </label>
        <button onClick={this.addSubInput}>Add Sub-Input</button>
        <button onClick={this.props.parentState.deleteInput(this.props.input)}>
          Delete Input</button>
        <div>
          {subinputs.map(subinput => {
            return (
              <SubInput key={subinput} data={this.state.subinputs[`${subinput}`]}
                subinput={subinput} parentState={this.parentState}/>);
              })}
        </div>
      </div>
    );
  }
}

export default SubInput;
