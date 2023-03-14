/* This module contains the user-names and passwords. Currently they are written into the file and password is
base-64 encoded. TODO improve the security of the password storage
*/

const fs = require("fs");
const uuid = require("uuid");
const propertiesReader = require('properties-reader');

/* Handles user authentication during login, closes the session automatically if the heart beat was not received
within 3 minutes
 */
class Authentication {
    SESSION_DURATION = 1000 * 180; // Duration is only three minutes as the calling part is supposed to send a heart beat every 30 seconds
    PROPERTIES_PATH = './security.properties';
    constructor() {
        this.properties = {};
        this.userName2PasswordMap = {}; // Stores the user-names as a key and decrypted password as value
        this.token2DateMap = {}; // Stores a map between the token received after a user authentication and a date when it was given
        this.token2UserNameMap = {} // Stores a map between the token received after a user authentication and a username
        this.load = this.load.bind(this);
        this.purge = this.purge.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.validateAndRefresh = this.validateAndRefresh.bind(this);
        this.isUserNameInTokenList = this.isUserNameInTokenList.bind(this);

        setInterval(this.purge, this.SESSION_DURATION/3); // runs every hour and clears all usernames whose session is expired
        setTimeout(this.load, 1000);
    }

    // Going through the list of 'abandoned' users who did not logout but closed the browser
    purge() {
        const allTokens = Object.keys(this.token2DateMap);
        const currentTime = Date.now();
        for (let i = 0; i < allTokens.length; i++) {
            let currentToken = allTokens[i];
            let dateOfToken = this.token2DateMap[currentToken];
            if (dateOfToken < currentTime) {
                const userName = this.token2UserNameMap[currentToken];
                console.log(`The username ${userName} session has expired. It got purged`)
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
        this.token2DateMap[token] = currentTime+this.SESSION_DURATION;
        this.token2UserNameMap[token] = userName;
        console.log(`The ${userName} got authenticated`);

        return token;
    }

    // Validating that the token is still valid and labels it with a new time so it ain't gonna expire
    validateAndRefresh(token) {
        const tokenDate = this.token2DateMap[token];
        if (tokenDate == null || tokenDate == undefined) throw new Error(`Provided Token ${token} is invalid`);
        const currentTime = Date.now();
        if (tokenDate < currentTime) throw new Error(`The token ${token} is expired`);
        this.token2DateMap[token] = currentTime+this.SESSION_DURATION;
        const username = this.token2UserNameMap[token];
        if(username==null || username==undefined) throw new Error(`The provided Token ${token} is invalid`);
        console.log(`The ${username} has reconfirmed its heart beat` )
    }

    // Creation of the new users can be done by the 'admin' user only
    mkUser(callerToken, userName, password, callback) {
       const callerName = this.token2UserNameMap[callerToken];
       if((callerName==null || callerName==undefined || callerName != "admin")) {
           callback(new Error(`You must be an 'admin' to create a new user. Your name '${callerName}'`));
           return;
       }

       const pwd = this.userName2PasswordMap[userName];
       if(pwd != null) {
           callback(new Error(`The user ${userName} already exist`));
           return;
       }

       const currentDate = Date.now();
       const callerTokenDate = this.token2DateMap[callerToken];
       if((callerTokenDate !=null || callerTokenDate != undefined) && currentDate > callerTokenDate) {
            callback("User 'admin' token is expired");
            return;
       };

       const buff = new Buffer(password);
       const base64data = buff.toString('base64');
       this.userName2PasswordMap[userName]=base64data;
       // TODO finish the user creation
       this.properties.set(userName, base64data);
       this.properties.save(this.PROPERTIES_PATH, callback);
    }

    // Make the list of all users and its tokens
    listUser(callerToken) {
        const callerName = this.token2UserNameMap[callerToken];
        if((callerName==null || callerName==undefined || callerName != "admin")) {
            callback(new Error(`You must be an 'admin' to create a new user. Your name '${callerName}'`));
            return;
        }
        const result = [];
        const userNameList = Object.keys(this.userName2PasswordMap);
        for(let i=0; i <  userNameList.length; i++) {
            let status = this.isUserNameInTokenList(userNameList[i]) ? "active" : "inactive";
            result.push({"userName": userNameList[i], "status": status});
        }
    }

    // Traversing through the list of Token -> User line by line to find whether the user exists in this map
    isUserNameInTokenList(userName) {
       const userNameList = Object.values(this.token2UserNameMap);
        for(let i=0; i <  userNameList.length; i++) {
            if(userNameList[i] == userName) return true;
        }
        return false;
    }

    // Loading security.properties file into the in memory map
    load() {
        this.properties = propertiesReader(this.PROPERTIES_PATH, {writer: { saveSections: true }});
        this.properties.each((key, value) => {
            const passwordDecoded = Buffer.from(value, 'base64').toString('ascii');
            this.userName2PasswordMap[key] = passwordDecoded;
        });
    }

    // Logging off the system
    logoff(token) {
        const userName = this.token2UserNameMap[token];
        delete this.token2DateMap[token];
        delete this.token2UserNameMap[token];
        console.log(`The ${userName} got logged off.  `);
    }

}

module.exports=Authentication;