import Court from "./Court";

/** The helper class that that revolves around websocket
 * It gets commands from Court class and returns callbacks
 * like onConnectionBroken() onCoordinatesReached() onSuccessfulLogin()
 * onFailed Login back to Court class
 * */
export default class WebSocketHandler {
    constructor(court) {
        this.court = court;
        this.browserSocket = null;
        this.token  = null;
        this.login = this.login.bind(this);
        this.loginResponseParser = this.loginResponseParser.bind(this);
        this.connectedToDevice = this.connectedToDevice.bind(this);
        this.sendTargetCoordinates = this.sendTargetCoordinates.bind(this);
    }

    login(token, userName) {
        this.browserSocket = new WebSocket(this.court.BASE_URL+"browser",'ws');
        this.browserSocket.onopen = (e) => {
            this.court.setState({"wsConnecting": true});
            this.court.showInfoMessage("Connecting to web-socket");
            this.browserSocket.onmessage = this.loginResponseParser;
            this.browserSocket.send(JSON.stringify({"Command": "login", "Payload": userName, "token": token}));
            this.token = token;
        };

    }

    loginResponseParser(event) {
        const message = JSON.parse(event.data);
        if(message.Command == "login") {
            if(message.Payload == "Success") {
                this.court.login2DeviceSucceeded();
                this.browserSocket.onmessage = this.connectedToDevice;
            } else {
                this.court.login2DeviceFailed("The login failed due to '"+message.Payload+"'");
            }
        } else {
            this.court.login2DeviceFailed("The login command expected but received: '"+message.command+"'");
        }

    }

    heartBeat(userName, token) {
        this.browserSocket.send({"Command": "heartBeat", "Payload":userName, "token": token});
    }



    connectedToDevice(event) {
       const message = JSON.parse(event.data);
       switch (message.Command) {
           case("heartBeat"): this.court.connectedToDevice(message); break;
           case("coordinatesReceived"): this.court.coordinatesReceivedByDevice(); break;
           case("loggedOff"): this.court.loggedOffFromDevice(); break;
           default: this.court.deviceFailed(`Unknown device command: '${message.command}'`);
       }
    }

    sendTargetCoordinates(xyArray) {
        this.browserSocket.send(JSON.stringify({"command": "targetCoordinates", "Payload":xyArray, "token": this.token}));
    }

    logout() {
        this.browserSocket.send(JSON.stringify(`{"command": "logoff", "Payload":"Initiated by user", "token"="${this.token}"}}`));
    }
}