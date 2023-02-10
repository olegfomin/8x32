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
                        <label id="returnHomeLabel" htmlFor="returnHomeCheckBox">Return home after shot:</label><input id="returnHomeCheckBox" type="checkbox" value={this.props.returnHome}/>
                    </div>
                    <button id="settingsSubmitButton" onClick={this.props.handleSettingsSubmitClick}>Submit</button>

                </form>
            </div>
        );
    }
}
