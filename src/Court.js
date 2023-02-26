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


export default class Court extends React.Component {
    startButton;
    statusBar;
    lw;
    cw;

    constructor(props) {
        super(props);
        this.xOffset = 0; // Temporary setting/declaring this variable to zero they will take their correct value
        this.yOffset = 0; // when component mounts

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
            "Reachable_Rect_X_From": 444,
            "Reachable_Rect_Y_from": 700,
            "Reachable_Rect_X_to": 444,
            "Reachable_Rect_Y_to": 700,
            "ReturnHome": false, // Indicates whether rover head towards Home coordinates above
            "WhoStarts": false, // Defines who starts either your rover or the opponent on the other side of the court
            "OpponentServesNow": true, // If Return Home is true then we put the rover into Home_X, Home_y coordinates otherwise we'll ask the
            "GameStarted": false, // Here all the buttons must be disabled even logoff so that the rover is not controlled
            "ConnectionInProcess": false, // The connection with rover's being established
            "isConnected": false, // The connection with a rover has been established
            "EditInProcess": false, // in this case we disable all the other buttons so it is not possible to have cascading windows that exceed the screen size
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

    redrawPicture(x, y) {
        drawACourt(this.ctx);
        this.ctx.fillStyle = "orange";
        this.ctx.beginPath();  //start the path
        this.ctx.arc(x, y, 12, 0, Math.PI * 2); //draw the circle
        this.ctx.fill();
        this.ctx.fillStyle = "black";
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


    handleClick(event) {
        if (this.state.isConnected) { // Rover should move now
            let xy = this.getMousePos(this.canvas, event);

            const offsetX = xy.x - this.state.Current_X;
            const offsetY = xy.y - this.state.Current_Y;
            const stepX = offsetX / 20.0;
            const stepY = offsetY / 20.0;

            this.redrawPicture(xy.x, xy.y);
            let counter = 0;

            const intervalId = setInterval(() => {
                this.setState({Current_X: this.state.Current_X + stepX});
                this.setState({Current_Y: this.state.Current_Y + stepY});

                this.redrawPicture(this.state.Current_X, this.state.Current_Y);

                if (counter == 20) {
                    clearInterval(intervalId);
                    return;
                }
                counter++;

            }, 50);

        }
        ;
    };

    handleLoginClick(event) {
        const lb = document.getElementById("loginButton");
        if (!this.state.LoggedIn) {
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

    handleStartClick(event) {
//      this.redrawPicture(this.state.Current_X-this.xOffset, this.state.Current_Y-this.yOffset);
        if (this.state.isConnected) { // If it is already connected then disconnect the rover
            this.startButton.innerHTML = "Disconnect...";
            setTimeout(() => {
                this.startButton.style.color = "black";
                this.startButton["font-weight"] = "normal";
                this.startButton.innerHTML = "Start";
                this.setState({"GameStarted": false});
                this.setState({"ConnectionInProcess": false});
                this.setState({"isConnected": false});
            }, "1500");
            this.setState({"Current_X": this.state.Home_X});
            this.setState({"Current_Y": this.state.Home_Y});
            drawACourt(this.ctx);
        } else { // if the rover connecting the fun begins
            if (!this.state.ConnectionInProcess) {
                this.setState({"connectionInProcess": true});
                this.startButton.innerHTML = "Connect...";
                setTimeout(() => {
                    this.startButton.style.color = "red";
                    this.startButton["font-weight"] = "bold";
                    this.startButton.innerHTML = "Stop";
                    this.setState({"GameStarted": true});
                    this.setState({"ConnectionInProcess": false});
                    this.setState({"isConnected": true});
                }, "2500");
                this.setState({"Current_X": this.state.Home_X});
                this.setState({"Current_Y": this.state.Home_Y});
                this.statusBar.innerHTML = "Point the area where the rover must go";
                window.scrollTo(0, 500); // Rolling the scroller to the end
            }
            this.redrawPicture(this.state.Current_X, this.state.Current_Y);
        }
    };



  handleLoginCallback(event) {
    event.preventDefault();
    const userName = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const encodedString = Buffer.from(`${userName}:${password}`).toString('base64');
    const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json',
                     'Content-Length': '2',
                     'Accept': '*/*',
                     'authorization': 'Basic '+encodedString
                   },
          body: JSON.stringify({})
      };
      fetch('auth', requestOptions)
          .then(response => {if(response.status == 200) this.successfulLogin(response);
                                                        else throw new Error(JSON.stringify(response.body))})
          .catch(e=>{this.failedLogin(e)});
  }

  successfulLogin(response) {
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

  failedLogin(e) {
      console.log("Login failed:"+e);
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


      const handleMouseMove = (event) => {

         let xy=this.getMousePos(this.canvas, event);

         const enclosedX = xy.x >=0 && xy.x <=590 ? Math.round(xy.x) : "Out";
         const enclosedY = xy.y >=70 && xy.y <=1095 ? Math.round(xy.y) : "Out";

         if(this.state.LoggedIn) this.statusBar.innerHTML = `X=${enclosedX}`+`  Y=${enclosedY}`;

      };

      const handleResize = () => {
          this.xOffset = this.canvas.offsetLeft;
          this.yOffset = this.canvas.offsetTop;
      }

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('resize', handleResize);
  }

  render() {
    return (
        <div id="motherPanel" className="center" height="1300" width="700">
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
          <TennisBallWindow visible={false} />
        </div>
    );
  };
};