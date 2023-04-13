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

const {LoginRoverCommand, CoordsRoverCommand, HeartBeatRoverCommand, LogoffRoverCommand} = require("./RoverCommand");


app.use(bodyParser.json());

// There can be only one user which connected to device over the web-socket
let wsAuthToken = null; // If null it means no one is controlling device
let wsUserName = null; // Holding a user name as well. If user left the session without logging off
let wsDate     = null; // Date and time when the socket was obtained
let wsRoverRoute = [];
let wsRoverConnected = false;
let wsRoverAuthToken = null; // Rover's authentication token that is being created on the rover's login
const wsRoverUserName = "rover"; // Rover user-name is rover
let wsRoverLoginDate = null;


app.use(express.static('build'));
app.targetCoordArrayOfArrays = [];

app.post('/auth', function(request, response) {
    console.log("Auth attempt")
    const virginHeaderBase64 = request.headers["authorization"];
    try {
        if (virginHeaderBase64 == null || virginHeaderBase64 == undefined) throw new Error("The Authorization header is missing");
        const basicPosition = virginHeaderBase64.indexOf("Basic");
        if (basicPosition < 0) throw new Error("No other but 'Basic' type of authentication is supported");
        const base64Part = virginHeaderBase64.substring(basicPosition + 6);
        const {userName, password} = authentication.retrieveUserNameAndPassword(base64Part);
        const token = authentication.authenticate(userName, password);
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

browserRouter.ws('/login', function (ws, req) {
    ws.on('message', function(jsonAsString) { // {'Command':'login', 'Payload': 'username', 'token': token}
        const commandAndPayload = JSON.parse(jsonAsString);
        if(commandAndPayload.Command == "login") {
            if(commandAndPayload.Payload == wsUserName  || wsUserName == null) {
                if(authentication.token2UserNameMap[commandAndPayload.token] == commandAndPayload.Payload) {
                    wsAuthToken = commandAndPayload.token;
                    wsUserName =  commandAndPayload.Payload;
                    wsDate = Date.now();
                    ws.send(`{"Command": "login", 
                              "Payload": "Success",
                              "token": "${commandAndPayload.token}"}`);
                } else {
                    ws.send(`{"Command": "login", 
                              "Payload": "Failure: the token ${commandAndPayload.token} does not belong to the user ${wsUserName}",
                              "token: ${commandAndPayload.token}"}`);
                }
            } else {
                ws.send(`{"Command": "login", 
                          "Payload": "Failure: the user ${wsUserName} is already being connected to the rover",
                          "token: ${commandAndPayload.token}"}`);
            }
        } else {
            ws.send(`{"Command": "login", 
                      "Payload": "Failure: the expected command is 'login'",
                      "token: ${commandAndPayload.token}"}`);
        }
    });
});

browserRouter.ws('/coords', function(ws, req) {
    ws.on('message', function(jsonAsString) {
        const commandAndPayload = JSON.parse(jsonAsString);
        if(commandAndPayload.Command == "targetCoordinates") {
            if(commandAndPayload.token == wsAuthToken) {
                if(wsRoverConnected) {
                    roverRouter.ws.send(jsonAsString);
                }
            } else {
                ws.send(`{"Command": "targetCoordinates", 
                          "Payload": "Failure: The incorrect security token has been provided",
                          "token: ${commandAndPayload.token}"}`);
            }
        } else {
            ws.send(`{"Command": "targetCoordinates", 
                      "Payload": "Failure: the expected command is 'targetCoordinates' but it was '${commandAndPayload.Command}'",
                      "token: ${commandAndPayload.token}"}`);
        }
    });
});

browserRouter.ws('/heartbeat', function(ws, req) {
    ws.on('message', function(jsonAsString) {
        const commandAndPayload = JSON.parse(jsonAsString);
        if(commandAndPayload.Command == "heartBeat") {
            ws.send(`{"Command": "heartBeat", 
                      "Payload": "Success",
                      "token": "${commandAndPayload.token}"}`);
        } else {
            ws.send(`{"Command": "heartBeat", 
                      "Payload": "Failure: Invalid command name",
                      "token": "${commandAndPayload.token}"}`);
        }
    });
});

browserRouter.ws('/logoff', function(ws, req) {
    ws.on('message', function(jsonAsString) {
        const commandAndPayload = JSON.parse(jsonAsString);

    });
});
app.use("/browser", browserRouter);

// The lines below are responsible for web-socket communication with device (rover)
const roverRouter = express.Router();
/* The set of command below allow sending the commands down below Web-Socket pipe and
receive the asych responses as a respective method call
 */
const loginRoverCommand = new LoginRoverCommand(roverRouter);
const coordsRoverCommand = new CoordsRoverCommand(roverRouter);
const heartBeatRoverCommand = new HeartBeatRoverCommand(roverRouter);
const logoffRoverCommand = new LogoffRoverCommand(roverRouter);

roverRouter.ws('/login', loginRoverCommand.shim);
roverRouter.onLogin = function(commandAndPayload) {
    if(commandAndPayload.Command == "login") {
        try {
            const authString = commandAndPayload.Payload;
            const {userName, password} = authentication.retrieveUserNameAndPassword(authString)
            const token = authentication.authenticate(userName, password);
            // if web-browser user-name is not yet logged in then we want to display "Unknown" to the rover's screen
            loginRoverCommand.send(`{"Command": "login", 
                                     "Payload": wsUserName == null ? "Unknown" : wsUserName,
                                     "token": "${token}"}`);
            this.wsRoverAuthToken = token;

        } catch (e) {
            loginRoverCommand.send(`{"Command": "login", 
                                     "Payload": Failure: ${e.message}`);
            this.wsRoverAuthToken = null;
        }
    } else {
        loginRoverCommand.send(`{"Command": "login", 
                                 "Payload": "Failure: the expected command is 'login'"`);
        this.wsRoverAuthToken = null;
    }
};

roverRouter.ws('/coords', coordsRoverCommand.shim);
roverRouter.onCoordsReceived = (xy)=> {
    // Somehow reflect this changes in real coordinates on the screen

};

roverRouter.ws('/heartbeat', heartBeatRoverCommand.shim);
roverRouter.onHeartBeat = () => {

}

roverRouter.ws('/logoff', logoffRoverCommand.shim);
roverRouter.onLogoff = function() {
  console.log("I am a function");
}

app.use("/rover", roverRouter);


// start express server on port 5000
app.listen(5000, () => {
    console.log("server started on port 5000");
});

app.loginFn = function(ws, token) {
    if(wsAuthToken == null) {
        wsUserName = authentication.token2UserNameMap[token];
        if(wsUserName == "rover") {

            wsDate = Date.now();
            wsAuthToken = token;
            console.log("Sent success login to device");
            ws.send(JSON.stringify({"Command":"login", "Payload":"Success"}));
        } else {
            ws.send(JSON.stringify({"Command":"login", "Payload": "Invalid security token provided"}));
        }
    } else {
        if(token == wsAuthToken) {
            ws.send(JSON.stringify({"Command":"login", "Payload":"Success"}));
            wsDate = Date.now();
            // TODO Device must send these
            setInterval(() => {
               ws.send(JSON.stringify({"Command":"heartBeat", "Payload" : "Device is ok"}));
            }, 3000);
        } else {
            const userNameRetrieved = authentication.token2UserNameMap[token];
            if(userNameRetrieved === wsUserName) {
                wsAuthToken = token;
                ws.send(JSON.stringify({"Command":"login", "Payload":"Success"}));
                wsDate = Date.now();
            } else {
                ws.send(JSON.stringify({"Command":"login", "Payload": `The device is already used by '${wsUserName}'`}));
            }
        }
    }
}

app.targetCoordinates = function(ws, payload, token) {
    if(token == wsAuthToken) {
        for(let arrayIndex = 0; arrayIndex < payload.length; arrayIndex++) {
            app.targetCoordArrayOfArrays.push(payload[arrayIndex]);
        }
        ws.send(JSON.stringify({"Command":"targetCoordinates", "Payload":"Success"}));
        console.log("The server received the coordinates as follow: "+payload);
    } else {
        ws.send(JSON.stringify({"Command":"targetCoordinates", "Payload":"Wrong token"}));
    }
}



app.logoff = function(token) {

}

app.errorFn = function(err) {
    console.log("An error occurred unknown command: "+err);
}

module.exports=roverRouter;