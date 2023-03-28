import Court from "./Court";

/** The helper class that that revolves around websocket
 * It gets commands from Court class and returns callbacks
 * like onConnectionBroken() onCoordinatesReached() onSuccessfulLogin()
 * onFailed Login back to Court class
 * */
export default class WebSocketHandler {
    constructor(court) {
        this.court = court;
        this.socket = null;
        this.token  = null;
        this.login = this.login.bind(this);
        this.loginResponseParser = this.loginResponseParser.bind(this);
        this.connectedToDevice = this.connectedToDevice.bind(this);
        this.sendTargetCoordinates = this.sendTargetCoordinates.bind();
    }

    login(token) {
        this.socket = new WebSocket(this.court.BASE_URL+"ws",'ws');
        this.socket.onopen = (e) => {
            this.court.setState({"wsConnecting": true});
            this.court.showInfoMessage("Connecting to web-socket");
            this.socket.onmessage = this.loginResponseParser;
            this.socket.send(JSON.stringify({"command": "login", "payload": token, "token": token}));
            this.token = token;
        };

    }

    loginResponseParser(event) {
        const message = JSON.parse(event.data);
        if(message.Command == "login") {
            if(message.Payload == "Success") {
                this.court.login2DeviceSucceeded();
                this.socket.onmessage = this.connectedToDevice;
            } else {
                this.court.login2DeviceFailed("The login failed due to '"+message.Payload+"'");
            }
        } else {
            this.court.login2DeviceFailed("The login command expected but received: '"+message.command+"'");
        }

    }

    connectedToDevice(event) {
       const message = JSON.parse(event.data);
       switch (message.command) {
           case("heartBeat"): this.court.connectedToDevice(); break;
           case("coordinatesReceived"): this.court.coordinatesReceivedByDevice(); break;
           case("loggedOff"): this.court.loggedOffFromDevice(); break;
           default: this.court.deviceFailed(`Unknown device command: '${message.command}'`);
       }
    }

    sendTargetCoordinates(x, y) {
        this.socket.send(JSON.stringify(`{"command": "target", "payload":"${x}/${y}}", "token"=${this.token}`));
    }

    logout() {
        this.socket.send(JSON.stringify(`{"command": "logoff", "payload":"Initiated by user", "token"=${this.token}`));
    }
}