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
          "Home_X": 345,
          "Home_Y": 850,
          "ReturnHome": false,
          "WhoStarts": true,
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
    alert("I am here " + event.clientX + " " + event.clientY);
  }

  handleLoginClick(event) {
    const lw = document.getElementById("loginWindow");
    lw.style.display = this.state.LoggedIn ? "none" : "inherit";
    const lb = document.getElementById("loginButton");
    lb.textContent = !this.state.LoggedIn ? "Logoff" : "Login";
    lb.innerHTML = !this.state.LoggedIn ? "Logoff" : "Login";

    this.setState({"LoggedIn": !this.state.LoggedIn});
  }

  handleLogoutClick(event) {
    alert("handleLogoutClick");
  }

  handleSettingsClick(event) {
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
     alert("handleStartClick "+this.state.LoggedIn);
      window.scrollTo(0, 900)
  }

  handleLoginCallback(event) {
    event.preventDefault();

    this.setState({
        "LoggedIn": true
    });

    const lb = document.getElementById("loginButton");
    lb.innerHTML = "Logoff";

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
          const realX = event.clientX - xOffset >=0 && event.clientX - xOffset <=700 ? event.clientX - xOffset : "Out";
          const realY = event.clientY - yOffset >=82 && event.clientY - yOffset <=930 ? event.clientY - yOffset : "Out";

          statusBar.innerHTML = `X=${realX}`+`  Y=${realY}`;

      };

      window.addEventListener('mousemove', handleMouseMove);

  }




  render() {
    return (
        <div className="center" height="1300" width="700">
          <div id="controlPanel">
            <button id="loginButton" onClick={this.handleLoginClick}>Login</button>
            <button id="settingButton" onClick={this.handleSettingsClick} disabled={!this.state.LoggedIn && this.state.isMounted}>Settings</button>
            <button id="calibrationButton" onClick={this.handleCalibrationClick} disabled={!this.state.LoggedIn}>Calibration</button>
            <button id="aboutButton" onClick={this.handleAboutClick}>About</button>

            <button id="startButton" onClick={this.handleStartClick} disabled={!this.state.LoggedIn}>Start</button>
          </div>
          <div id="statusBar">Here is a status</div>
          <canvas id="myCanvas" className="center" height="1200" width="590" onClick={this.handleClick}>
            Your browser does not support the HTML canvas tag.
          </canvas>
          <LoginWindow defaultName={"rudolf"} callBackFunction={this.handleLoginCallback}></LoginWindow>
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
