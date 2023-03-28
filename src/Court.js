import './Court.css';
import React from 'react';
import drawACourt from "./DrawCourtFunction"
import LoginWindow from "./LoginWindow";
import SettingsWindow from "./SettingsWindow";
import AboutWindow from "./AboutWindow";
import {Buffer} from 'buffer';
import RouteMaker from "./RouteMaker";
import ControlPanel from "./ControlPanel";
import RemoteCommunication from "./RemoteCommunication"
import SettingCommunicationAdapter from "./SettingCommunicationAdapter";
import SettingsCommunication from "./SettingsCommunication";
import WebSocketHandler from "./WebSocketHandler";

export default class Court extends React.Component {
    BASE_URL = "ws://www.roboticrover.com:5000/"
    X_DMZ_TOP_LEFT_COORD   = 70;
    Y_DMZ_TOP_LEFT_COORD   = 524;
    X_DMZ_BOTTOM_RIGHT_COORD = 500;
    Y_DMZ_BOTTOM_RIGHT_COORD = 563;

    startButton;
    statusBar;
    lw;
    cw;
    webSocket;

    constructor(props) {
        super(props);
        this.remoteCommunication = new RemoteCommunication(this);
        this.xOffset = 0; // Temporary setting/declaring this variable to zero they will take their correct value
        this.yOffset = 0; // when component mounts
        this.webSocketHandler = new WebSocketHandler(this);

        this.routeMaker = new RouteMaker(this);
        this.handleLoginCallback = this.handleLoginCallback.bind(this);
        this.handleAboutClick = this.handleAboutClick.bind(this);
        this.handleLoginClick = this.handleLoginClick.bind(this);
        this.handleSettingsClick = this.handleSettingsClick.bind(this);
        this.handleStartClick = this.handleStartClick.bind(this);
        this.handleSettingsSubmitClick = this.handleSettingsSubmitClick.bind(this);
        this.handleAboutSubmitClick = this.handleAboutSubmitClick.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.redrawPicture = this.redrawPicture.bind(this);
        this.successfulLogin = this.successfulLogin.bind(this);
        this.failedLogin = this.failedLogin.bind(this);
        this.showInfoMessage = this.showInfoMessage.bind(this);
        this.showErrorMessage = this.showErrorMessage.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.settingsRetrieved = this.settingsRetrieved.bind(this);
        this.login2DeviceFailed=this.login2DeviceFailed.bind(this);
        this.login2DeviceSucceeded=this.login2DeviceSucceeded.bind(this);
        this.connectedToDevice=this.connectedToDevice.bind(this);
        this.coordinatesReceivedByDevice = this.coordinatesReceivedByDevice.bind(this);
        this.loggedOffFromDevice = this.loggedOffFromDevice.bind(this);
        this.deviceFailed = this.deviceFailed.bind(this);
        const settingCommunicationAdapter = new SettingCommunicationAdapter(this);
        this.settingsCommunication = new SettingsCommunication(settingCommunicationAdapter);

        this.state = {
            "LoggedIn": false,
            "SecurityToken": null,
            "LastSecurityTokenUpdate": 0,
            "Serve_X": 376, // The X coordinate where the rover serves from
            "Serve_Y": 946, // The Y coordinate where the rover serves from
            "Home_X": 291,    // The X coordinate where the rover goes towards after each shot
            "Home_Y": 946,   // The Y coordinate where the rover goes towards after each shot
            "Current_X": 291,
            "Current_Y": 946,
            "Target_X": 400,
            "Target_Y": 1120,
            "ReturnHome": false, // Indicates whether rover head towards Home coordinates above
            "WhoStarts": false, // Defines who starts either your rover or the opponent on the other side of the court
            "OpponentServesNow": true, // If Return Home is true then we put the rover into Home_X, Home_y coordinates otherwise we'll ask the
            "EditInProcess": false, // in this case we disable all the other buttons so it is not possible to have cascading windows that exceed the screen size
            "isValidSpace": false,
            "HeartBeatAgentId": "",
            "wsConnecting" : false,
            "wsConnected": false, // The connection with rover's being established
            "wsLoggedIn": false,
            "speed2LeftDegreeArray":[[]],
            "speed2RightDegreeArray":[[]]
        };
    }

    showInfoMessage(msg) {
        const messageBefore = this.statusBar.innerHTML;
        this.statusBar.style.color = "black";
        this.statusBar["font-weight"] = "normal";
        this.statusBar.innerHTML = msg;

        setTimeout(() => {
            this.statusBar.innerHTML = messageBefore;
        }, "3500");
    }
    showErrorMessage(msg) {
        const messageBefore = this.statusBar.innerHTML;
        this.statusBar.style.color = "red";
        this.statusBar["font-weight"] = "bold";
        this.statusBar.innerHTML = msg;
        setTimeout(() => {
            this.statusBar.style.color = "black";
            this.statusBar["font-weight"] = "normal";
            this.statusBar.innerHTML = messageBefore;
        }, "3500");
    }

    // Redraws the entire picture of the court with the 'Rover' circle in the new place
    redrawPicture(x, y) {
        drawACourt(this.ctx);
        this.ctx.fillStyle = "orange";
        this.ctx.beginPath();  //start the path
        this.ctx.arc(x, y, 12, 0, Math.PI * 2); //draw the circle
        this.ctx.fill();
        this.ctx.fillStyle = "gray";
        this.ctx.beginPath();  //start the path
        this.ctx.arc(x, y, 10, 0, Math.PI * 2); //draw the circle
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.fillStyle = "yellow";
        this.ctx.font = "12px Arial";
        this.ctx.fillText("R", x - 5, y + 3);
        this.ctx.closePath(); //close the circle path
        this.ctx.fill(); //fill the circle
    }

// This handler would move the picture of the rover towards the point where the mouse
// was clicked on. It may become a route of several vectors if the current position of the rover is
// located on the opposite side of the net
    handleClick(event) {
        if (this.state.wsConnected) { // Rover should move now
            if(this.state.isValidSpace) {
                let xy = this.getMousePos(this.canvas, event);
                this.routeMaker.handleClick(this.state.Current_X, this.state.Current_Y, xy.x, xy.y, this.state.ReturnHome);
            } else {
                this.showErrorMessage("The invalid target position. Please move cursor");
            }
        } else {
            this.showInfoMessage("The device has NOT been connected yet");
        }

    }

    handleLoginClick(event) {
        const lb = document.getElementById("loginButton");
        if (!this.state.LoggedIn) {
            drawACourt(this.ctx); // Removing "Robotic Rover Control Panel" on the first click
            window.scrollTo(0, 0);
            this.lw.style.display = "inherit"; // Making window 'Login' visible
        } else {
            this.lw.style.display = "none";
            this.setState({"LoggedIn": false});
        }
    }

    // Calling the Settings form that includes Home coordinates, Service coordinates and who begins the game
    handleSettingsClick(event) {
        window.scrollTo(0, 0);
        this.sw.style.display = "inherit"; // Making Setting window visible
        this.setState({"EditInProcess": true});
    }

// Settings form completed (the child has embedded the settings into this event)
    handleSettingsSubmitClick(event) {
        event.preventDefault();
        this.setState({"EditInProcess": false});
        this.sw.style.display = "none"; // Making setting window invisible
        const settingState=event.settingState;
        this.setState({"Home_X" : settingState.Home_X});
        this.setState({"Home_y" : settingState.Home_Y});
        this.setState({"ReturnHome" : settingState.ReturnHome});
        this.setState({"WhoStarts" : settingState.WhoStarts});
        this.setState({"Serve_X" : settingState.Serve_X});
        this.setState({"Serve_Y" : settingState.Serve_Y});
        this.setState({"speed2LeftDegreeArray" : settingState.speed2LeftDegreeArray});
        this.setState({"speed2RightDegreeArray" : settingState.speed2RightDegreeArray});
    }

    handleAboutClick(event) {
        if(this.state.wsConnected) window.removeEventListener('mousemove', this.handleMouseMove);
        event.preventDefault();
        this.aw.style.display = "inherit";
        this.setState({"EditInProcess": true});
    }

    handleAboutSubmitClick(event) {
        event.preventDefault();
        this.aw.style.display = "none";
        this.setState({"EditInProcess": false});
        if(this.state.wsConnected) window.addEventListener('mousemove', this.handleMouseMove);
    }

    handleMouseMove(event) {
        let xy=this.getMousePos(this.canvas, event);
        const enclosedX = this.isInsideDmz(xy.x, xy.y) || this.isXOutsideCourt(xy.x) ? "Out" : Math.round(xy.x);
        const enclosedY = this.isInsideDmz(xy.x, xy.y) || this.isYOutsideCourt(xy.y) ? "Out" : Math.round(xy.y);
        if(enclosedX === "Out" || enclosedY === "Out") this.setState({isValidSpace: false});
        else this.setState({isValidSpace: true});
        if(this.state.LoggedIn && this.state.wsConnected && !this.state.EditInProcess)
            this.statusBar.innerHTML = `X=${enclosedX}`+`  Y=${enclosedY}`;
    }
// This is a flip-flop button that originally has a 'Start' label but as soon as connection with the device is
// established it'll become 'Stop' button.
    handleStartClick(event) {
        console.log("handleStartClick = "+event.data+" this.state.wsConnected="+this.state.wsConnected);
        if(this.state.wsConnected) { // If it is already connected then disconnect the rover
            this.showInfoMessage("Disconnecting ...");
            this.setState({"wsConnecting": false});
            this.setState({"Current_X": this.state.Home_X});
            this.setState({"Current_Y": this.state.Home_Y});
            drawACourt(this.ctx);
            this.setState({"wsConnected" : false});
        } else { // if the rover connecting the fun begins
            this.webSocketHandler.login(this.state.SecurityToken);
        }
    };

  login2DeviceFailed(message) {
     this.showErrorMessage("Device login failed due to '"+message+"'");
  }

  login2DeviceSucceeded() {
      this.showInfoMessage("Device login succeeded");
      this.setState({"wsConnected" : true});

  }

  connectedToDevice() {

  }

  coordinatesReceivedByDevice() {

  }

  loggedOffFromDevice() {

  }

  deviceFailed(message) {

  }

  heartBeat(securityToken) {
    const heartBeatAgentId = this.remoteCommunication.heartBeat(securityToken);
    this.setState({"HeartBeatAgentId": heartBeatAgentId});
  }

  heartBeatsFailed() {
      this.showErrorMessage(`The last ${this.remoteCommunication.MAX_FAILED_HEARTBEATS} consecutive heart beats failed `);
  }

  /* Handles the tap on the "Submit" button on the Login screen. This is quite complex method that works as a
  * toggle switch thus if you are logged off then this button serves as LoginButton otherwise if you are
  * already logged-in than you shall logout of the system */
  handleLoginCallback(event) { // In fact this method should have been named handleLoginLogoffCallback but it is too cumbersome
    event.preventDefault();
    if(!this.state.LoggedIn) { // The application is in logoff state right now and it is needed to get logged in
        const userName = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        this.remoteCommunication.login(userName, password); // It is remote call but it is encapsulated inside remoteCommunication
                                                            // that calls "successfulLogin" or "failedLogin" respectively

    } else {
        // Logoff here because the system is logged in already presumably
        // first off all lets switch off the heart beat
        this.remoteCommunication.logoff(this.state.SecurityToken, this.state.HeartBeatAgentId);
    }
  }

  /* Handles successful login and assigns the security token in order to supply it with other requests.
  * Here we also start tracing the mouse movements. Attention! The Login button becomes a Logoff button
  * which enables me to reuse the space with this toggling mechanism */
  successfulLogin(response) {
    const securityToken = response.headers.get("security-token");
    this.setState({"SecurityToken" : securityToken});
    this.setState({"LastSecurityTokenUpdate" : Date.now()});
    this.heartBeat(securityToken);

    this.settingsCommunication.getSettings(securityToken);

    this.setState({
         "LoggedIn": true,
    });

    this.statusBar.style.color = "black";
    this.statusBar.style["font-weight"] = "normal";
    this.statusBar.innerHTML = "The system is ready to operate";
    this.lw.style.display="none";
  };

  settingsRetrieved(json) {
      this.setState({"Home_X" : json.Home_X});
      this.setState({"Home_y" : json.Home_Y});
      this.setState({"ReturnHome" : json.ReturnHome});
      this.setState({"WhoStarts" : json.WhoStarts});
      this.setState({"Serve_X" : json.Serve_X});
      this.setState({"Serve_Y" : json.Serve_Y});
      this.setState({"speed2LeftDegreeArray" : json.speed2LeftDegreeArray});
      this.setState({"speed2RightDegreeArray" : json.speed2RightDegreeArray});
  }

  // Handle the non 200 response from the authentication service
  failedLogin(e) {
      this.setState({
          "LoggedIn": false
      });
      this.showErrorMessage("Login failed "+e);
  }

  successfulLogoff() {
      this.showInfoMessage("You have successfully logged off the system");
  }

  failedLogoff(reason) {
      this.showErrorMessage("Logoff failed. Please try again later "+reason);
  }


// Getting mouse position on the canvas as {x,y} json
  getMousePos(canvas, evt) {
    this.aw.style.display = "none";

    let rect = canvas.getBoundingClientRect(), // abs. size of element
        scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for x
        scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for y

    return {
        x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
        y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
    }
  }

  // Creates most of the form used in the application and most of them are invisible until
  // called
  componentDidMount() {
      this.canvas = document.getElementById("myCanvas");
      this.statusBar = document.getElementById("statusBar");
      this.aw = document.getElementById("AboutWindow");
      this.startButton = document.getElementById("startButton");
      this.lw = document.getElementById("loginWindow");
      this.sw = document.getElementById("SettingsWindow");
      this.lb = document.getElementById("loginButton");


      this.xOffset = this.canvas.offsetLeft;
      this.yOffset = this.canvas.offsetTop;

      this.ctx = this.canvas.getContext("2d");

      drawACourt(this.ctx);
      this.ctx.fillStyle = "black";
      this.ctx.font = "30px Arial";
      this.ctx.fillText("Robotic Rover Control Panel",95,120); // This will disappear as soon as any activities on the court like moving a robot start

      const handleResize = () => {
          this.xOffset = this.canvas.offsetLeft;
          this.yOffset = this.canvas.offsetTop;
      }

      window.addEventListener('resize', handleResize);
  }

  /* returns true if the given coordinates are too close to the net */
  isInsideDmz(x, y) {
      return x > this.X_DMZ_TOP_LEFT_COORD && x < this.X_DMZ_BOTTOM_RIGHT_COORD &&
             y < this.Y_DMZ_BOTTOM_RIGHT_COORD && y > this.Y_DMZ_TOP_LEFT_COORD;
  }

  /* returns true if the given X coordinates is outside the tennis court */
  isXOutsideCourt(x) {
      return x > this.routeMaker.X_COURT_MAX_COORD || x < this.routeMaker.X_COURT_MIN_COORD;
  }

  /* returns true if the given X coordinates is outside the tennis court */
  isYOutsideCourt(y) {
      return y > this.routeMaker.Y_COURT_MAX_COORD || y < this.routeMaker.Y_COURT_MIN_COORD;
  }

    render() {
    return (
        <div id="motherPanel" className="center" height="1300" width="700">
          <ControlPanel EditInProcess = {this.state.EditInProcess}
                        LoggedIn = {this.state.LoggedIn}
                        wsConnected = {this.state.wsConnected}
                        loginClicked = {this.handleLoginClick}
                        settingClicked = {this.handleSettingsClick}
                        aboutClicked = {this.handleAboutClick}
                        startClicked = {this.handleStartClick}
          />
          <div id="statusBar">Please, click the 'Login' button to access the system</div>
          <canvas id="myCanvas" className="center" height="1200" width="590" onClick={this.handleClick}>
            Your browser does not support the HTML canvas tag.
          </canvas>

          <LoginWindow callBackFunction={this.handleLoginCallback}></LoginWindow>
          <SettingsWindow handleSettingsSubmitClick={this.handleSettingsSubmitClick}
                            SecurityToken={this.state.SecurityToken}
                            infoMessageSender={this.showInfoMessage}
                            errorMessageSender={this.showErrorMessage} />


          <AboutWindow handleAboutClick={this.handleAboutSubmitClick}/>
        </div>
    );
  };
};