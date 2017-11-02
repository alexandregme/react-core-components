import React, { Component } from 'react';

const items = [
  {
    link: '/site',
    domainName: 'Site'
  },
  {
    link: '/hotsite',
    domainName: 'Hot Site'
  },
  {
    link: '/blog',
    domainName: 'Blog'
  }
];

export class DomainsNavigation extends Component {

  renderDomainItem({link, domainName}, i) {
    return (
      <a
          href={link}
          key={i}
          target='_self'
      >
        {domainName}
      </a>
    );
  }
  render() {
    return (
        <nav>
          {
            items.map(this.renderDomainItem)
          }
        </nav>
    );
  }
}