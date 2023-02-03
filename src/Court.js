import './Court.css';
import React, { useRef, useEffect } from 'react';
import Menu from "./Menu"
import ReactDOM from "react-dom/client";
import drawACourt from "./DrawCourtFunction"
import LoginWindow from "./LoginWindow";

export default class Court extends React.Component {

  constructor(props) {
      super(props);
      this.handleLoginCallback = this.handleLoginCallback.bind(this);
      this.handleAboutClick = this.handleAboutClick.bind(this);
      this.handleLoginClick = this.handleLoginClick.bind(this);
      this.state = {
          "LoggedIn": false
      };
  }

  handleClick(event) {
    alert("I am here " + event.clientX + " " + event.clientY);
  }

  handleLoginClick(event) {
    const lw = document.getElementById("loginWindow");
    lw.style.display = this.state.LoggedIn ? "none" : "inherit";
    const lb = document.getElementById("loginButton");
    lb.innerHTML = !this.state.LoggedIn ? "Logoff" : "Login";

    this.setState({"LoggedIn": !this.state.LoggedIn});
  }

  handleLogoutClick(event) {
    alert("handleLogoutClick");
  }

  handleSettingsClick(event) {
    alert("handleSettingsClick");
  }

  handleCalibrationClick(event) {
    alert("handleCalibrationClick");
  }

  handleAboutClick(event) {
    alert("handleAboutClick "+this.state.LoggedIn);
  }

  handleStartClick(event) {
     alert("handleStartClick "+this.state.LoggedIn);
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
      const ctx = c.getContext("2d");
      drawACourt(c);
  }

  render() {
    return (
        <div className="center" height="1300" width="700">
          <div>
            <button id="loginButton" onClick={this.handleLoginClick}>Login</button>
            <button id="settingButton" onClick={this.handleSettingsClick} disabled={!this.state.LoggedIn}>Settings</button>
            <button id="calibrationButton" onClick={this.handleCalibrationClick} disabled={!this.state.LoggedIn}>Calibration</button>
            <button id="aboutButton" onClick={this.handleAboutClick}>About</button>
            <button id="startButton" onClick={this.handleStartClick} disabled={!this.state.LoggedIn}>Start</button>
          </div>
          <canvas id="myCanvas" className="center" height="1200" width="590" onClick={this.handleClick}>
            Your browser does not support the HTML canvas tag.
          </canvas>
          <LoginWindow defaultName={"rudolf"} callBackFunction={this.handleLoginCallback}></LoginWindow>
        </div>
    );
  };
};
