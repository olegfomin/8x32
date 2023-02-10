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
          "Serve_X" : 460, // The X coordinate where the rover serves from
          "Serve_Y" : 1000, // The Y coordinate where the rover serves from
          "Home_X": 485,    // The X coordinate where the rover goes towards after each shot
          "Home_Y": 1130,   // The Y coordinate where the rover goes towards after each shot
          "ReturnHome": false, // Indicates whether rover head towards Home coordinates above
          "WhoStarts": true, // Defines who starts either your rover or the opponent on the other side of the court
          "OpponentServesNow": true, // If Return Home is true then we put the rover into Home_X, Home_y coordinates otherwise we'll ask the
          "GameStarted": false, // Here all the buttons must be disabled even logoff so that the rover is not controlled
          "EditInProcess" : false, // in this case we disable all the other buttons so it is not possible to have cascading windows that exceed the screen size
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
    const lb = document.getElementById("loginButton");
    const lw = document.getElementById("loginWindow");
    if(!this.state.LoggedIn) {
        window.scrollTo(0, 0);
        lw.style.display = "inherit";
    } else {
        lw.style.display = "none";
        lb.style.color = "black"
        lb.style.fontWeight = "normal";
        lb.innerHTML = "Login";

        this.setState({"LoggedIn" : false});
    }
  }

  // Calling the Settings form that includes Home coordinates, Service coordinates and who begins the game
  handleSettingsClick(event) {
    window.scrollTo(0, 0);
    const sw = document.getElementById("SettingsWindow");
    sw.style.display = "inherit";
    this.EditInProcess = true;
    this.setState({"EditInProcess" : true});
  }

// Settings form completed
  handleSettingsSubmitClick(event) {
      event.preventDefault();
      const sw = document.getElementById("SettingsWindow");
      this.state.WhoStarts = document.getElementById("yourRoverLabel").checked;
      this.state.Serve_X = document.getElementById('servingCoordXNumber').value;
      this.state.Serve_Y = document.getElementById('servingCoordYNumber').value;
      this.state.Home_X = document.getElementById('homeCoordXNumber').value;
      this.state.Home_Y = document.getElementById('homeCoordYNumber').value;
      this.state.ReturnHome = document.getElementById('returnHomeCheckBox').value;
      this.setState({"EditInProcess" : false});

      sw.style.display = "none";
  }

  handleCalibrationClick(event) {
      const cw = document.getElementById("CalibrationWindow");
      cw.style.display = "inherit";
      this.setState({"EditInProcess" : true});
  }

  handleCalibrationSubmitClick(event) {
      event.preventDefault();
      this.setState({"EditInProcess" : false});

  }

  handleAboutClick(event) {
      event.preventDefault();
      const aw = document.getElementById("AboutWindow");
      aw.style.display = "inherit";
      this.setState({"EditInProcess":true});
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
            statusBar["font-weight"] = "normal";
            statusBar.innerHTML = "Please, click the Login button to access the system";
        }, "3400");
    }

    const lw = document.getElementById("loginWindow");
    lw.style.display = "none";
  }

  componentDidMount() {
      const c = document.getElementById("myCanvas");
      this.statusBar = document.getElementById("statusBar");
      const xOffset = c.offsetLeft;
      const xMax = xOffset+c.width;

      const yOffset = c.offsetTop;
      const ctx = c.getContext("2d");
      drawACourt(c);

      const handleMouseMove = (event) => {
          const realX = event.pageX - xOffset >=0 && event.pageX - xOffset <=700 ? event.pageX - xOffset : "Out";
          const realY = event.pageY - yOffset >=82 && event.pageY - yOffset <=1300 ? event.pageY - yOffset : "Out";

          if(this.state.LoggedIn) this.statusBar.innerHTML = `X=${realX}`+`  Y=${realY}`;

      };

      window.addEventListener('mousemove', handleMouseMove);

  }

  render() {
    return (
        <div className="center" height="1300" width="700">
          <div id="controlPanel">
            <button id="loginButton" onClick={this.handleLoginClick || this.state.EditInProcess}>Login</button>
            <button id="settingButton" onClick={this.handleSettingsClick} disabled={!this.state.LoggedIn || this.state.EditInProcess}>Settings</button>
            <button id="calibrationButton" onClick={this.handleCalibrationClick} disabled={!this.state.LoggedIn || this.state.EditInProcess}>Calibration</button>
            <button id="aboutButton" onClick={this.handleAboutClick} disabled={this.state.EditInProcess}>About</button>

            <button id="startButton" onClick={this.handleStartClick} disabled={!this.state.LoggedIn || this.state.EditInProcess}>Start</button>
          </div>
          <div id="statusBar">Please, click the 'Login' button to access the system</div>
          <canvas id="myCanvas" className="center" height="1200" width="590" onClick={this.handleClick}>
            Your browser does not support the HTML canvas tag.
          </canvas>
          <LoginWindow callBackFunction={this.handleLoginCallback} disabled={!this.state.EditInProcess}></LoginWindow>
          <SettingsWindow homeX={this.state.Home_X}
                          homeY={this.state.Home_Y}
                          serveX={this.state.Serve_X}
                          serveY={this.state.Serve_Y}
                          returnHome={this.state.ReturnHome}
                          WhoStarts={this.state.WhoStarts}
                          handleSettingsSubmitClick={this.handleSettingsSubmitClick}/>
          <CalibrationWindow Speed2DirectionArr={this.state.Speed2DirectionArr}
                             handleCalibrationSubmitClick={this.state.handleCalibrationSubmitClick}
                             disabled={!this.state.LoggedIn && !this.state.EditInProcess}/>
          <AboutWindow />
        </div>
    );
  };
};
