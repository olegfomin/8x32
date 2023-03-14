import './AboutWindow.css';
import React, { useRef, useEffect } from 'react';

export default class AboutWindow extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="AboutWindow">
              <form>
                <div>
                    <div id="UpfrontImage"></div>
                    <ul>
                        <li>This web page explains how to control 'Robotic Rover' remotely</li>
                        <li>While this chassis can be used anywhere. It will be tested on the tennis court</li>
                        <li>This robot is going to be equipped with accessories that would allow
                            <ul>
                                <li>Collecting the fallen tennis balls</li>
                                <li>Vacuum cleaning the tennis courts</li>
                                <li>Play the tennis like a real player does</li>
                            </ul>
                        </li>
                        <li>To start the process, you will have to 'Login' first</li>
                        <li>If you do not have the credential yet please write to me at <span className="yellow">admin@roboticrover.com</span></li>
                        <li>After you logged in you can go to "Settings" or "Calibration"</li>
                        <li>However if just want to control the rover than click "Start" button on the right</li>
                        <li>In the bottom middle part of the court you shall see the circle with the button R in centre</li>
                        <li>On the upper left of the court you will see X and Y coordinates changing as you move your mouse</li>
                        <li>Click at any valid position on green part of the court (not too close to the net)</li>
                        <li>The grey circle will start moving towards the target you identified</li>
                        <li>(Not implemented yet!) Following the grey circle the black circle will start moving</li>
                        <li>The gray circle represents the desirable position of the rover</li>
                        <li>(Not implemented yet) The black rover will be chasing the grey circle</li>
                        <li>When you are finished with the system please press "Logoff" or close the browser</li>
                        <li>If you do not logoff your session will never expire </li>
                    </ul>
                </div>
                <button id="aboutSubmitButton" onClick={this.props.handleAboutClick}>Ok</button>
              </form>
            </div>
        );
    }
}