import React, { Component } from 'react';
import {render} from 'react-dom';
import { DomainsNavigation } from 'core/components/DomainsNavigation'

export class App extends Component {
  render () {
  return (
    <div>
      <DomainsNavigation />
        Blog Landing Page
    </div>
    );
  }
}