import './Court.css';
import React, { useRef, useEffect } from 'react';
import Menu from "./Menu"
import ReactDOM from "react-dom/client";
import drawACourt from "./DrawCourtFunction"
import LoginWindow from "./LoginWindow";
import SettingsWindow from "./SettingsWindow";
import CalibrationWindow from "./CalibrationWindow";
import AboutWindow from "./AboutWindow";

export default class Court extends React.Component {

  constructor(props) {
      super(props);
      this.handleLoginCallback = this.handleLoginCallback.bind(this);
      this.handleAboutClick = this.handleAboutClick.bind(this);
      this.handleLoginClick = this.handleLoginClick.bind(this);
      this.handleSettingsClick = this.handleSettingsClick.bind(this);
      this.handleStartClick = this.handleStartClick.bind(this);
      this.handleSettingsSubmitClick = this.handleSettingsSubmitClick.bind(this);
      this.state = {
          "LoggedIn": false,
          "Serve_X" : 460,
          "Serve_Y" : 1000,
          "Home_X": 485,
          "Home_Y": 1130,
          "ReturnHome": false,
          "WhoStarts": true,
          "OpponentServesNow": true,
          "GameStarted": false,
          Speed2DirectionArr: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                               [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                               [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                               [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                               [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                               [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                               [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                               [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                               [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                               [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
      };
  }

  handleClick(event) {
    alert("I am here " + event.pageX + " " + event.pageY);
  }

  handleLoginClick(event) {
    window.scrollTo(0, 0);
    const lw = document.getElementById("loginWindow");
    lw.style.display = this.state.LoggedIn ? "none" : "inherit";
    const lb = document.getElementById("loginButton");
/*    lb.textContent = !this.state.LoggedIn ? "Logoff" : "Login";
    lb.innerHTML = !this.state.LoggedIn ? "Logoff" : "Login"; */

/*    this.setState({"LoggedIn": !this.state.LoggedIn}); */
  }

  handleSettingsClick(event) {
    window.scrollTo(0, 0);
    const sw = document.getElementById("SettingsWindow");
    sw.style.display = "inherit";
  }

  handleSettingsSubmitClick(event) {

      event.preventDefault();
      const sw = document.getElementById("SettingsWindow");
      this.state.WhoStarts = document.getElementById("yourRoverLabel").checked;
      this.state.Serve_X = document.getElementById('servingCoordXNumber').value;
      this.state.Serve_Y = document.getElementById('servingCoordYNumber').value;
      this.state.Home_X = document.getElementById('homeCoordXNumber').value;
      this.state.Home_Y = document.getElementById('homeCoordYNumber').value;
      this.state.ReturnHome = document.getElementById('returnHomeCheckBox').value;

      sw.style.display = "none";
  }

  handleCalibrationClick(event) {
      const cw = document.getElementById("CalibrationWindow");
      cw.style.display = "inherit";
  }

  handleCalibrationSubmitClick(event) {

  }

  handleAboutClick(event) {
      event.preventDefault();
      const aw = document.getElementById("AboutWindow");
      aw.style.display = "inherit";
  }

  handleStartClick(event) {
      const startButton = document.getElementById("startButton");
      startButton.innerHTML = "Connect...";
      setTimeout(() => {
          startButton.style.color = "red";
          startButton["font-weight"] = "bold";
          startButton.innerHTML = "Stop";
      }, "2500");

      this.setState({"GameStarted":true});
      window.scrollTo(0, 500);
  }

  handleLoginCallback(event) {
    event.preventDefault();
    const userName = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if(userName === 'rudolf' && password === "123") {
        const lb = document.getElementById("loginButton");

        lb.style.color = "red";
        lb.style["font-weight"] = "bold";
        lb.innerHTML = "Logoff";
        this.setState({
            "LoggedIn": true
        });
    } else {
        this.setState({
            "LoggedIn": false
        });
        const statusBar = document.getElementById("statusBar");
        statusBar.style.color = "red";
        statusBar.style["font-weight"] = "bold";

        statusBar.innerHTML = "Login failed";
        setTimeout(() => {
            statusBar.style.color = "black";
            statusBar["font-weight"] = "normal";
            statusBar.innerHTML = "Login failed";
        }, "1");
    }

    const lw = document.getElementById("loginWindow");
    lw.style.display = "none";
  }

  componentDidMount() {
      const c = document.getElementById("myCanvas");
      const statusBar = document.getElementById("statusBar");
      const myCanvas = document.getElementById("myCanvas");
      const xOffset = myCanvas.offsetLeft;
      const xMax = xOffset+myCanvas.width;

      const yOffset = myCanvas.offsetTop;
      const ctx = c.getContext("2d");
      drawACourt(c);

      const handleMouseMove = (event) => {
          const realX = event.pageX - xOffset >=0 && event.pageX - xOffset <=700 ? event.pageX - xOffset : "Out";
          const realY = event.pageY - yOffset >=82 && event.pageY - yOffset <=1300 ? event.pageY - yOffset : "Out";

          if(this.state.LoggedIn) statusBar.innerHTML = `X=${realX}`+`  Y=${realY}`;

      };

      window.addEventListener('mousemove', handleMouseMove);

  }

  render() {
    return (
        <div className="center" height="1300" width="700">
          <div id="controlPanel">
            <button id="loginButton" onClick={this.handleLoginClick}>Login</button>
            <button id="settingButton" onClick={this.handleSettingsClick} disabled={!this.state.LoggedIn}>Settings</button>
            <button id="calibrationButton" onClick={this.handleCalibrationClick} disabled={!this.state.LoggedIn}>Calibration</button>
            <button id="aboutButton" onClick={this.handleAboutClick}>About</button>

            <button id="startButton" onClick={this.handleStartClick} disabled={!this.state.LoggedIn}>Start</button>
          </div>
          <div id="statusBar">Here is a status</div>
          <canvas id="myCanvas" className="center" height="1200" width="590" onClick={this.handleClick}>
            Your browser does not support the HTML canvas tag.
          </canvas>
          <LoginWindow callBackFunction={this.handleLoginCallback}></LoginWindow>
          <SettingsWindow homeX={this.state.Home_X}
                          homeY={this.state.Home_Y}
                          serveX={this.state.Serve_X}
                          serveY={this.state.Serve_Y}
                          returnHome={this.state.ReturnHome}
                          WhoStarts={this.state.WhoStarts}
                          handleSettingsSubmitClick={this.handleSettingsSubmitClick}/>
          <CalibrationWindow Speed2DirectionArr={this.state.Speed2DirectionArr}/>
          <AboutWindow />
        </div>
    );
  };
};
