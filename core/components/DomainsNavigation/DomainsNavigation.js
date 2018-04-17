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

export default class DomainsNavigation extends Component {

  renderDomainItem({link, domainName}, i) {
    return (
      <li
          key={i}
          className="nav-item"
      >
        <a
            href={link}
            target='_self'
            className="nav-link"
        >
          {domainName}
        </a>
      </li>
    );
  }
  render() {
    return (
        <ul className="nav">
          { items.map(this.renderDomainItem) }
        </ul>
    );
  }
}