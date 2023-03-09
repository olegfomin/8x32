import './Court.css';
import React from 'react';
import drawACourt from "./DrawCourtFunction"
import LoginWindow from "./LoginWindow";
import SettingsWindow from "./SettingsWindow";
import CalibrationWindow from "./CalibrationWindow";
import AboutWindow from "./AboutWindow";
// import RoverWindow from "./RoverWindow";
import TennisBallWindow from "./TennisBallWindow";
import {Buffer} from 'buffer';
import RouteMaker from "./RouteMaker";
import ControlPanel from "./ControlPanel";

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
        this.xOffset = 0; // Temporary setting/declaring this variable to zero they will take their correct value
        this.yOffset = 0; // when component mounts

        this.routeMaker = new RouteMaker(this);
        this.handleLoginCallback = this.handleLoginCallback.bind(this);
        this.handleAboutClick = this.handleAboutClick.bind(this);
        this.handleLoginClick = this.handleLoginClick.bind(this);
        this.handleSettingsClick = this.handleSettingsClick.bind(this);
        this.handleStartClick = this.handleStartClick.bind(this);
        this.handleSettingsSubmitClick = this.handleSettingsSubmitClick.bind(this);
        this.handleCalibrationClick = this.handleCalibrationClick.bind(this);
        this.handleCalibrationSubmitClick = this.handleCalibrationSubmitClick.bind(this);
        this.handleAboutSubmitClick = this.handleAboutSubmitClick.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.redrawPicture = this.redrawPicture.bind(this);
        this.successfulLogin = this.successfulLogin.bind(this);
        this.failedLogin = this.failedLogin.bind(this);
        this.showInfoMessage = this.showInfoMessage.bind(this);
        this.showErrorMessage = this.showErrorMessage.bind(this);
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
            "ConnectionInProcess": false, // The connection with rover's being established
            "isConnected": false, // The connection with a rover has been established
            "EditInProcess": false, // in this case we disable all the other buttons so it is not possible to have cascading windows that exceed the screen size
            "isValidSpace": false,
            "isConnected2Socket": false,
            "wsConnected": false,
            "wsLoggedIn": false,
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
        if (this.state.isConnected) { // Rover should move now
            if(this.state.isValidSpace) {
                let xy = this.getMousePos(this.canvas, event);
                this.routeMaker.handleClick(this.state.Current_X, this.state.Current_Y, xy.x, xy.y);
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
            this.lw.style.display = "inherit";
        } else {
            this.lw.style.display = "none";
            lb.style.color = "black"
            lb.style.fontWeight = "normal";
            lb.innerHTML = "Login";

            this.setState({"LoggedIn": false});
        }
    }

    // Calling the Settings form that includes Home coordinates, Service coordinates and who begins the game
    handleSettingsClick(event) {
        window.scrollTo(0, 0);
        const sw = document.getElementById("SettingsWindow");
        sw.style.display = "inherit";
        this.setState({"EditInProcess": true});
    }

// Settings form completed
    handleSettingsSubmitClick(event) {
        event.preventDefault();
        const sw = document.getElementById("SettingsWindow");
        this.state.WhoStarts = document.getElementById('YourRoverRB').checked;
        this.state.Serve_X = parseInt(document.getElementById('servingCoordXNumber').value);
        this.state.Serve_Y = parseInt(document.getElementById('servingCoordYNumber').value);
        this.state.Home_X = parseInt(document.getElementById('homeCoordXNumber').value);
        this.state.Home_Y = parseInt(document.getElementById('homeCoordYNumber').value);
        this.setState({"Current_X": this.state.Home_X});
        this.setState({"Current_Y": this.state.Home_Y});

        this.state.ReturnHome = document.getElementById('returnHomeCheckBox').checked;
        this.setState({"EditInProcess": false});

        sw.style.display = "none";
    }

    handleCalibrationClick(event) {
        this.cw.style.display = "inherit";
        this.setState({"EditInProcess": true});
    }

    handleCalibrationSubmitClick(event) {
        this.cw.style.display = "none";
        event.preventDefault();
        this.setState({"EditInProcess": false});

    }

    handleAboutClick(event) {
        event.preventDefault();
        this.aw.style.display = "inherit";
        this.setState({"EditInProcess": true});
    }

    handleAboutSubmitClick(event) {
        event.preventDefault();
        this.aw.style.display = "none";
        this.setState({"EditInProcess": false});

    }
// This is a flip-flop button that originally has a 'Start' label but as soon as connection with the device is
// established it'll become 'Stop' button.
    handleStartClick(event) {
        if(this.state.isConnected) { // If it is already connected then disconnect the rover
            this.showInfoMessage("Disconnecting ...");
            this.setState({"ConnectionInProcess": false});
            this.setState({"isConnected": false});
            this.setState({"Current_X": this.state.Home_X});
            this.setState({"Current_Y": this.state.Home_Y});
            drawACourt(this.ctx);
        } else { // if the rover connecting the fun begins
            const socket = new WebSocket(this.BASE_URL+"wslogin",'ws');
            socket.onopen = (e) => {
                console.log("Connected to web-socket "+event.data);
                socket.send(this.state.SecurityToken);
                this.setState({"ConnectionInProcess": true});
            };

            socket.onmessage = (event) => {
                if(this.state.ConnectionInProcess && event.data.startsWith("Success")) {
                    this.startButton.innerHTML = "Disconnect";

                    this.showInfoMessage("Connected ...");
                    this.setState({"ConnectionInProcess": false});
                    this.setState({"isConnected": true});
                    this.setState({"Current_X": this.state.Home_X});
                    this.setState({"Current_Y": this.state.Home_Y});
                    // Prints current mouse coordinates or 'Out' if the coordinate is larger than court size or too close to the net
                    const handleMouseMove = (event) => {

                        let xy=this.getMousePos(this.canvas, event);

                        const enclosedX = this.isInsideDmz(xy.x, xy.y) || this.isXOutsideCourt(xy.x) ? "Out" : Math.round(xy.x);
                        const enclosedY = this.isInsideDmz(xy.x, xy.y) || this.isYOutsideCourt(xy.y) ? "Out" : Math.round(xy.y);
                        if(enclosedX === "Out" || enclosedY === "Out") this.setState({isValidSpace: false});
                        else this.setState({isValidSpace: true});

                        if(this.state.LoggedIn && this.state.isConnected) this.statusBar.innerHTML = `X=${enclosedX}`+`  Y=${enclosedY}`;

                    };
                    window.addEventListener('mousemove', handleMouseMove);

                    this.statusBar.innerHTML = "Point the area where the rover must go";
                    window.scrollTo(0, 500); // Rolling the scroller to the end
                    this.redrawPicture(this.state.Current_X, this.state.Current_Y);
                } else {
                    this.showErrorMessage("Cannot Connect "+event.data);
                }
            };
        }
    };

  heartBeat() {
    console.log("Heart-beat");
    const heartBeatAgentId = setInterval( () => {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json',
                'Content-Length': '2',
                'Accept': '*/*',
                'security-token': this.state.SecurityToken
            },
            body: JSON.stringify({})
        };
        fetch('heart-beat', requestOptions) // Calling the authentication server
            .then(response => {if(response.status != 200) throw new Error(JSON.stringify(response.body))})
            .catch(e=>{this.failedLogin(e)});
    }, 60*1000);

    this.setState({"HeartBeatAgentId": heartBeatAgentId});
  }

  /* Handles the tap on the "Submit" button on the Login screen. This is quite complex method that works as a
  * toggle switch thus if you are logged off then this button serves as LoginButton otherwise if you are
  * already logged-in than you shall logout of the system */
  handleLoginCallback(event) {
    event.preventDefault();
    if(!this.state.LoggedIn) { // The application is in logoff state right now and it is needed to get logged in
        const userName = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const encodedString = Buffer.from(`${userName}:${password}`).toString('base64');
        const requestOptions = { // TODO it seems like all communication pieces must be moved into a separate class
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': '2',
                'Accept': '*/*',
                'authorization': 'Basic ' + encodedString
            },
            body: JSON.stringify({})
        };
        fetch('auth', requestOptions) // Calling the authentication server
            .then(response => {
                if (response.status == 200) this.successfulLogin(response);
                else throw new Error(JSON.stringify(response.body))
            })
            .catch(e => {
                this.failedLogin(e)
            });
    } else {
        // Logoff here because the system is logged in already presumably
        // first off all lets switch off the heart beat
        if(this.state.HeartBeatAgentId != null && this.state.HeartBeatAgentId != undefined) clearInterval(this.state.HeartBeatAgentId);
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': '2',
                'Accept': '*/*',
                'security-token':+""+this.state.SecurityToken
            },
            body: JSON.stringify({})
        };
        fetch('logoff', requestOptions) // Calling the authentication server
            .then(response => {
                if (response.status == 200) {
                    this.statusBar.innerHTML = "You have successfully logged off the system";
                    setTimeout(()=>{this.statusBar.innerHTML = "You may login again"}, 5000);
                }
                else throw new Error(JSON.stringify(response.body))
            })
            .catch(e => {
                this.failedLogin(e)
            });

    }
  }

  /* Handles successful login and assigns the security token in order to supply it with other requests.
  * Here we also start tracing the mouse movements. Attention! The Login button becomes a Logoff button
  * which enables me to reuse the space with this toggling mechanism */
  successfulLogin(response) {
    this.heartBeat();
    this.setState({"SecurityToken" : response.headers.get("security-token")});
    this.setState({"LastSecurityTokenUpdate" : Date.now()});

    const lb = document.getElementById("loginButton");

    lb.style.color = "red";
    lb.style["font-weight"] = "bold";
    lb.innerHTML = "Logoff";
    this.setState({
        "LoggedIn": true
    });
    this.lw.style.display="none";
  };

  // Handle the non 200 response from the authentication service
  failedLogin(e) {
      this.setState({
          "LoggedIn": false
      });
      this.statusBar.style.color = "red";
      this.statusBar.style["font-weight"] = "bold";

      this.statusBar.innerHTML = "Login failed "+e;
      this.lw.style.display="none";
      setTimeout(() => {
          this.statusBar["font-weight"] = "normal";
          this.statusBar.innerHTML = "Please, click the Login button to access the system";
      }, "3400");
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
      this.cw = document.getElementById("CalibrationWindow");
      this.aw = document.getElementById("AboutWindow");
      this.startButton = document.getElementById("startButton");
      this.lw = document.getElementById("loginWindow");


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
          <ControlPanel connected = {this.state.isConnected}
                        wsConnected = {this.state.wsConnected}
                        loginClicked = {this.handleLoginClick}
                        settingClicked = {this.handleSettingsClick}
                        calibrationClicked = {this.handleCalibrationClick}
                        aboutClicked = {this.handleAboutClick}
                        startClicked = {this.handleStartClick}
          />
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
          <AboutWindow handleAboutClick={this.handleAboutClick} disabled={!this.state.LoggedIn}/>
          <TennisBallWindow visible={false} />
        </div>
    );
  };
};