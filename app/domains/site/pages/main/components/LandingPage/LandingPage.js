import React, { Component } from 'react';
import {render} from 'react-dom';

import './LandingPage.scss';

export class App extends Component {
  render () {
  return (
    <div>
      Hello React project
      <button type="button" className="btn btn-primary">Primary</button>
      <button type="button" className="btn btn-secondary">Secondary</button>
      <button type="button" className="btn btn-success">Success</button>
    </div>
    );
  }
}