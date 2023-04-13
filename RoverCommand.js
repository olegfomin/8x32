/** Interceptor for all communication with the rover. It contains a method with the
 * Web-Socket signature that should be used when the sockets gets registered. It allows
 * both sending a command via Web-Service and receiving feedback. The commands can only
 * be sent after the rover connected itself to a web-socket
 */

const roverRouter = require("./server");

class RoverCommand {
    constructor(roverRouter) {
        this.roverRouter = roverRouter;
        this.isWebSocketOpen = false;
        this.socket = null;
        this.ws   = null;
        this.req  = null;
        this.send = this.send.bind(this);
        this.onConnected = this.onConnected.bind(this);
        this.shim = this.shim.bind(this);
    };

    onConnected(socket, request) {
        this.isWebSocketOpen = true;
        this.socket = socket;
    }

    send(message) {
        if(this.isWebSocketOpen) {
            this.ws.send(message);
        } else {
            throw new Error("Illegal state exception the socket has not been connected yet")
        }
    };

    onReceived(message) {
    };

    /* The piece that goes instead of the function inside router.ws('path', function(ws, req) { ... */
    shim(ws, req) {
       this.ws  = ws;
       this.req = req;
       ws.on('message', msg => {
           this.onReceived(msg);
       });
       ws.on('connection', (socket, req) => {
           this.onConnected(socket, req);
       });
    };
}

class LoginRoverCommand extends RoverCommand {
    onReceived(message) {
        const basicAuthJson = JSON.parse(message);
        this.roverRouter.onLogin(basicAuthJson);
    };
};

class CoordsRoverCommand extends RoverCommand {
    onReceived(message) {
        const xy = JSON.parse(message);
        this.roverRouter.onCoordsReceived(xy);
    };
}

class HeartBeatRoverCommand extends RoverCommand {
    onReceived(message) {
        const heartBeatInfo = JSON.parse(message);
        this.roverRouter.onHeartBeat(heartBeatInfo);
    };
};

class LogoffRoverCommand extends RoverCommand {
    onReceived(message) {
        this.roverRouter.onLogoff();
    };
}

module.exports={LoginRoverCommand, CoordsRoverCommand, HeartBeatRoverCommand, LogoffRoverCommand};