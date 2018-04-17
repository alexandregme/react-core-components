import React, { Component } from 'react';

export default class Label extends Component {

    text(){
        return `${this.props.value}`;
    }

    render() {
        return (<span> {this.text()}</span>);
    }
}