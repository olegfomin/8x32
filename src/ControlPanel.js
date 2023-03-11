import './ControlPanel.css';
import React from 'react';

export default class ControlPanel extends React.Component {
    state = {

    }

    render() {
        return (
            <div id="motherPanel" className="center" height="1300" width="700">
                <div id="controlPanel">
                    <button id="loginButton" onClick={this.props.loginClicked}
                            disabled={this.props.EditInProcess}
                            className={this.props.LoggedIn ? "redBold" : "normal"}

                    > {this.props.LoggedIn ? "Logoff" : "Login" }
                    </button>
                    <button id="settingButton" onClick={this.props.settingClicked}
                            disabled={!this.props.LoggedIn || this.props.EditInProcess}>Settings
                    </button>
                    <button id="calibrationButton" onClick={this.props.handleCalibrationClick}
                            disabled={!this.props.LoggedIn || this.props.EditInProcess}>Calibration
                    </button>
                    <button id="aboutButton" onClick={this.props.aboutClicked}
                            disabled={this.props.EditInProcess || this.props.EditInProcess}>About
                    </button>
                    <button id="startButton" onClick={this.props.startClicked}
                            disabled={!this.props.LoggedIn || this.props.EditInProcess}>
                        {this.props.wsConnected ? "Stop" : "Start"}
                    </button>
                </div>
            </div>
        )
    }
}

