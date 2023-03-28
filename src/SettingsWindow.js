import './SettingsWindow.css';
import React, { useRef, useEffect } from 'react';
import SettingsCommunication from './SettingsCommunication';

/** Contains the form that allows editing arguments for settings */
export default class SettingsWindow extends React.Component {

    constructor(props) {
        super(props);
        this.timerID = null; // timer that wait for the moment when securityToken is supplied and thus we can retrieve the settings
        this.speedIntoIndex = this.speedIntoIndex.bind(this);
        this.state = {
            "WhoStarts": false, // Defines who starts either your rover or the opponent on the other side of the court
            "Serve_X": null, // The X coordinate where the rover serves from
            "Serve_Y": null, // The Y coordinate where the rover serves from
            "Home_X": null,    // The X coordinate where the rover goes towards after each shot
            "Home_Y": null,   // The Y coordinate where the rover goes towards after each shot
            "ReturnHome": false, // Indicates whether rover head towards Home coordinates above
            "OpponentServesNow": true, // If Return Home is true then we put the rover into Home_X, Home_y coordinates otherwise we'll ask the
            "speed2LeftDegreeArray":[[]],
            "speed2RightDegreeArray":[[]]
        };
        this.settingsSaved = this.settingsSaved.bind(this);
        this.settingsFailed = this.settingsFailed.bind(this);
        this.settingsRetrievalFailed = this.settingsRetrievalFailed.bind(this);
        this.settingsRetrieved = this.settingsRetrieved.bind(this);
        this.calibrationArray2Form = this.calibrationArray2Form.bind(this);
        this.completeSettingsFromForm = this.completeSettingsFromForm.bind(this);
        this.showInfoMessage = this.showInfoMessage.bind(this);
        this.handleSettingsSubmitClick = this.handleSettingsSubmitClick.bind(this);

        this.settingsCommunication = new SettingsCommunication(this);
    }
    // prefix here is either 'l' or 'r' to reach either <input id={"l"+i+"0"} or <input id={"r"+i+"0"} to retrieve the value from
    form2DCalibrationArray(prefix) {
        const result = [];
        for(let i=0; i<7; i++) {
            const calib1Raw = [];
            for(let j=0; j<7; j++) {
                calib1Raw.push((parseInt(document.getElementById(prefix+i+j).value)));
            }
            result.push(calib1Raw);
        }
        return result;
    }

    // prefix here is either 'l' or 'r' to reach either <input id={"l"+i+"0"} or <input id={"r"+i+"0"} to push the value into
    calibrationArray2Form(prefix, arrayOfSubArrays) {
        for(let i=0; i<7; i++) {
            const calibRaw = arrayOfSubArrays[i];
            for(let j=0; j<7; j++) {
                document.getElementById(prefix+i+j).value = calibRaw[j];
            }
        }
    }

    // Traverses through all element inside the HTML form and shoves all the values
    completeSettingsFromForm() {
        const settings = {};
        settings.Home_X =parseInt(document.getElementById("homeCoordXNumber").value);
        settings.Home_Y = parseInt(document.getElementById('homeCoordYNumber').value);
        settings.ReturnHome = document.getElementById('returnHomeCheckBox').checked;
        settings.WhoStarts = document.getElementById('WhoStarts').checked;
        settings.Serve_X = parseInt(document.getElementById('servingCoordXNumber').value);
        settings.Serve_Y = parseInt(document.getElementById('servingCoordYNumber').value);
        settings.OpponentServesNow = this.state.OpponentServesNow;
        const calibrationLeft = this.form2DCalibrationArray('l');
        const calibrationRight = this.form2DCalibrationArray('r');
        settings.speed2LeftDegreeArray = calibrationLeft;
        settings.speed2RightDegreeArray = calibrationRight;

        settings.WhoStarts = document.getElementById("WhoStarts").checked;
        settings.ReturnHomedocument = document.getElementById("returnHomeCheckBox").cheched;

        return settings;
    }


    settingsSaved() {
        this.props.infoMessageSender("The setting were successfully saved");
    }

    settingsFailed(reason) {
        this.props.errorMessageSender(`The setting storage failed because of "${reason}"`);
    }

// We cannot just continue here until the parental 'Court' class invokes 'Setting' button because otherwise we do not
// have
    componentDidMount() {
        this.timerID = setInterval( // It is sort of delayed initialization
            () => this.waitForSecurityToken(),
            1000
        );
    }

    waitForSecurityToken() { // Waiting until the securityToken gets set some value and only after it makes sense
        if(this.props.SecurityToken != null && this.props.SecurityToken != undefined) {
            this.settingsCommunication.getSettings(this.props.SecurityToken);
            if(this.timerID != null) clearInterval(this.timerID);
            this.timerID = null;
        }
    }

    componentWillUnmount() {
        if(this.timerID != null) clearInterval(this.timerID); // Destroying the timer created in the componentDidMount
    }

    // This method is being invoked as a callback from  waitForSecurityToken() this.settingsCommunication.getSettings(this.props.SecurityToken)
    settingsRetrieved(settingsAsJson) {
        this.setState({"Home_X": settingsAsJson.Home_X});
        this.setState({"Home_Y": settingsAsJson.Home_Y});
        this.setState({"ReturnHome": settingsAsJson.ReturnHome});
        this.setState({"WhoStarts": settingsAsJson.WhoStarts});
        this.setState({"Serve_X": settingsAsJson.Serve_X});
        this.setState({"Serve_Y": settingsAsJson.Serve_Y});
        this.setState({"speed2LeftDegreeArray": settingsAsJson.speed2LeftDegreeArray});
        this.setState({"speed2RightDegreeArray": settingsAsJson.speed2RightDegreeArray});
        this.calibrationArray2Form("l", settingsAsJson.speed2LeftDegreeArray);
        this.calibrationArray2Form("r", settingsAsJson.speed2RightDegreeArray);

        document.getElementById("WhoStarts").checked = settingsAsJson.WhoStarts;
        document.getElementById("returnHomeCheckBox").checked = settingsAsJson.ReturnHome;

        this.showInfoMessage("Settings successfully loaded");

    }

    showInfoMessage(msg) {
        this.props.infoMessageSender(msg);
    }

    settingsRetrievalFailed(reason) {
        this.props.errorMessageSender(`Settings retrieval failed due to "${reason}"`)
    }

    speedIntoIndex(speed) {
        switch (speed) {
            case "10%": return 0;
            case "25%": return 1;
            case "45%": return 2;
            case "60%": return 3;
            case "75%": return 4;
            case "90%": return 5;
            case "100%": return 6;
            default: throw new Error("Unknown speed value: "+speed);
        }
    }

    indexIntoSpeed(index) {
        switch (index) {
            case 0: return "10%";
            case 1: return "25%";
            case 2: return "45%";
            case 3: return "60%";
            case 4: return "75%";
            case 5: return "90%";
            case 6: return "100%";
            default: throw new Error("Speed ArrayOutOfBound: "+index);
        }
    }

    degreesIntoIndex(degree) {
        switch (degree) {
            case "0": return 0;
            case "10": return 1;
            case "25": return 2;
            case "45": return 3;
            case "65": return 4;
            case "75": return 5;
            case "90": return 6;
            default: throw new Error("Unknown turn degree value: "+degree);
        }
    }

    indexIntoDegrees(index) {
        switch (index) {
            case 0: return "0";
            case 1: return "10";
            case 2: return "25";
            case 3: return "45";
            case 4: return "65";
            case 5: return "75";
            case 6: return "90";
            default: throw new Error("Unknown turn degree value: "+index);
        }
    }

    handleSettingsSubmitClick(e) {
        e.preventDefault();
        this.state = this.completeSettingsFromForm();
        this.settingsCommunication.saveSettings(this.props.SecurityToken, this.state);
        e.settingState = this.state; // Very dirty hack but I do not know any better idea to send children's changes up to the parent
        this.props.handleSettingsSubmitClick(e);
    }

    render() {
        const calibRowsLeft = [];
        for(let i=0; i<7; i++){
            calibRowsLeft.push(<tr key={"l"+i} id={"l"+i}>
                                  <td>{this.indexIntoSpeed(i)}</td>
                                  <td><input id={"l"+i+"0"} type="number" className="calib-num" defaultValue="0"/></td>
                                  <td><input id={"l"+i+"1"} type="number" className="calib-num"  defaultValue="0"/></td>
                                  <td><input id={"l"+i+"2"} type="number" className="calib-num"  defaultValue="0"/></td>
                                  <td><input id={"l"+i+"3"} type="number" className="calib-num"  defaultValue="0"/></td>
                                  <td><input id={"l"+i+"4"} type="number" className="calib-num"  defaultValue="0"/></td>
                                  <td><input id={"l"+i+"5"} type="number" className="calib-num"  defaultValue="0"/></td>
                                  <td><input id={"l"+i+"6"} type="number" className="calib-num" defaultValue="0"/></td>
                              </tr>);
        }
        const calibRowsRight = [];
        for(let i=0; i<7; i++){
            calibRowsRight.push(<tr key={"r"+i} id={"r"+i}>
                                  <td>{this.indexIntoSpeed(i)}</td>
                                  <td><input id={"r"+i+"0"} type="number" className="calib-num" defaultValue="0"/></td>
                                  <td><input id={"r"+i+"1"} type="number" className="calib-num"  defaultValue="0"/></td>
                                  <td><input id={"r"+i+"2"} type="number" className="calib-num"  defaultValue="0"/></td>
                                  <td><input id={"r"+i+"3"} type="number" className="calib-num"  defaultValue="0"/></td>
                                  <td><input id={"r"+i+"4"} type="number" className="calib-num"  defaultValue="0"/></td>
                                  <td><input id={"r"+i+"5"} type="number" className="calib-num"  defaultValue="0"/></td>
                                  <td><input id={"r"+i+"6"} type="number" className="calib-num" defaultValue="0"/></td>
                                </tr>);
        }

        return (
            <div id="SettingsWindow">
                <form>
                    <p>Who starts:</p>
                    <label id="WhoStartsHomeLabel" htmlFor="WhoStartsCheckBox">Rover starts:</label><input
                                                                                                   id="WhoStarts"
                                                                                                   type="checkbox"/>

                    <p>Serving from coordinates:</p>
                    <div>
                        <label id="servingCoordXLabel" htmlFor="servingCoordXNumber">X:</label><input id="servingCoordXNumber"
                                                                                                      type="number"
                                                                                                      min="0"
                                                                                                      max="700"
                                                                                                      defaultValue={this.state.Serve_X}></input>
                    </div>
                    <div>
                        <label id="servingCoordYLabel" htmlFor="servingCoordYNumber">Y:</label><input id="servingCoordYNumber"
                                                                                                      type="number"
                                                                                                      min="700"
                                                                                                      max="1200"
                                                                                                      defaultValue={this.state.Serve_Y}></input>
                    </div>
                    <p>Home coordinates:</p>
                    <div>
                        <label id="homeCoordXLabel" htmlFor="homeCoordXNumber">X:</label><input id="homeCoordXNumber"
                                                                                               type="number"
                                                                                               min="0"
                                                                                               max="700"
                                                                                               defaultValue={this.state.Home_X}></input>
                    </div>
                    <div>
                        <label id="homeCoordYLabel" htmlFor="homeCoordYNumber">Y:</label><input id="homeCoordYNumber"
                                                                                              type="number"
                                                                                              min="600"
                                                                                              max="1200"
                                                                                              defaultValue={this.state.Home_Y}></input>
                    </div>
                    <div>
                        <label id="returnHomeLabel" htmlFor="returnHomeCheckBox">Return home after each shot:</label><input
                                id="returnHomeCheckBox"
                                type="checkbox"/>
                    </div>
                    <div>
                        <div>
                            <p>Turning left calibration (columns are degrees of turn, raws are speed)</p>
                            <table>
                                <thead><tr><th>dir\spd</th><th>10%</th><th>25%</th><th>45%</th><th>60%</th><th>75%</th><th>90%</th><th>100%</th></tr></thead>
                                <tbody>{calibRowsLeft}</tbody>
                            </table>
                            <p>Turning right calibration (columns are degrees of turn, raws are speed)</p>
                            <table>
                                <thead><tr><th>dir\spd</th><th>10%</th><th>25%</th><th>45%</th><th>60%</th><th>75%</th><th>90%</th><th>100%</th></tr></thead>
                                <tbody>{calibRowsRight}</tbody>
                            </table>
                        </div>
                    </div>
                    <button id="settingsSubmitButton" onClick={this.handleSettingsSubmitClick}>Submit</button>

                </form>
            </div>

    );
    }
}
