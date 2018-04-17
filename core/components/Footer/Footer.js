import React, { Component } from 'react';
import './Footer.scss';

export default class Footer extends Component {
  render() {
    return (
        <div className="div-oi">
            <hr />
            footer {this.props.value}
        </div>
    );
  }
}