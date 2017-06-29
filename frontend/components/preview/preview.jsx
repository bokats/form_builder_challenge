import React from 'react';
import { hashHistory, router } from 'react-router';

class Preview extends React.Component {
  constructor(props) {
    super(props);
  }

  buildElements() {
    let result = [];
    let currentState = JSON.parse(localStorage.getItem('formInputs'));
    let stack = [[currentState, 0]];
    let currentNode;
    let children;
    let keys;
    while (stack.length > 0) {
      currentNode = stack.pop();
      if (currentNode[1] === 0) {
        keys = Object.keys(currentNode[0]).reverse();
        for (let i = 0; i < keys.length; i++) {
          stack.push([currentNode[0][keys[i]], currentNode[1] + 1]);
        }
      } else {
        keys = Object.keys(currentNode[0].subinputs).reverse();
        for (let i = 0; i < keys.length; i++) {
          stack.push([currentNode[0].subinputs[keys[i]], currentNode[1] + 1]);
        }
        result.push({type: currentNode[0].type, question: currentNode[0].question,
          input: currentNode[0].input, subtype: currentNode[0].subtype,
          level: currentNode[1]});
      }
    }
    return result;
  }

  render() {
    let elementInfo = this.buildElements();

    let newElement;
    let css;

    let elements = elementInfo.map(element => {
      css = {
        marginLeft: `${element.level * 25}px`
      };
      if (element.input === "") {
        return;
      }
      if (element.type === 'text') {
        newElement = (
          <div className='preview-element' style={css} key={element.question}>
            <p>{element.question}</p>
            <p className='preview-box input-box'>{element.input}</p>
          </div>
        );
      } else if (element.type === 'number') {
        let field = element.input;
        if (element.subtype === 'greater-than') {
          field = `>${element.input}`;
        } else if (element.subtype === 'less-than') {
          field = `<${element.input}`;
        }
        newElement = (
          <div className='preview-element' style={css} key={element.question}>
            <p>{element.question}</p>
            <p className='preview-box input-box'>{field}</p>
          </div>
        );
      } else {
        let inputs;
        if (element.input === 'yes') {
          inputs = (
            <div className='radio-buttons-container'>
              <input className='preview-radio' type='radio'
                value='Yes' checked readOnly/>
              <label className='radio-label'>Yes
              </label>
              <input className='preview-radio second-label' type='radio'
                value='No' readOnly disabled/>
              <label className='radio-label'>No
              </label>
            </div>
          );
        } else {
          inputs = (
            <div className='radio-buttons-container'>
              <input className='preview-radio' type='radio' value='Yes'
                readOnly disabled/>
              <label className='radio-label'>Yes
              </label>
              <input className='preview-radio second-label' type='radio'
                value='No' checked readOnly/>
              <label className='radio-label'>No
              </label>
            </div>
          );
        }
        newElement = (
          <div className='preview-element' style={css} key={element.question}>
            <p>{element.question}</p>
            {inputs}
          </div>
        );
      }
      return newElement;
    });

    return (
      <div className='preview-container'>
        {elements}
      </div>
    );
  }

}

export default Preview;
