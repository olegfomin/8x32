import './CalibrationWindow.css';
import React from 'react';
/* This form contains two tables the first one the correctional data while rover turns left with different speeds
and the other one also contains 2D array with correctional data while the rover turns right
 */
export default class CalibrationWindow extends React.Component {

    constructor(state) {
        super(state);
        this.speedIntoIndex = this.speedIntoIndex.bind(this);
    }

    componentDidMount() {
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
