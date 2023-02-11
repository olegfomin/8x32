import './Court.css';
import React from 'react';
import drawACourt from "./DrawCourtFunction"
import LoginWindow from "./LoginWindow";
import SettingsWindow from "./SettingsWindow";
import CalibrationWindow from "./CalibrationWindow";
import AboutWindow from "./AboutWindow";
import RoverWindow from "./RoverWindow";

export default class Court extends React.Component {

  constructor(props) {
      super(props);
      this.handleLoginCallback = this.handleLoginCallback.bind(this);
      this.handleAboutClick = this.handleAboutClick.bind(this);
      this.handleLoginClick = this.handleLoginClick.bind(this);
      this.handleSettingsClick = this.handleSettingsClick.bind(this);
      this.handleStartClick = this.handleStartClick.bind(this);
      this.handleSettingsSubmitClick = this.handleSettingsSubmitClick.bind(this);
      this.handleCalibrationClick = this.handleCalibrationClick.bind(this);
      this.handleCalibrationSubmitClick = this.handleCalibrationSubmitClick.bind(this);
      this.handleAboutSubmitClick = this.handleAboutSubmitClick.bind(this);
      this.state = {
          "LoggedIn": false,
          "Serve_X" : 500, // The X coordinate where the rover serves from
          "Serve_Y" : 1120, // The Y coordinate where the rover serves from
          "Home_X": 345,    // The X coordinate where the rover goes towards after each shot
          "Home_Y": 1110,   // The Y coordinate where the rover goes towards after each shot
          "Reachable_Rect_X_From": 444,
          "Reachable_Rect_Y_from": 700,
          "Reachable_Rect_X_to": 444,
          "Reachable_Rect_Y_to": 700,
          "ReturnHome": false, // Indicates whether rover head towards Home coordinates above
          "WhoStarts": true, // Defines who starts either your rover or the opponent on the other side of the court
          "OpponentServesNow": true, // If Return Home is true then we put the rover into Home_X, Home_y coordinates otherwise we'll ask the
          "GameStarted": false, // Here all the buttons must be disabled even logoff so that the rover is not controlled
          "ConnectionInProcess": false, // The connection with rover's being established
          "isConnected": false, // The connection with a rover has been established
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
      this.state.WhoStarts = document.getElementById('YourRoverRB').value;
      console.log("this.state.WhoStarts="+this.state.WhoStarts);
      this.state.Serve_X = parseInt(document.getElementById('servingCoordXNumber').value);
      this.state.Serve_Y = parseInt(document.getElementById('servingCoordYNumber').value);
      this.state.Home_X = parseInt(document.getElementById('homeCoordXNumber').value);
      this.state.Home_Y = parseInt(document.getElementById('homeCoordYNumber').value);
      this.state.ReturnHome = document.getElementById('returnHomeCheckBox').value;
      this.setState({"EditInProcess" : false});

      sw.style.display = "none";
  }

  handleCalibrationClick(event) {
      this.cw.style.display = "inherit";
      this.setState({"EditInProcess" : true});
  }

  handleCalibrationSubmitClick(event) {
      this.cw.style.display = "none";
      event.preventDefault();
      this.setState({"EditInProcess" : false});

  }

  handleAboutClick(event) {
      event.preventDefault();
      this.aw.style.display = "inherit";
      this.setState({"EditInProcess":true});
  }

    handleAboutSubmitClick(event) {
        event.preventDefault();
        this.aw.style.display = "none";
        this.setState({"EditInProcess":false});

    }

  calculateRoverY(mouseY) {
      return 800-mouseY;
  }

  handleStartClick(event) {
      if(this.state.isConnected) { // If it is already connected then disconnect the rover
          this.startButton.innerHTML = "Disconnect...";
          setTimeout(() => {
              this.startButton.style.color = "black";
              this.startButton["font-weight"] = "normal";
              this.startButton.innerHTML = "Start";
              this.setState({"GameStarted":false});
              this.setState({"ConnectionInProcess":false});
              this.setState({"isConnected":false});
          }, "1500");
      } else { // if the rover connecting the fun begins
          if(!this.state.ConnectionInProcess) {
              this.state.connectionInProcess = true;
              this.startButton.innerHTML = "Connect...";
              setTimeout(() => {
                  this.startButton.style.color = "red";
                  this.startButton["font-weight"] = "bold";
                  this.startButton.innerHTML = "Stop";
                  this.setState({"GameStarted":true});
                  this.setState({"ConnectionInProcess":false});
                  this.setState({"isConnected":true});
              }, "2500");
              console.log("WhoStarts="+this.state===true);
              if(this.state.WhoStarts) { // The rover starts then put it on the serving position and asking the user to show the place where the rover shoots
                  this.statusBar.innerHTML = "Aim the ball into the service area";
                  this.rover.top = this.calculateRoverY(this.state.Serve_Y);
                  this.rover.left = this.state.Serve_X;
                  window.scrollTo(0, 0); // Rolling the scroller to the end
              } else {
                  this.rover.top = this.calculateRoverY(this.state.Home_Y);
                  this.rover.left = this.state.Home_X;
                  this.statusBar.innerHTML = "Point the area where the rover must go";
                  window.scrollTo(0, 500); // Rolling the scroller to the end
              }

          }
      };

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
      this.cw = document.getElementById("CalibrationWindow");
      this.aw = document.getElementById("AboutWindow");
      this.startButton = document.getElementById("startButton");
      this.rover = document.getElementById("Rover");

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
            <button id="loginButton" onClick={this.handleLoginClick} disabled={this.state.EditInProcess || this.state.isConnected}>Login</button>
            <button id="settingButton" onClick={this.handleSettingsClick} disabled={!this.state.LoggedIn || this.state.EditInProcess || this.state.isConnected}>Settings</button>
            <button id="calibrationButton" onClick={this.handleCalibrationClick} disabled={!this.state.LoggedIn || this.state.EditInProcess || this.state.isConnected}>Calibration</button>
            <button id="aboutButton" onClick={this.handleAboutClick} disabled={this.state.EditInProcess || this.state.isConnected}>About</button>

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
                             handleCalibrationSubmitClick={this.handleCalibrationSubmitClick}
                             disabled={!this.state.LoggedIn && !this.state.EditInProcess}/>
          <AboutWindow handleAboutSubmitClick={this.handleAboutSubmitClick} disabled={!this.state.LoggedIn}/>
          <RoverWindow visible={this.state.isConnected} />
        </div>
    );
  };
};