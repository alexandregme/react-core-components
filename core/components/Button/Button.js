import React, { Component } from 'react';

export default class Button extends Component {

    text(){
        return "Button com texto";
    }

    onclick(){
        console.log(this.text());
    }

    render() {
        return (
            <button onClick={this.onclick.bind(this)}>
                {this.text()}
            </button>
        );
    }
}