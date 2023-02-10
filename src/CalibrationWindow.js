import './CalibrationWindow.css';
import React, { useRef, useEffect } from 'react';
/* This form contains two tables the first one the correctional data while rover turns left with different speeds
and the other one also contains 2D array with correctional data while the rover turns right
 */
export default class CalibrationWindow extends React.Component {

    constructor(state) {
        super(state);
        this.selectedSpeedIndex = 0;
        this.selectedDirectionIndex = 0;
        this.onSpeedChange = this.onSpeedChange.bind(this);
        this.onDirectionChange = this.onDirectionChange.bind(this);
        this.directionIntoIndex = this.directionIntoIndex.bind(this);
        this.speedIntoIndex = this.speedIntoIndex.bind(this);
        this.onDeviationNumberChange = this.onDeviationNumberChange.bind();
    }
    componentDidMount() {
    }

    directionIntoIndex(dirVal) {
        switch (dirVal) {
            case "straight": return 0;
            case "left10": return 1;
            case "left25": return 2;
            case "left45": return 3;
            case "left60": return 4;
            case "left75": return 5;
            case "left90": return 6;
            case "left120": return 7;
            case "left145": return 8;
            case "right10": return 9;
            case "right25": return 10;
            case "right45": return 11;
            case "right60": return 12;
            case "right75": return 13;
            case "right90": return 14;
            case "right120": return 15;
            case "right145": return 16;
            default: throw new Error(`Unknown value: ${dirVal}`)

        }
    }

    indexIntoDirection(index) {
        switch(index) {
            case 0: return "straight";
            case 1: return "left10";
            case 2: return "left25";
            case 3: return "left45";
            case 4: return "left60";
            case 5: return "left75";
            case 6: return "left90";
            case 7: return "left120";
            case 8: return "left145";
            case 9: return "right10";
            case 10: return "right25";
            case 11: return "right45";
            case 12: return "right60";
            case 13: return "right75";
            case 14: return "right90";
            case 15: return "right120";
            case 16: return "right145";
            default: throw new Error("ArrayOutOfBound: "+index);
        }
    }

    speedIntoIndex(speed) {
        switch (speed) {
            case "fullSpeed": return 0;
            case "10%": return 1;
            case "20%": return 2;
            case "30%": return 3;
            case "40%": return 4;
            case "50%": return 5;
            case "60%": return 6;
            case "70%": return 7;
            case "80%": return 8;
            case "90%": return 9;
            default: throw new Error("Unknown speed value: "+speed);
        }
    }

    indexIntoSpeed(index) {
        switch (index) {
            case 0: return "10%";
            case 1: return "20%";
            case 2: return "30%";
            case 3: return "40%";
            case 4: return "50%";
            case 5: return "60%";
            case 6: return "70%";
            case 7: return "80%";
            case 8: return "90%";
            case 9: return "100%";
            default: throw new Error("Speed ArrayOutOfBound: "+index);
        }
    }

    onSpeedChange() {
      const element = document.getElementById("speedComboBox");
      this.selectedSpeedIndex = this.speedIntoIndex(element.value);
      const devNumberElement = document.getElementById("DeviationNumber");
      devNumberElement.defaultValue = this.props.Speed2DirectionArr[this.selectedSpeedIndex][this.selectedDirectionIndex];
    }

    onDirectionChange() {
        const element = document.getElementById("directionComboBox");
        this.selectedDirectionIndex = this.directionIntoIndex(element.value);
        const devNumberElement = document.getElementById("DeviationNumber");
        devNumberElement.defaultValue = this.props.Speed2DirectionArr[this.selectedSpeedIndex][this.selectedDirectionIndex];

    }

    onDeviationNumberChange() {
        const element = document.getElementById("DeviationNumber");
        this.props.Speed2DirectionArr[this.selectedSpeedIndex][this.selectedDirectionIndex] = element.value;

    }

    render() {
        const calibRowsLeft = [];
        for(let i=0; i<10; i++){
            calibRowsLeft.push(<tr key={"l"+i} id={"l"+i}><td>{this.indexIntoSpeed(i)}</td><td><input id={"l"+i+"0"} type="number" className="calib-num" defaultValue="0"/></td><td><input id={"l"+i+"1"} type="number" className="calib-num"  defaultValue="0"/></td><td><input id={"l"+i+"2"} type="number" className="calib-num"  defaultValue="0"/></td><td><input id={"l"+i+"3"} type="number" className="calib-num"  defaultValue="0"/></td><td><input id={"l"+i+"4"} type="number" className="calib-num"  defaultValue="0"/></td><td><input id={"l"+i+"5"} type="number" className="calib-num"  defaultValue="0"/></td><td><input id={"l"+i+"7"} type="number" className="calib-num" defaultValue="0"/></td></tr>);
        }
        const calibRowsRight = [];
        for(let i=0; i<10; i++){
            calibRowsRight.push(<tr key={"r"+i} id={"r"+i}><td>{this.indexIntoSpeed(i)}</td><td><input id={"r"+i+"0"} type="number" className="calib-num" defaultValue="0"/></td><td><input id={"r"+i+"1"} type="number" className="calib-num"  defaultValue="0"/></td><td><input id={"r"+i+"2"} type="number" className="calib-num"  defaultValue="0"/></td><td><input id={"r"+i+"3"} type="number" className="calib-num"  defaultValue="0"/></td><td><input id={"r"+i+"4"} type="number" className="calib-num"  defaultValue="0"/></td><td><input id={"r"+i+"5"} type="number" className="calib-num"  defaultValue="0"/></td><td><input id={"r"+i+"7"} type="number" className="calib-num" defaultValue="0"/></td></tr>);
        }
        return (
        <div id="CalibrationWindow">
            <form>
                <p>Select direction in degrees and speed in percents of full power</p>
                <p>Deviations to the left provided with minus sign</p>
                <p>Deviations to the right should not be supplied with any sign</p>
                <p>The suggested correction is provided in percent the left motor
                   supplied with more or less power over the right motor </p>
                <div>
                    <div>
                        <p>Turning left</p>
                        <table>
                            <thead><tr><th>dir\spd</th><th>10%</th><th>25%</th><th>45%</th><th>60%</th><th>75%</th><th>90%</th><th>100%</th></tr></thead>
                            <tbody>{calibRowsLeft}</tbody>
                        </table>
                        <p>Turning right</p>
                        <table>
                            <thead><tr><th>dir\spd</th><th>10%</th><th>25%</th><th>45%</th><th>60%</th><th>75%</th><th>90%</th><th>100%</th></tr></thead>
                            <tbody>{calibRowsRight}</tbody>
                        </table>
                    </div>
                    <button id="calibrationSubmitButton" onClick={this.props.handleCalibrationSubmitClick}>Submit</button>
                </div>
            </form>
        </div>);

    }
}
