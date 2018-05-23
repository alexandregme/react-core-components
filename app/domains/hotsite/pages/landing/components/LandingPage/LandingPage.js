import React, { Component } from 'react';
import {render} from 'react-dom';
import { BasicLayout } from 'core/components/BasicLayout'
import { Form } from '../Form'

export default class App extends Component {
  render () {
  return (
    <BasicLayout>
      Hot Site Landing Page'
      <Form />
    </BasicLayout>
    );
  }
}