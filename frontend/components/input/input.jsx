import React from 'react';

class Input extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (<div>
      {this.props.data}
      Test
    </div>);
  }
}

export default Input;
