import Court from "./Court";

/** The helper class that that revolves around websocket
 * It gets commands from Court class and returns callbacks
 * like onConnectionBroken() onCoordinatesReached() onSuccessfulLogin()
 * onFailed Login back to Court class
 * */
export default class WebSocketHandler {
    constructor(court) {
        this.court = court;
        this.loginSocket = null;
        this.heartBeatSocket = null;
        this.coordsSocket = null;
        this.logoffSocket = null;
        this.token  = null;
        this.login = this.login.bind(this);
        this.loginResponseParser = this.loginResponseParser.bind(this);
        this.sendTargetCoordinates = this.sendTargetCoordinates.bind(this);
        this.heartBeatResponseParser = this.heartBeatResponseParser.bind(this);
    }

    login(token, userName) {
        console.log(this.court.BASE_URL+"browser/login");
        this.loginSocket = new WebSocket(this.court.BASE_URL+"browser/login",'ws');
        this.loginSocket.onopen = (e) => {
            this.court.setState({"wsConnecting": true});
            this.court.showInfoMessage("Connecting to web-socket");
            this.loginSocket.onmessage = this.loginResponseParser;
            this.loginSocket.send(JSON.stringify({"Command": "login", "Payload": userName, "token": token}));
            this.token = token;
        };

    }

    loginResponseParser(event) {
        const message = JSON.parse(event.data);
        if(message.Command == "login") {
            if(!message.Payload.startsWith("Failure:")) {
                this.heartBeatSocket = new WebSocket(this.court.BASE_URL+"browser/heartbeat", "ws");
                this.heartBeatSocket.onopen = (e) => {
                    this.heartBeatSocket.onmessage = this.heartBeatResponseParser;
                }
                this.coordsSocket = new WebSocket(this.court.BASE_URL+"browser/coords", "ws");
                this.logoffSocket = new WebSocket(this.court.BASE_URL+"browser/logoff", "ws");
                this.court.login2DeviceSucceeded();
            } else {
                this.court.login2DeviceFailed("The login failed due to '"+message.Payload+"'");
            }
        } else {
            this.court.login2DeviceFailed("The login command expected but received: '"+message.command+"'");
        }

    }

    heartBeat(userName, newToken) {
        this.heartBeatSocket.send(JSON.stringify({"Command": "heartBeat", "Payload":userName, "token": newToken}));
    }

    heartBeatResponseParser(event) {
        const message = JSON.parse(event.data);
        if(message.Command == "heartBeat" && !message.Payload.startsWith("Failure:")) {
            this.court.heartBeatSuccessful(message.token);
        } else {
            this.court.heartBeatFailed(message.token);
        }
    }

    sendTargetCoordinates(xyArray) {
        this.coordsSocket.send(JSON.stringify({"Command": "coords", "Payload":xyArray, "token": this.token}));
    }

    logout(userName, token) {
        this.logoffSocket.onmessage = this.logoutResponseParser;
        this.logoffSocket.send(JSON.stringify({"Command": "logoff", "Payload": userName, "token": token}));
    }

    logoutResponseParser(event) {
        const message = JSON.parse(event.data);
        if(message.Command == "logoff") {
            if (message.Payload == "Success") {
                this.loginSocket.close();
                this.heartBeatSocket.close();
                this.coordsSocket.close();
                this.logoffSocket.close();
            }
        }
    }
}