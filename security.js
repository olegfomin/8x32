/* This module contains the user-names and passwords. Currently they are written into the file and password is
base-64 encoded. TODO improve the security of the password storage
*/

const fs = require("fs");
const uuid = require("uuid");
const propertiesReader = require('properties-reader');

class Authentication {
    SESSION_DURATION = 1000 * 3600 / 2; // Duration of the session is half hour
    constructor() {
        this.userName2PasswordMap = {}; // Stores the user-names as a key and decrypted password as value
        this.token2DateMap = {}; // Stores a map between the token received after a user authentication and a date when it was given
        this.token2UserNameMap = {} // Stores a map between the token received after a user authentication and a username
        this.load = this.load.bind(this);
        this.purge = this.purge.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.validateAndRefresh = this.validateAndRefresh.bind(this);

        setInterval(this.purge, this.SESSION_DURATION / 10); // runs every hour and clears all usernames whose session is expired
        setTimeout(this.load, 1000);
    }

    purge() {
        const allTokens = Object.keys(this.token2DateMap);
        const currentTime = Date.now();
        for (let i = 0; i < allTokens.length; i++) {
            let currentToken = allTokens[i];
            let dateOfToken = this.token2DateMap[currentToken];
            if (dateOfToken + this.SESSION_DURATION < currentTime) {
                delete this.token2DateMap[currentToken];
                delete this.token2UserNameMap[currentToken];
            }
        }
    }

    authenticate(userName, password) {
        const passwordRetrieved = this.userName2PasswordMap[userName];
        if (passwordRetrieved == null || passwordRetrieved == undefined) throw new Error("The user-name does not exist: '" + userName + "'");
        if (password !== passwordRetrieved) {
            throw new Error("The password for user-name '" + userName + "' is invalid");
        }
        const token = uuid.v4();
        const currentTime = Date.now();
        this.token2DateMap[token] = currentTime;
        this.token2DateMap[token] = userName;

        return token;
    }

    validateAndRefresh(token) {
        const tokenDate = this.token2DateMap[token];
        if (tokenDate == null || tokenDate == undefined) throw new Error("Token is invalid");
        const currentTime = Date.now();
        if (tokenDate + this.SESSION_DURATION < currentTime) throw new Error("Token is expired");
        this.token2DateMap[token] = currentTime;
    }

    mkUser(callerToken, userName, password) {
       const callerName = this.token2UserNameMap[callerToken];
       if(callerName != "admin") throw new Error("You must be an 'admin' to create new users");
       const buff = new Buffer(password);
       const base64data = buff.toString('base64');
       this.userName2PasswordMap[userName]=base64data;
       // TODO finish the user creation
    }

    load() {
        const properties = propertiesReader('./security.properties');
        properties.each((key, value) => {
            const passwordDecoded = Buffer.from(value, 'base64').toString('ascii');
            this.userName2PasswordMap[key] = passwordDecoded;
        });
    }


}

module.exports=Authentication;