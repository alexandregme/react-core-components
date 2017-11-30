import React, { Component } from 'react';

import { DomainsNavigation } from '../DomainsNavigation';
import { Footer } from '../Footer';

export class BasicLayout extends Component {
  render() {
    const { children } = this.props;
    
    return (
        <div className="container">
            <DomainsNavigation />
            { children }
            <Footer />
        </div>
    );
  }
}