import React from 'react';

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {question: props.data.question,type: props.data.type,
      subtype: props.data.subtype, input: props.data.input};
    this.update = this.update.bind(this);
    this.localStorage = JSON.parse(localStorage.getItem('formInputs'));
  }

  update(field) {
    return e => {
      this.localStorage[this.props.input][field] = e.currentTarget.value;
      localStorage.setItem('formInputs', JSON.stringify(this.localStorage));
      this.setState({[field]: e.currentTarget.value});
    };
  }

  render() {
    let subtype;
    if (this.state.type === "number") {
      subtype = (
        <label>Number type
          <select onChange={this.update('subtype')}>
            <option value="greater-than">Greater than</option>
            <option value="equals">Equals</option>
            <option value="less-than">Less than</option>
          </select>
        </label>
      );
    }
    return (
      <div className="input-container">
        <label>Question
          <input type='text' placeholder='Type your input question'
            value={this.state.question}
            onChange={this.update('question')}/>
        </label>
        <label>Type
          <select onChange={this.update('type')}>
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="yes/no">Yes/No</option>
          </select>
        </label>
        {subtype}
        <label>Input
          <input type='text' placeholder='Type your input answer'
            value={this.state.answer}
            onChange={this.update('answer')}/>
        </label>
        <button className='add-subinput-button'>Add Sub-Input</button>
        <button className='delete-button'>Delete Input</button>
      </div>
    );
  }
}

export default Input;
