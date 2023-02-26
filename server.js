const express = require("express");
const bodyParser = require("body-parser");

const Authentication = require("./security");
const authentication = new Authentication();

const app = express(); // create express app

app.use(bodyParser.json())

app.use(express.static('build'));

app.post('/target', function(request, response){
    console.log(request.body);      // your JSON
    response.send(request.body);    // echo the result back
});

app.post('/auth', function(request, response) {
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
        response.send({"status":"Authenticated"});
    } catch(e) {
        console.log(e);
        response.status(401);
        response.send({"status":e.messages});
    }

});

app.post('/user', function(request, response) {
    const virginHeader = request.headers["security-token"];
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
        response.send({"status":"Authenticated"});
    } catch(e) {
        console.log(e);
        response.status(401);
        response.send({"status":e.messages});
    }


});



// start express server on port 5000
app.listen(5000, () => {
    console.log("server started on port 5000");
});

