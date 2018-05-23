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

const companyName = 'React Core Components';

export default class DomainsNavigation extends Component {

  renderDomainItem({link, domainName}, i) {
    return (
        <a
            href={link}
            target='_self'
            className="p-2 text-dark"
        >
          {domainName}
        </a>
    );
  }
  render() {
    return (
      <div className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom box-shadow">
        <h5 className="my-0 mr-md-auto font-weight-normal">{companyName}</h5>
        <nav className="my-2 my-md-0 mr-md-3">
            { items.map(this.renderDomainItem) }
          <a className="p-2 text-dark" href="#">Features</a>
          <a className="p-2 text-dark" href="#">Enterprise</a>
          <a className="p-2 text-dark" href="#">Support</a>
          <a className="p-2 text-dark" href="#">Pricing</a>
        </nav>
        <a className="btn btn-outline-primary" href="#">Sign up</a>
      </div>
    );
  }
}