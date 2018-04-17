import React, { Component } from 'react';

import { Label } from 'core/components/Label'
import { Button } from 'core/components/Button'

import './Form.scss';

export default class Form extends Component {

    text(){
        return "texto";
    }

    render() {
        return (
            <div>
                <h1>Form</h1>
                <Label value={`string1`} />
                <Label value={`string2`} />
                <Label value={`string3`} />
                <Button />
            </div>
        );
    }
}