import React, { Component } from 'react';
import { render } from 'react-dom';
import { BasicLayout } from 'core/components/BasicLayout'

import './LandingPage.scss';

export default class App extends Component {
  render () {
    return (
      <BasicLayout>
          Hello React project
      </BasicLayout>
    );
  }
}