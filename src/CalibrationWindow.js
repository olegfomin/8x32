import './CalibrationWindow.css';
import React, { useRef, useEffect } from 'react';

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
            case 0: return "fullSpeed";
            case 1: return "10%";
            case 2: return "20%";
            case 3: return "30%";
            case 4: return "40%";
            case 5: return "50%";
            case 6: return "60%";
            case 7: return "70%";
            case 8: return "80%";
            case 9: return "90%";
            default: throw new Error("Speed ArrayOutOfBound: "+index);
        }
    }

    onSpeedChange() {
      const element = document.getElementById("speedComboBox");
      this.selectedSpeedIndex = this.speedIntoIndex(element.value);
    }

    onDirectionChange() {
        const element = document.getElementById("directionComboBox");
        this.selectedDirectionIndex = this.directionIntoIndex(element.value);
    }

    onDeviationNumberChange() {
        const element = document.getElementById("DeviationNumber");
        this.props.Speed2DirectionArr[this.selectedSpeedIndex][this.selectedDirectionIndex] = element.value;

    }

    render() {
        return (
        <div id="CalibrationWindow">
            <form>
                <p>Select direction and speed</p>
                <p>Deviations to the left provide with minus sign</p>
                <p>Deviations to the right do not provide with any sign</p>
                <div>
                    <div>
                        <label id="directionLabel" htmlFor="directionComboBox">Direction:</label>
                        <select id="directionComboBox" name="direction" onChange={this.onDirectionChange}>
                            <option value="straight">Straight</option>
                            <option value="left10">Left 10 degrees</option>
                            <option value="left25">Left 25 degrees</option>
                            <option value="left45">Left 45 degrees</option>
                            <option value="left60">Left 60 degrees</option>
                            <option value="left75">Left 75 degrees</option>
                            <option value="left90">Left 90 degrees</option>
                            <option value="left120">Left 120 degrees</option>
                            <option value="left145">Left 145 degrees</option>
                            <option value="right10">Right 10 degrees</option>
                            <option value="right25">Right 25 degrees</option>
                            <option value="right45">Right 45 degrees</option>
                            <option value="right60">Right 60 degrees</option>
                            <option value="right75">Right 75 degrees</option>
                            <option value="right90">Right 90 degrees</option>
                            <option value="right120">Right 120 degrees</option>
                            <option value="right145">Right 145 degrees</option>
                        </select>
                    </div>
                    <div>
                        <label id="speedLabel" htmlFor="speedComboBox">Speed:</label>
                        <select id="speedComboBox" name="direction" onChange={this.onSpeedChange} defaultValue={this.props.Speed2DirectionArr[this.selectedSpeedIndex][this.selectedDirectionIndex]}>
                            <option value="fullSpeed">Full speed</option>
                            <option value="percent90">90%</option>
                            <option value="percent80">80%</option>
                            <option value="percent70">70%</option>
                            <option value="percent60">60%</option>
                            <option value="percent50">50%</option>
                            <option value="percent40">40%</option>
                            <option value="percent30">30%</option>
                            <option value="percent20">20%</option>
                            <option value="percent10">10%</option>
                        </select>
                    </div>
                    <div>
                        <label id="deviationNumberLabel" htmlFor="DeviationNumber" onChange={this.onDirectionChange}>Deviation:</label>
                        <input id="DeviationNumber"
                               type="number"
                               defaultValue={this.props.Speed2DirectionArr[this.selectedSpeedIndex][this.selectedDirectionIndex]}
                               onChange={this.onDeviationNumberChange}
                        ></input>
                    </div>
                    <button id="calibrationSubmitButton" onClick={this.props.callBackCalibrationFunction}>Submit</button>
                </div>
            </form>
        </div>);

    }
}
