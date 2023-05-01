/* Web-server class that authenticates users and stores their settings into a file, so far it all property
file-based storage without any database involvement */
const express = require("express");
const bodyParser = require("body-parser");

const Authentication = require("./security");
const authentication = new Authentication();
const fs = require('fs');

const app = express(); // create express app
const expressWs = require('express-ws')(app); // We use the web-socket here to receive the real robot position coordinates
                                              // This will make black circle representing the real robot follow the planned one

const {LoginCommand, CoordsCommand, HeartBeatCommand, LogoffCommand} = require("./Reflector");


app.use(bodyParser.json());

// There can be only one user which connected to device over the web-socket
let wsAuthToken = null; // If null it means no one is controlling device
let wsUserName = null; // Holding a user name as well. If user left the session without logging off
let wsDate     = null; // Date and time when the socket was obtained
let wsRoverRoute = [];
let wsRoverAuthToken = null; // Rover's authentication token that is being created on the rover's login
let wsRoverUserName = null; // Rover user-name is rover
let wsRoverLoginDate = null;

function isBrowserConnected() {
    return wsAuthToken != null;
}

function isRoverConnected() {
    return wsRoverAuthToken != null;
}


app.use(express.static('build'));
app.targetCoordArrayOfArrays = [];

app.post('/auth', function(request, response) {
    const virginHeaderBase64 = request.headers["authorization"];
    try {
        if (virginHeaderBase64 == null || virginHeaderBase64 == undefined) throw new Error("The Authorization header is missing");
        const basicPosition = virginHeaderBase64.indexOf("Basic");
        if (basicPosition < 0) throw new Error("No other but 'Basic' type of authentication is supported");
        const base64Part = virginHeaderBase64.substring(basicPosition + 6);
        const {userName, password} = authentication.retrieveUserNameAndPassword(base64Part);
        const token = authentication.authenticate(userName, password);
        wsAuthToken = token;
        response.header("security-token", token);
        response.status(200);
        response.send(JSON.stringify({"Command":"Login", "Payload": userName}));
    } catch(e) {
        console.log(e);
        response.status(401);
        response.send({"Command":"Login", "Payload": "Failure: The login failed due to either an incorrect user name or password"});
    }

});

app.put("/heart-beat", function(request, response) {
    const securityToken = request.headers["security-token"];
    if(securityToken==undefined || securityToken==null) {
        response.status(401);
        response.send({"message":"No security token found in a message"});
        return;
    }
    authentication.validateAndRefresh(securityToken);
    response.status(200);
    response.send({"command":"heartBeat", "Payload": request.body.Payload ,"token":securityToken});
});

app.post('/logoff', function(request, response){
    const securityToken = request.headers["security-token"];
    try {
        authentication.logoff(securityToken);
        wsAuthToken = null;
        response.status(200);
        response.send({"message":"Logged off"});
        console.log("User successfully logged off");
     } catch(e) {
        console.log(e);
        response.status(401);
        response.send({"status":e.messages});
    }
});

// Admin creates a new user that is supposed to end-up inside security.properties
app.post('/user', function(request, response){
    const securityToken = request.headers["security-token"];
    const userName = request.body["user-name"];
    const password = request.body["password"];
    authentication.mkUser(securityToken, userName, password, (error, data) => {
        if(error == null) {
            response.status(201);
            response.send({"message":`User ${userName} has been created`});
        } else {
            response.status(401);
            response.send({"message":`User ${userName} has NOT been created because of ${error}`});
        }
    });
});

app.put('/settings', function(request, response){
    const securityToken = request.headers["security-token"];
    const userName = authentication.token2UserNameMap[securityToken];
    if(userName == null || userName == undefined) {
        response.status(401);
        response.send({"message":`User for the security token supplied has not been found`});
        return;
    }
    console.log(`Saving setting for ${userName} were called`);
    console.log("Following settings were received:"+JSON.stringify(request.body));

    fs.writeFile(`./settings/${userName}.json`, JSON.stringify(request.body), function (err) {
        if (err) {
            response.status(401);
            response.send({"message":`User ${userName} settings were NOT saved because of ${err}`});
            return;
        }
        response.status(200);
        response.send({"message":`The user ${userName} settings have been successfully saved`});
        console.log(`The user ${userName} settings have been successfully saved`);
    });
});

app.get('/settings', function(request, response){
    const securityToken = request.headers["security-token"];
    const userName = authentication.token2UserNameMap[securityToken];
    if(userName == null || userName == undefined) {
        response.status(401);
        response.send({"message":`User for the security token supplied has not been found`});
        return;
    }

    console.log(`Read Setting for ${userName} were called`);
    fs.readFile(`./settings/${userName}.json`,  function (err, buffer) {
        if (err != null) {
            response.status(404);
            response.send({"message":`Settings are not read probably because the user's ${userName} settings have never been set}`});
            return;
        }
    response.status(200);
        console.log(buffer.toString());
        response.send(JSON.parse(buffer.toString()));
        console.log("Following settings were sent:"+buffer.toString());
        console.log(`The user ${userName} settings have been successfully retrieved`);

    });

});


// Rendering all the users and its status
app.get('/user', function(request, response) {
    const securityToken = request.headers["security-token"];
    const listOfUsers = authentication.listUser(securityToken);
    response.status(200);
    response.send(listOfUsers);
});

// The lines below are responsible for web-socket communication with the user's browser
const browserRouter = express.Router();
const roverRouter = express.Router();
const loginBrowserReflector = new LoginCommand(browserRouter);
const coordsBrowserReflector = new CoordsCommand(browserRouter);
const heartBeatBrowserReflector = new HeartBeatCommand(browserRouter);
const logoffBrowserReflector = new LogoffCommand(browserRouter);

// The lines below are responsible for web-socket communication with device (rover)
/* The set of command below allow sending the commands down below Web-Socket pipe and
receive the asych responses as a respective method call
 */
const loginRoverReflector = new LoginCommand(roverRouter);
const coordsRoverReflector = new CoordsCommand(roverRouter);
const heartBeatRoverReflector = new HeartBeatCommand(roverRouter);
const logoffRoverReflector = new LogoffCommand(roverRouter);

loginRoverReflector.setRouterThat(browserRouter);
coordsRoverReflector.setRouterThat(browserRouter);
heartBeatRoverReflector.setRouterThat(browserRouter);
logoffRoverReflector.setRouterThat(browserRouter);

loginBrowserReflector.setRouterThat(roverRouter);
coordsBrowserReflector.setRouterThat(roverRouter);
heartBeatBrowserReflector.setRouterThat(roverRouter);
logoffBrowserReflector.setRouterThat(roverRouter);


browserRouter.ws('/login', loginBrowserReflector.shimThis);
browserRouter.onLogin = function (command) {
    if(wsAuthToken != null && wsAuthToken == command.token &&
       wsUserName  != null && wsUserName == command.Payload) {
        loginBrowserReflector.sendThis(JSON.stringify(command)); // Back to browser
        wsAuthToken = command.token;
        wsUserName = command.Payload;
        wsDate = Date.now();
        return "Success";
    } else {
        const userNameFound = authentication.token2UserNameMap[command.token];
        if(userNameFound != null && userNameFound == command.Payload) {
            loginBrowserReflector.sendThis(JSON.stringify(command)); // Back to browser
            wsAuthToken = command.token;
            wsUserName = command.Payload;
            wsDate = Date.now();
            return "Success";
        } else {
            return `Failure: The login token mismatch. Looks like the rover is already used by someone else ${wsUserName}`
        }
    }
};

browserRouter.ws('/coords', coordsBrowserReflector.shimThis); // These coordinates are coming from Browser, and they have to be sent into the Rover
browserRouter.onCoordsReceived = function (command) {
    if(wsAuthToken != null && wsAuthToken == command.token) {
        if(isRoverConnected()) {
            coordsRoverReflector.sendThis(JSON.stringify(command)); // Login information going to the rover
            return "Success";
        } else {
            return "Failure: No user logged in";
        }
    } else {
        return "Failure: wrong token";
    }
}

browserRouter.ws('/heartbeat', heartBeatBrowserReflector.shimThis);
browserRouter.onHeartBeat = function(command) {
    // Here token stop being a security one but becomes a timing mechanism
    if (isRoverConnected()) {
        command.source = "rover";
        heartBeatRoverReflector.sendThis(JSON.stringify(command));
        return "Success";
    } else {
        command.source = "web-server";
        heartBeatBrowserReflector.sendThis(JSON.stringify(command));
        return "Success";
    }
}

browserRouter.ws('/logoff', loginBrowserReflector.shimThis);
browserRouter.onLogoff = function(command) {
    if(wsAuthToken != null && wsAuthToken == payload.token) {
        if(wsUserName != null) {
            logoffBrowserReflector.sendThis(JSON.stringify(command)); // Logoff information going to the rover
            wsAuthToken = null;
            wsUserName = null;
            wsDate     = null;
            wsRoverRoute = [];
            wsRoverAuthToken = null; // Rover's authentication token that is being created on the rover's login
            wsRoverUserName = null; // Rover user-name is rover
            return "Success";
        } else {
            return "Failure: No user logged in";
        }
    } else {
        return "Failure: wrong token";
    }
}
app.use("/browser", browserRouter);

roverRouter.ws('/login', loginRoverReflector.shimThis);
roverRouter.onLogin = function(message) {
    try {
        const authString = message.Payload;
        const {userName, password} = authentication.retrieveUserNameAndPassword(authString)
        const token = authentication.authenticate(userName, password);
        // if web-browser user-name is not yet logged in then we want to display "Unknown" to the rover's otherwise returning name of the web-browser user
        loginRoverReflector.sendThis(`{"Command": "print", 
                                       "Payload": "${wsUserName==null ? "Unknown user" : wsUserName}",
                                       "token": "${token}"}`);
        wsRoverUserName = userName;
        wsRoverAuthToken = token;
        wsRoverLoginDate = Date.now();
        return "Success";
    } catch (e) {
        loginRoverReflector.sendThis(`{"Command": "print", 
                                       "Payload": Failure: ${e.message}`);
        console.log(`Login failed because of ${e.message}`);
        wsRoverUserName = null;
        wsRoverAuthToken = null;
        wsRoverLoginDate = null;
        return `Failure: Authentication failed ${e.message}`;
    }

};

roverRouter.ws('/coords', coordsRoverReflector.shimThis); // From Rover's sensors data
roverRouter.onCoordsReceived = function(command) {
    // Somehow reflect this changes in real coordinates on the screen for that we have to simply forward it to the browser
    if(isRoverConnected()) {
        if(command.token == wsRoverAuthToken) {
            coordsRoverReflector.sendThis(JSON.stringify(command)); //  Echoing information back into rover
            if(isBrowserConnected()) {
                command.token = wsAuthToken; // we need to substitute the token here so this command authenticated by browser
                coordsBrowserReflector.sendThis(JSON.stringify(command)); // Redirecting information forward into browser
            }
        } else {
            return "Failure: The wrong token or never logged in";
        }
    } else {
        return "Failure: Rover has not been connected yet";
    }
};

roverRouter.ws('/heartbeat', heartBeatRoverReflector.shimThis);
roverRouter.onHeartBeat = function(command) {
    // Here the task is simple return whatever rover send to you back to the browser
    // Here token stop being a security one but becomes a timing mechanism
    if (isBrowserConnected()) {
        command.source = "rover";
        heartBeatBrowserReflector.sendThis(JSON.stringify(command));
        return "Success";
    } else {
        return "Failure: The unexpected heart beat from the rover while it's marked as disconnected";
    }

}

roverRouter.ws('/logoff', logoffRoverReflector.shimThis);
roverRouter.onLogoff = function(command) {
    if(isRoverConnected()) {
        if(wsRoverAuthToken == command.token) {
            loginRoverReflector.sendThis(`{"Command": "logoff", 
                                           "Payload": wsRoverUserName,
                                           "token": "${command.token}"}`); // Echoing command back to the rover
            if (isBrowserConnected()) {
                command.token = wsAuthToken; // we need to substitute the token here so this command authenticated by browser
                heartBeatBrowserReflector.sendThis(JSON.stringify(command)); // Sending command forward to browser
            }
            wsAuthToken = null;
            wsUserName = null;
            wsRoverRoute = [];
            wsRoverAuthToken = null; // Rover's authentication token that is being created on the rover's login
            wsRoverUserName = null; // Rover user-name is rover
            wsRoverLoginDate = null;
        } else {
            return "Failure: The wrong token";
        }
    } else {
        return "Failure: The attempt to disconnect from disconnected rover";
    }
}

app.listen(5000, () => {
    console.log("server started on port 5000");
});

app.use("/rover", roverRouter);

module.exports=roverRouter;
