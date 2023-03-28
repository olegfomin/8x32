/* The only reason for this class to exist is to be able to
read settings from a settings file but without instance of
SettingsWindow that we do not want to expose in a very beginning
while initializing an application. In other words this class
plays the role of the headless SettingsWindow
 */

import Court from "./Court";

export default class SettingCommunicationAdapter {
    constructor(court) {
      this.court = court;
      this.settingsSaved = this.settingsSaved.bind(this);
      this.settingsFailed = this.settingsFailed.bind(this);
      this.settingsRetrieved = this.settingsRetrieved.bind(this);
      this.settingsRetrievalFailed = this.settingsRetrievalFailed.bind(this);
    }

    settingsSaved() {
        this.court.showInfoMessage("Settings successfully saved");
    }

    settingsFailed(reason) {
        this.court.showErrorMessage(`Settings did not load. ${reason}`);
    }

    settingsRetrievalFailed(reason) {
        this.court.showInfoMessage("Settings did not load. Setting default values");
    }

    settingsRetrieved(json) {
        this.court.settingsRetrieved(json);
        this.court.showInfoMessage("Settings successfully loaded");
    }




}