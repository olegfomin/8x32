import './TennisBallWindow.css';
import React from 'react';

export default class TennisBallWindow extends React.Component {
    render() {
        return (
            <div>
                <div id="TennisBallImage" style={{"display" : this.props.visible ? "inherit" : "none"}}></div>
            </div>
        );
    }
}

