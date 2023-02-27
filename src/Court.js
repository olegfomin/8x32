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
    ON_SAME_SIDE      = 0;
    ON_OPPOSITE_SIDES = 1;
    ON_CORRIDOR_LEFT  = 2;
    ON_CORRIDOR_RIGHT = 3;

    X_COURT_MAX_COORD = 590;
    Y_COURT_MAX_COORD = 1095;
    X_COURT_MIN_COORD = 0;
    Y_COURT_MIN_COORD = 70;

    Y_NET_COORDINATE       = 544;
    X_LEFT_CORRIDOR_LEFT   =  8;
    X_LEFT_CORRIDOR_RIGHT  =  64;
    X_LEFT_CORRIDOR_MEDiAN = (this.X_LEFT_CORRIDOR_RIGHT+this.X_LEFT_CORRIDOR_LEFT)/2;
    X_RIGHT_CORRIDOR_LEFT  =  520;
    X_RIGHT_CORRIDOR_RIGHT = 575;
    X_RIGHT_CORRIDOR_MEDIAN= (this.X_RIGHT_CORRIDOR_LEFT+this.X_RIGHT_CORRIDOR_RIGHT)/2;
    CORRIDOR_LENGTH        = 46;
    CORRIDOR_BOTTOM_Y      = this.Y_NET_COORDINATE + this.CORRIDOR_LENGTH/2;
    CORRIDOR_TOP_Y         = this.Y_NET_COORDINATE - this.CORRIDOR_LENGTH/2;
    X_MEDIAN_LINE          = 292;
    X_DMZ_TOP_LEFT_COORD   = 70;
    Y_DMZ_TOP_LEFT_COORD   = 524;
    X_DMZ_BOTTOM_RIGHT_COORD = 500;
    Y_DMZ_BOTTOM_RIGHT_COORD = 563;

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

    // Redraws the entire picture of the court with the 'Rover' circle in the new place
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

// This handler would move the picture of the rover towards the point where the mouse
// was clicked on
    handleClick(event) {
        if (this.state.isConnected) { // Rover should move now
            let xy = this.getMousePos(this.canvas, event);

//            const route = this.routeBuilder(xy.x, xy.y);

//            console.log("route x1="+route[0].x1+" x2="+route[0].x2+" y1="+route[0].y1+" y2="+route[0].y2);

            const route = [];
            route.push({"x1":xy.x, "x2":this.state.Current_X, "y1":xy.y, "y2":this.state.Current_Y});

            for(let i=0; i < route.length; i++) {
                const vector = route[i];
                const offsetX = vector.x1 - vector.x2;
                const offsetY = vector.y1 - vector.y2;
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
        };
    };

    // The function returns 0 if both current and target Y belong to the same part of the court
    // The function returns 1 if the current and target sides are on the different sides of the court
    // it renders 2 if the target is on the left corridor
    // and it returns 3 it the target belongs to the right corridor
    findSides(currentX, currentY, targetX, targetY) {
        if((currentY < this.CORRIDOR_TOP_Y && targetY < this.CORRIDOR_TOP_Y) ||
           (currentY > this.CORRIDOR_BOTTOM_Y && targetY > this.CORRIDOR_BOTTOM_Y)) return this.ON_SAME_SIDE;


        if((currentY < this.CORRIDOR_TOP_Y && targetY > this.CORRIDOR_BOTTOM_Y) ||
           (currentY > this.CORRIDOR_BOTTOM_Y && targetY < this.CORRIDOR_TOP_Y)) return this.ON_OPPOSITE_SIDES;

        return targetX > this.X_MEDIAN_LINE ? this.ON_CORRIDOR_RIGHT : this.ON_CORRIDOR_LEFT;

    }

    // Builds the route from point A(x, y) to point B(x, y). The input is a target's x and y. The output
    // is an array of intermediate x and y like that [{x1,x2,y1,y2}, {x1,x2,y1,y2}]
    routeBuilder(targetX, targetY) {
        this.setState({"Target_X": targetX});
        this.setState({"Target_Y": targetY});

        const changingSides = this.findSides(this.state.Current_X, this.state.Current_Y,
                                             this.state.Target_X, this.state.Target_Y);
        const route = [];
        switch (changingSides) {
            case this.ON_SAME_SIDE: route.push({"x1": this.state.Current_X, "x2": this.state.Target_X,
                                                "y1": this.state.Current_Y, "y2": this.state.Target_Y}); break;
            default: throw Error("Other cases not implemented yet");
        }

        return route;
    }

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

  /* Handles the tap on the "Submit" button on the Login screen */
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
      fetch('auth', requestOptions) // Calling the authentication server
          .then(response => {if(response.status == 200) this.successfulLogin(response);
                                                        else throw new Error(JSON.stringify(response.body))})
          .catch(e=>{this.failedLogin(e)});
  }

  /* Handles successful login and assigns the security token in order to supply it with other requests.
  * Here we also start tracing the mouse movements. Attention! The Login button becomes a Logoff button
  * which enables me to reuse the space with this toggling mechanism */
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

      // Prints current mouse coordinates or 'Out' if the coordinate is larger than court size or too close to the net
    const handleMouseMove = (event) => {

        let xy=this.getMousePos(this.canvas, event);

        const enclosedX = this.isInsideDmz(xy.x, xy.y) || this.isXOutsideCourt(xy.x) ? "Out" : Math.round(xy.x);
        const enclosedY = this.isInsideDmz(xy.x, xy.y) || this.isYOutsideCourt(xy.y) ? "Out" : Math.round(xy.y);

        if(this.state.LoggedIn) this.statusBar.innerHTML = `X=${enclosedX}`+`  Y=${enclosedY}`;

    };
    window.addEventListener('mousemove', handleMouseMove);

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
      return x > this.X_COURT_MAX_COORD || x < this.X_COURT_MIN_COORD;
  }

  /* returns true if the given X coordinates is outside the tennis court */
  isYOutsideCourt(y) {
      return y > this.Y_COURT_MAX_COORD || y < this.Y_COURT_MIN_COORD;
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