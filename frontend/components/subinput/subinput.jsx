import React from 'react';
import set from 'lodash/set';

class SubInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {conditionType: props.parentInfo.subtype,
      conditionInput: props.parentInfo.input,
      question: props.data.question, type: props.data.type,
      subtype: props.data.subtype, input: props.data.input,
      subinputs: undefined ? {} : props.data.subinputs};
      this.updateInput = this.updateInput.bind(this);
      this.updateConditional = this.updateConditional.bind(this);
      this.addSubInput = this.addSubInput.bind(this);
      this.parentState = this;
      this.deleteChild = this.deleteChild.bind(this);
  }

  addSubInput(e) {
    e.preventDefault();
    let subInputNumber = this.findNextNumber(Object.keys(this.state.subinputs));
    let path = this.props.path.split(".subinputs.");
    let currentElement = this.findElement(path);
    currentElement.subinputs[subInputNumber] = {
      conditionType: this.state.subtype, conditionInput: this.state.input,
      question: "", type: "text", input: "",
      subtype: "equals", subinputs: {}};

    let newState = JSON.parse(localStorage.getItem('formInputs'));
    newState = set(newState, this.props.path, currentElement);
    newState = JSON.stringify(newState);

    let p = new Promise((resolve, reject) => {
      resolve(localStorage.setItem('formInputs', newState));
    });

    p.then(() => {
      this.setState({['subinputs']: currentElement.subinputs});
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({['conditionType']: nextProps.parentInfo.subtype,
      ['conditionInput']: nextProps.parentInfo.input});
  }

  updateInput(field) {
    return e => {
      let path = this.props.path.split(".subinputs.");
      let currentElement = this.findElement(path);
      let value;
      if (typeof e === 'string') {
        value = e;
      } else {
        value = e.currentTarget.value;
      }

      currentElement[field] = value;
      this.updateChildren(field, value, currentElement);
      let newState = JSON.parse(localStorage.getItem('formInputs'));

      let p1 = new Promise((resolve, reject) => {
        resolve(newState =
          set(newState, this.props.path, currentElement));
      });

      let p2 = new Promise((resolve, reject) => {
        resolve(localStorage.setItem('formInputs',
          JSON.stringify(newState)));
      });

      p1.then(() => p2.then(() => {
        this.setState({[field]: value});
      }));

      if (field === 'type' && value === 'yes/no') {
        this.updateInput('input')('yes');
      } else if (field === 'type') {
        this.updateInput('input')('');
      } else if (field === 'subtype') {
        this.updateInput('type')('number');
      }
      if (field === 'type' && value !== 'number' &&
        this.state.subtype !== 'equals') {
          this.updateInput('subtype')('equals');
        }
    };
  }

  updateChildren(field, value, element) {
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
    let keys = Object.keys(element.subinputs);

    for (let i = 0; i < keys.length; i++) {
      element.subinputs[keys[i]][childParam] = value;
    }
    return element;
  }

  deleteSelf(subinput) {
    return e => {
      this.props.parentState.deleteChild(subinput);
    };
  }

  deleteChild(subinput) {
    let path = this.props.path.split(".subinputs.");
    let currentElement = this.findElement(path);
    delete currentElement.subinputs[subinput];
    let newState = localStorage.getItem('formInputs');
    newState = JSON.parseInt(newState);

    let p1 = new Promise((resolve, reject) => {
      resolve(newState =
        set(newState, this.props.path, currentElement));
    });

    let p2 = new Promise((resolve, reject) => {
      resolve(localStorage.setItem('formInputs', JSON.stringify(newState)));
    });

    p1.then(() => p2.then(() =>
      this.setState({['subinputs']: currentElement.subinputs})));
  }

  updateConditional(field) {
    return e => {
      let parentType;
      let value;
      if (field === 'conditionType') {
        parentType = 'subtype';
      } else {
        parentType = 'input';
      }

      if (typeof e === 'string') {
        value = e;
      } else {
        value = e.currentTarget.value;
      }

      this.props.parentState.updateInput(parentType)(value);

      if (field === 'conditionType' && value !== 'yes/no') {
        this.updateConditional('conditionInput')('');
      }
    };

  }

  findElement(path) {
    let currentElement = JSON.parse(localStorage.getItem('formInputs'));

    for (let i = 0; i < path.length; i++) {
      if (i === path.length - 1) {
        currentElement = currentElement[path[i]];
      } else {
        currentElement = currentElement[path[i]].subinputs;
      }
    }
    return currentElement;
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

  checkConditionInput() {
    let conditionInput;

    if (this.state.conditionInput === 'yes' ||
      this.state.conditionInput === 'no') {
      conditionInput = (
        <select value={this.state.conditionInput}
          onChange={this.updateConditional('conditionInput')}
          className='dropdown-box condition-input'>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      );
    } else {
      conditionInput = (
        <input type='text'
          value={this.state.conditionInput}
          className='input-box condition-input'
          onChange={this.updateConditional('conditionInput')}/>
      );
    }
    return conditionInput;
  }

  checkSubtype() {
    let subtype;
    if (this.state.type === "number") {
      subtype = (
        <label className='secondary-section'>Sub-Type
          <select value={this.state.subtype}
            onChange={this.updateInput('subtype')}
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
          className='input-box input'>
          <option value='yes'>Yes</option>
          <option value='no'>No</option>
        </select>
      );
    } else {
      input = (
        <input type='text'
          value={this.state.input} className='input-box input'
          onChange={this.updateInput('input')}/>
      );
    }
    return input;
  }

  render() {

    let conditionInput = this.checkConditionInput();
    let subtype = this.checkSubtype();
    let input = this.checkInput();

    let subinputsKeys = [];
    if (this.state.subinputs) {
      subinputsKeys = Object.keys(this.state.subinputs);
    }

    let subinputs = (
      subinputsKeys.map(subinput => {
        let path = `${this.props.path}.subinputs.${subinput}`;
        return (
          <SubInput key={subinput} data={this.state.subinputs[subinput]}
            subinput={subinput} parentState={this.parentState}
            parentInfo={this.state} path={path}/> );
          })
    );

    let margin = (this.props.path.split('.subinputs').length) * 25;
    let style = {marginLeft: `${margin}`};

    return (
      <div className='parent-subinput-container'>
        <div className="input-container" style={style}>
          <label className='first-section'>Condition
            <select value={this.state.conditionType}
              className='dropdown-box condition-type'
              onChange={this.updateConditional('conditionType')}>
              <option value="equals">Equals</option>
              <option value="greater-than">Greater than</option>
              <option value="less-than">Less than</option>
            </select>
            {conditionInput}
          </label>
          <label className='secondary-section'>Question
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
            <button className='input-box-button'
              onClick={this.addSubInput}>Add Sub-Input</button>
            <button className='input-box-button'
              onClick={this.deleteSelf(this.props.subinput)}>
              Delete</button>
          </div>
        </div>
        {subinputs}
      </div>
    );
  }
}

export default SubInput;
