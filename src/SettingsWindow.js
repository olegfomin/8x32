import './SettingsWindow.css';
import React, { useRef, useEffect } from 'react';

export default class SettingsWindow extends React.Component {
    componentDidMount() {
    }

    render() {
        return (
            <div id="SettingsWindow">
                <form>
                    <p>Who starts:</p>
                    <label id="yourRoverLabel" htmlFor="YourRoverRB">Your rover</label><input id="YourRoverRB"
                                                                                              name="whoStarts"
                                                                                              type="radio"/>
                    <label id="yourOpponentLabel" htmlFor="YourOpponentRB">Your Opponent</label><input id="YourOpponentRB"
                                                                                                    name="whoStarts"
                                                                                                    type="radio"/>

                    <p>Serving from coordinates:</p>
                    <div>
                        <label id="servingCoordXLabel" htmlFor="servingCoordXNumber">X:</label><input id="servingCoordXNumber"
                                                                                                      type="number"
                                                                                                      value="500" ></input>
                    </div>
                    <div>
                        <label id="servingCoordYLabel" htmlFor="servingCoordYNumber">Y:</label><input id="servingCoordYNumber"
                                                                                                      type="number"></input>
                    </div>
                    <p>Home coordinates:</p>
                    <div>
                        <label id="homeCoordXLabel" htmlFor="homeCoordXNumber">X:</label><input id="homeCoordXNumber"
                                                                                               type="number"
                                                                                               value="300"></input>
                    </div>
                    <div>
                        <label id="homeCoordYLabel" htmlFor="servingYNumber">Y:</label><input id="servingCoordYNumber"
                                                                                             type="number"
                                                                                             value="1200"></input>
                    </div>
                    <div>
                        <label id="returnHomeLabel" htmlFor="returnHomeCheckBox">Return home after shot:</label><input id="returnHomeCheckBox" type="checkbox" value="false"/>
                    </div>
                    <button id="settingsSubmitButton">Submit</button>

                </form>
            </div>
        );
    }
}
