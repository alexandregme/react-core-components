import React, { Component } from 'react';
import {render} from 'react-dom';

class App extends Component {
  render () {
  return (
    <div> 
      Hello React project
    </div>
    );
  }
}

render(<App/>, document.getElementById('app'));
