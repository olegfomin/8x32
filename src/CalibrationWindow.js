import './CalibrationWindow.css';
import React, { useRef, useEffect } from 'react';

export default class CalibrationWindow extends React.Component {
    componentDidMount() {
    }

    render() {
        return (
        <div id="SettingsWindow">
            <form>
                <p>Going straight 10m:</p>
                <p>Left deviation minus, </p>
                <p>Right deviation plus</p>

                <div>
                    <label id="straight10MLabel" htmlFor="straight10MNumber">Deviation:</label><input id="straight10MNumber"
                                                                                              type="number"
                                                                                              value="0" ></input>
                </div>
            </form>
        </div>);

    }
}
