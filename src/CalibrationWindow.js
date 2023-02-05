import './CalibrationWindow.css';
import React, { useRef, useEffect } from 'react';

export default class CalibrationWindow extends React.Component {
    componentDidMount() {
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
                        <select id="directionComboBox" name="direction">
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
                        <select id="directionComboBox" name="direction">
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
                        <label id="speedLabel" htmlFor="deviationNumber">Deviation:</label>
                        <input id="DeviationNumber"
                               type="number"
                               value="0" ></input>
                    </div>
                    <button id="calibrationSubmitButton" onClick={this.props.callBackCalibrationFunction}>Submit</button>
                </div>
            </form>
        </div>);

    }
}
