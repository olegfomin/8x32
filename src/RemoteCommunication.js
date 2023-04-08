import Court from "./Court"
import {Buffer} from "buffer";
import axios from 'axios';

export default class RemoteCommunication {
    constructor(court) {
        this.MAX_FAILED_HEARTBEATS = 3;
        this.currentFailedHeartBeats = 0;
        this.BASE_URL = "http://www.roboticrover.com:5000";
        this.court = court;

        this.failedHeartBeatResponseCounter = this.failedHeartBeatResponseCounter.bind(this);
        this.failedHeartBeatResponseCounter = this.failedHeartBeatResponseCounter.bind(this);
    }

    // Logs into the system and returns the security token in callback
    login(userName, password) {
        const encodedString = Buffer.from(`${userName}:${password}`).toString('base64');
        const command = `{"Command": "${userName}", "Payload": "${userName}"}`;
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': command.length,
                'Accept': 'application/json',
                'authorization': 'Basic ' + encodedString
            },
            body: command
        };
        fetch('auth', requestOptions) // Calling the authentication server
            .then(response => {
                if (response.status == 200) this.court.successfulLogin(response);
                else this.court.failedLogin(new Error(""+response.status));
            })
            .catch(e => {
                this.court.failedLogin(e);
            });
    }

    slowHeartBeat(token, userName) {
        const message = {"Command":"heartBeat", "Payload":userName, "token": token};
        const messageAsStr= JSON.stringify(message);
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json',
                'Content-Length': messageAsStr.length,
                'Accept': '*/*',
                'security-token': token
            },
            body: messageAsStr
        };
        fetch('heart-beat', requestOptions) // Calling the authentication server
            .catch(e=>{this.failedHeartBeatResponseCounter()});
    }


    // Login off
    logoff(token, heartBeatAgentId) {
        if(heartBeatAgentId != null && heartBeatAgentId != undefined) clearInterval(this.state.HeartBeatAgentId);
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': '2',
                'Accept': '*/*',
                'security-token':+""+token
            },
            body: JSON.stringify({})
        };
        fetch('logoff', requestOptions) // Calling the authentication server
            .then(response => {
                if (response.status == 200) {
                    this.court.successfulLogoff();
                }
                else this.court.failedLogoff(response.status);
            })
            .catch(e => {
                this.court.failedLogoff(e)
            });
    }

    failedHeartBeatResponseCounter() {
        this.currentFailedHeartBeats++;
        if(this.currentFailedHeartBeats >  this.MAX_FAILED_HEARTBEATS) {
           this.court.slowHeartBeatsFailed();
            this.currentFailedHeartBeats=0
        }
    }
}    