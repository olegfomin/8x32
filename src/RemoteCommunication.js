import Court from "./Court"
import {Buffer} from "buffer";

export default class RemoteCommunication {
    constructor(court) {
        this.MAX_FAILED_HEARTBEATS = 3;
        this.currentFailedHeartBeats = 0;
        this.BASE_URL = "http://www.roboticrover.com:5000";
        this.court = court;

        this.failedHeartBeatResponseCounter = this.failedHeartBeatResponseCounter.bind(this);
    }

    // Logs into the system and returns the security token in callback
    login(userName, password) {
        const encodedString = Buffer.from(`${userName}:${password}`).toString('base64');
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': '2',
                'Accept': '*/*',
                'authorization': 'Basic ' + encodedString
            },
            body: JSON.stringify({})
        };
        fetch('', requestOptions) // Calling the authentication server
            .then(response => {
                if (response.status == 200) this.court.successfulLogin(response);
                else this.court.failedLogin(new Error(""+response.status));
            })
            .catch(e => {
                this.court.failedLogin(e);
            });
    }

    saveSettings(token, settings) {
        const settingsAsString = JSON.stringify(settings);
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': "'"+settingsAsString.length+"'",
                'Accept': '*/*',
                'security-token': token
            },
            body: settingsAsString
        };
        fetch('settings', requestOptions) // Calling the authentication server
            .then(response => {
                if (response.status == 200) this.court.settingsSaved();
                else this.court.settingsFailed(response.status);
            })
            .catch(e => {
                this.court.settingsFailed(e);
            });

    }

    getSettings(token) {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': "2",
                'Accept': '*/*',
                'security-token': token
            },
            body: "{}"
        };
        fetch('settings', requestOptions) // Calling the authentication server
            .then(response => {
                if (response.status == 200) this.court.settingsRetrieved(response);
                else this.court.settingsRetrievalFailed(response.status);
            })
            .catch(e => {
                this.court.settingsRetrievalFailed(e);
            });

    }

    sendCoordinates(token, xy) {

    }


    heartBeat(token) {
        const heartBeatAgentId = setInterval( () => {
            const requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json',
                    'Content-Length': '2',
                    'Accept': '*/*',
                    'security-token': token
                },
                body: JSON.stringify({})
            };
            fetch('heart-beat', requestOptions) // Calling the authentication server
                .then(response => {if(response.status == 200) {this.currentFailedHeartBeats=0}
                                   else {this.failedHeartBeatResponseCounter()}})
                .catch(e=>{this.failedHeartBeatResponseCounter()});
        }, 10000);
        return heartBeatAgentId;
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
           this.court.heartBeatsFailed();
            this.currentFailedHeartBeats=0
        }
    }
}    