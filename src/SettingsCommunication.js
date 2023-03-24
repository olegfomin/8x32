import SettingsWindow from "./SettingsWindow";
import {Buffer} from "buffer";
import axios from 'axios';

export default class SettingsCommunication {
    constructor(settingsWindow) {
       this.settingsWindow = settingsWindow;
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
                if (response.status == 200) {
                    this.settingsWindow.settingsSaved();
                }
                else this.settingsWindow.settingsFailed(response.status);
            })
            .catch(e => {
                this.settingsWindow.settingsFailed(e);
            });

    }

    // Calling the web-site to retrieve all the values for the given token
    getSettings(token) {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'security-token': token
            }
        };
        const that = this;
        axios('settings', requestOptions) // Calling the setting holding service
            .then(response => {
                if (response.status == 200) {
                    return response.data;
                } else {
                    that.settingsWindow.settingsRetrievalFailed(response.status);
                    throw new Error("Could not load the settings");
                }
            })
            .then(function(myJson) {
                that.settingsWindow.settingsRetrieved(myJson);
            })
            .catch(e => {
                that.settingsWindow.settingsRetrievalFailed(e);
            });
    }
}