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

app.use(bodyParser.json());

let wsAuthToken = null; // If null it means no one is controlling device
let wsUserName = null; // Holding a user name as well. If user left the session without logging off
let wsDate     = null;

app.use(express.static('build'));

app.post('/auth', function(request, response) {
    console.log("Auth attempt")
    const virginHeaderBase64 = request.headers["authorization"];
    try {
        if (virginHeaderBase64 == null || virginHeaderBase64 == undefined) throw new Error("The Authorization header is missing");
        const basicPosition = virginHeaderBase64.indexOf("Basic");
        if (basicPosition < 0) throw new Error("No other but 'Basic' type of authentication is supported");
        const base64Part = virginHeaderBase64.substring(basicPosition + 6);
        const authHeader = Buffer.from(base64Part, 'base64').toString('ascii');
        const colonPosition = authHeader.indexOf(":");
        if (colonPosition < 0) throw new Error("Invalid Authorization header format. ':' is expected");
        const userName = authHeader.substring(0, colonPosition);
        const password = authHeader.substring(colonPosition + 1);
        const token = authentication.authenticate(userName, password);

        response.header("security-token", token);
        response.status(200);
        response.send({"message":"Authenticated"});
    } catch(e) {
        console.log(e);
        response.status(401);
        response.send({"message":e.messages});
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
    response.send({"message":"Accepted"});
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

app.ws('/wslogin', function(ws, req) {
    ws.on('message', function(token) {
        if(wsAuthToken == null) {
            wsUserName = authentication.token2UserNameMap[token];
            if(wsUserName != null) {
                wsDate = Date.now();
                wsAuthToken = token;
                console.log("Sent success");
                ws.send("Success");
            } else {
                ws.send("Failure: Invalid security token provided");
            }
        } else {
            if(token == wsAuthToken) {
                ws.send("Success");
                wsDate = Date.now();
            } else {
                const userNameRetrieved = authentication.token2UserNameMap[token];
                if(userNameRetrieved === wsUserName) {
                    wsAuthToken = token;
                    ws.send("Success");
                    wsDate = Date.now();
                } else {
                    ws.send(`Failure: The device is already used by '${wsUserName}'`);
                }
            }
        }
    });
});


// start express server on port 5000
app.listen(5000, () => {
    console.log("server started on port 5000");
});
