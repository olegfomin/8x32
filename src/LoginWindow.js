import './LoginWindow.css';
import React, { useRef, useEffect } from 'react';

import ReactDOM from "react-dom/client";
import drawACourt from "./DrawCourtFunction";

export default class LoginWindow extends React.Component {
  componentDidMount() {
      const userName = document.getElementById("username");
      userName.value = "rudolf";
  }

  render() {
    return (
      <div id="loginWindow">
        <form>
          <label id="usernameLabel" htmlFor="username">Username:</label><input id="username" type="text"/>
          <label id="passwordLabel" htmlFor="password">Password:</label><input id="password" type="password"/>
          <button id="submitButton" onClick={this.props.callBackFunction}>Submit</button>
        </form>
      </div>
    );
  }
}
