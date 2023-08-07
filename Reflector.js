/** A generic Reflector class it route call back to the Web-Socket router's methods
 * that makes communication between two routers very convenient.
 * This class accommodates both Rover and Browser callback helper
 * features. Since it is a generic and being used for both Rover and Browser
 * it never mentions any of these identifiers inside.
 * The Rover and Browser communicate to each other in the cyclical dependency
 * fashion thus it has two constructors and one setter.
 * The first constructor accepts only one router (Browser or Rover) and the
 * second setter accepts the other one
 */

class Reflector {
    constructor(routerThis) { // Here is a constructor with one argument please don't forget to use setter for the second one
        this.LOGIN = "login";
        this.COORDS = "coords";
        this.HEART_BEAT = "heartBeat";
        this.LOGOFF = "logoff";

        this.routerThis = routerThis;
        this.routerThat = null;
        this.wsThis   = null;
        this.wsThat   = null;
        this.sendThis = this.sendThis.bind(this);
        this.onConnected = this.onConnected.bind(this);
        this.shimThis = this.shimThis.bind(this);
        this.shimThat = this.shimThat.bind(this);
    }

    setRouterThat(routerThat) { // The addendum setter for constructor with one argument
        this.routerThat = routerThat;
    }

    sendThis(message) {
        if(this.wsThis != null) {
            this.wsThis.send(message);
        } else {
            throw new Error("Illegal state exception the socket has not been connected yet")
        }
    };

    sendThat(message) {
        if(this.wsThat != null) {
            this.wsThat.send(message);
        } else {
            throw new Error("Illegal state exception the socket has not been connected yet")
        }
    }

    // abstract method
    onConnected(request) { // This method is not implemented here and should have been declared as abstract
    };


    // abstract method
    onReceived(message) { // This method is not implemented here and should have been declared as abstract
    };

    /* The piece that goes instead of the function inside router.ws('path', function(ws, req) { ... */
    shimThis(ws, req) {
       this.wsThis  = ws;
       this.req = req;
       ws.on('message', msg => {
           this.onReceived(msg);
       });
       ws.on('connection', (socket, req) => {
           this.onConnected(socket, req);
       });
    };

    shimThat(ws, req) {
        this.wsThat  = ws;
        this.req = req;
        ws.on('message', msg => {
            this.onReceived(msg);
        });
        ws.on('connection', (socket, req) => {
            this.onConnected(socket, req);
        });
    };
}

class LoginCommand extends Reflector {
    onReceived(message) {
        try {
            const commandAndPayload = JSON.parse(message);
            if(commandAndPayload.Command == this.LOGIN) {
                if(commandAndPayload.Payload != null &&
                    commandAndPayload.Payload.length != 0) {
                    const result = this.routerThis.onLogin(commandAndPayload);
                    if(result != "Success") {
                        console.log(result);
                        this.wsThis.send(`{"Command": "login", 
                                           "Payload": "${result}",
                                           "token": "${commandAndPayload.token}"}`);

                    }
                } else {
                    console.log(`Failure: Payload in LoginCommand must not be empty`);
                    this.wsThis.send(`{"Command": "login", 
                                       "Payload": "Failure: the payload is empty",
                                       "token": "${commandAndPayload.token}"}`);
                }
            } else {
                console.log(`Failure: Expected command is 'login' but it was ${commandAndPayload.Command}`);
                this.wsThis.send(`{"Command": "login", 
                                   "Payload": "Failure: the expected command is 'login'",
                                   "token": "${commandAndPayload.token}"}`);
            }
        } catch(e) {
            console.log(`Failure: is inside the LoginCommand('...`);
            console.log(`message=${e.message}`)
        }
    };
};

class CoordsCommand extends Reflector {
    onReceived(message) {
        try {
            const xy = JSON.parse(message);
            if (xy.Command == this.COORDS) {
                if (Array.isArray(xy.Payload)) {
                    const result = this.routerThis.onCoordsReceived(xy);
                    if (result.startsWith("Failure:")) {
                        this.wsThis.send(`{"Command": "coords", 
                                           "Payload": ${result},
                                           "token": "${xy.token}"}`);
                    }
                } else {
                    console.log(`Failure: Payload in coords command must be an empty`);
                    this.wsThis.send(`{"Command": "coords", 
                                       "Payload": "Failure: the payload is NOT an array",
                                       "token": "${xy.token}"}`);
                }
            } else {
                //Error
                console.log(`Failure: Payload command must be "coords" but it was '${xy.Command}' `);
                this.wsThis.send(`{"Command": "coords", 
                                   "Payload": "Failure: Payload command must be "coords" but it was '${xy.Command}'",
                                    "token": "${xy.token}"}`);
            }
        } catch(e) {
            console.log(`Failure: is inside the LogoffCommand('...`);
            console.log(`message=${e.message}`)
        }
    };
};

class HeartBeatCommand extends Reflector {
    onReceived(message) {
       try {
           const heartBeatInfo = JSON.parse(message);
           if (heartBeatInfo.Command == this.HEART_BEAT) {
               if (heartBeatInfo.Payload != null && heartBeatInfo.Payload.length != 0) {
                   this.routerThis.onHeartBeat(heartBeatInfo);
               } else {
                   console.log(`Failure: Payload in HeartBeatCommand must not be empty`);
                   this.wsThis.send(`{"Command": "heartBeat", 
                                       "Payload": "Failure: in HeartBeatCommand the payload is empty",
                                       "token: ${heartBeatInfo.token}"}`);
               }
           } else {
               console.log(`Failure: Expected command is ${this.HEART_BEAT} but it was ${heartBeatInfo.Command}`);
               this.wsThis.send(`{"Command": ${this.HEART_BEAT}, 
                                   "Payload": "Failure: the expected command is ${this.HEART_BEAT} but it was ${heartBeatInfo.Command}", 
                                   "token": ${heartBeatInfo.token}}`);
           }
       } catch (err) {
           console.log(`Failure: is inside the HeartBeatCommand ('...`);
           console.log(`message=${e.message}`)
       }
    };
};

class LogoffCommand extends Reflector {
    onReceived(message) {
        try {
            const logoffCommand = JSON.parse(message);
            if(logoffCommand.command == this.LOGOFF) {
                if(logoffCommand.Payload != null && logoffCommand.Payload.length != 0) {
                    this.routerThis.onLogoff(logoffCommand);
                } else {
                    console.log(`Failure: Payload in LogoffRoverCommand must not be empty`);
                    this.wsThis.send(`{"Command": ${this.LOGOFF}, 
                                       "Payload": "Failure: in LogoffRoverCommand the payload is empty",
                                       "token: ${logoffCommand.token}"}`);
                }
            } else {
                console.log(`Failure: Expected command is ${this.LOGOFF} but it was ${logoffCommand.command}`);
                this.wsThis.send(`{"Command": ${this.LOGOFF}, 
                                   "Payload": "Failure: the expected command is ${this.LOGOFF} but it was ${logoffCommand.command}", 
                                   "token": ${logoffCommand.token}}`);
            }
        } catch(e) {
            console.log(`Failure: is inside the LogoffCommand('...`);
            console.log(`message=${e.message}`)
        }
    };
}

module.exports={LoginCommand, CoordsCommand, HeartBeatCommand, LogoffCommand};