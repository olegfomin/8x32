import './SettingsWindow.css';
import React, { useRef, useEffect } from 'react';


export default class SettingsWindow extends React.Component {

    constructor(props) {
        super(props);
        this.speedIntoIndex = this.speedIntoIndex.bind(this);

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
                                  <td><input id={"r"+i+"7"} type="number" className="calib-num" defaultValue="0"/></td>
                                </tr>);
        }

        return (
            <div id="SettingsWindow">
                <form>
                    <p>Who starts:</p>
                    <label id="yourRoverLabel" htmlFor="YourRoverRB">Your rover</label><input id="YourRoverRB"
                                                                                              name="whoStarts"
                                                                                              type="radio"/>
                    <label id="yourOpponentLabel" htmlFor="YourOpponentRB">Your Opponent</label><input id="YourOpponentRB"
                                                                                                    name="whoStarts"
                                                                                                    type="radio"
                                                                                                    defaultChecked={true} />

                    <p>Serving from coordinates:</p>
                    <div>
                        <label id="servingCoordXLabel" htmlFor="servingCoordXNumber">X:</label><input id="servingCoordXNumber"
                                                                                                      type="number"
                                                                                                      min="0"
                                                                                                      max="700"
                                                                                                      defaultValue={this.props.serveX}></input>
                    </div>
                    <div>
                        <label id="servingCoordYLabel" htmlFor="servingCoordYNumber">Y:</label><input id="servingCoordYNumber"
                                                                                                      type="number"
                                                                                                      min="700"
                                                                                                      max="1200"
                                                                                                      defaultValue={this.props.serveY}></input>
                    </div>
                    <p>Home coordinates:</p>
                    <div>
                        <label id="homeCoordXLabel" htmlFor="homeCoordXNumber">X:</label><input id="homeCoordXNumber"
                                                                                               type="number"
                                                                                               min="0"
                                                                                               max="700"
                                                                                               defaultValue={this.props.homeX}></input>
                    </div>
                    <div>
                        <label id="homeCoordYLabel" htmlFor="servingYNumber">Y:</label><input id="homeCoordYNumber"
                                                                                             type="number"
                                                                                             min="600"
                                                                                             max="1200"
                                                                                             defaultValue={this.props.homeY}></input>
                    </div>
                    <div>
                        <label id="returnHomeLabel" htmlFor="returnHomeCheckBox">Return home after each shot:</label><input id="returnHomeCheckBox" type="checkbox" value={this.props.returnHome}/>
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
                    <button id="settingsSubmitButton" onClick={this.props.handleSettingsSubmitClick}>Submit</button>

                </form>
            </div>

    );
    }
}
