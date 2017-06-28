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
      this.localStorage = JSON.parse(localStorage.getItem('formInputs'));
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

    this.locaStorage = set(this.locaStorage, this.props.path, currentElement);

    let newState = JSON.stringify(this.localStorage);

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
      console.log(field, 'sub');
      let path = this.props.path.split(".subinputs.");
      let currentElement = this.findElement(path);
      let value;
      if (typeof e === 'string') {
        value = e;
      } else {
        value = e.currentTarget.value;
      }

      currentElement[field] = value;
      currentElement = this.updateChildren(field, value, currentElement);

      let p1 = new Promise((resolve, reject) => {
        resolve(this.localStorage =
          set(this.localStorage, this.props.path, currentElement));
      });

      let p2 = new Promise((resolve, reject) => {
        resolve(localStorage.setItem('formInputs',
          JSON.stringify(this.localStorage)));
      });

      p1.then(() => p2.then(() => {
        this.setState({[field]: value});
      }));
    };
  }

  updateChildren(field, value, element) {
    let childParam;
    if (field === 'input') {
      childParam = 'conditionInput';
    } else if (field === 'subtype') {
      childParam = 'conditionType';
    } else {
      return element;
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
    let p1 = new Promise((resolve, reject) => {
      resolve(this.localStorage =
        set(this.localStorage, this.props.path, currentElement));
    });

    let p2 = new Promise((resolve, reject) => {
      resolve(localStorage.setItem('formInputs', JSON.stringify(this.localStorage)));
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

      // let p1 = new Promise((resolve, reject) => {
      //   resolve();
      // });

      // p1.then(() => {
      //   console.log(localStorage);
      //   this.updateInput(field)(value);
      // });

      if (field === 'conditionType' && value !== 'yes/no') {
        this.updateConditional('conditionInput')('');
      }
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

  render() {

    let conditionInput;
    let subtype;
    let input;

    if (this.state.conditionInput === 'yes' ||
      this.state.conditionInput === 'no') {
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
          {input}
        </label>
        <button onClick={this.addSubInput}>Add Sub-Input</button>
        <button onClick={this.deleteSelf(this.props.subinput)}>
          Delete Sub-Input</button>
        <div>
          {subinputs}
        </div>
      </div>
    );
  }
}

export default SubInput;
