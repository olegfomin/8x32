import './LoginWindow.css';
import React, { useRef, useEffect } from 'react';

export default class LoginWindow extends React.Component {
    componentDidMount() {
    }

    render() {
        return (
            <div id="SettingsWindow">

                <form>
                    <p>Who starts:</p>
                    <label id="yourRoverLabel" for="YourRoverRB">Your rover</label><input id="YourRoverRB" name="whoStarts" type="radio" value="Your rover"/>
                    <label id="passwordLabel" htmlFor="password">Password:</label><input id="password" type="password"/>
                    <button id="submitButton" onClick={this.props.callBackFunction}>Submit</button>
                </form>
            </div>
        );
    }
}
