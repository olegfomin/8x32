import logo from './logo.svg';
import './Court.css';
import React, { useRef, useEffect } from 'react';
import Menu from "./Menu"
import ReactDOM from "react-dom/client";

  function Court() {
    function drawACourt(context) {
      const greenFieldWidth = 20;
      const greenFieldHeight = 40;
      const courtWidth = 12;
      const courtHeight = 24;
      const tickLength = 0.5;
      const playPairLine = 1.37;
      const serviceLine2Net = 6.4;
      const verticalCorrection = 5.3;
      const horizontalCorrection = 2.75;
      const pillarsOffset = 0.5;
      const pillarRadius = 5;
      const widthOffset = (greenFieldWidth - courtWidth - horizontalCorrection) / 2;

      const heightOffset = (greenFieldHeight - courtHeight - verticalCorrection) / 2;

      const multiplier = 34;

      const ctx = context.getContext("2d");
      const grd = ctx.createLinearGradient(0, greenFieldWidth * multiplier, 0, greenFieldHeight * multiplier);
      grd.addColorStop(0, "lightgreen");
      grd.addColorStop(1, "darkgreen");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, greenFieldWidth * multiplier, greenFieldHeight * multiplier);

      const grdBlue = ctx.createLinearGradient(0, courtWidth * multiplier, 0, courtHeight * multiplier);
      grdBlue.addColorStop(0, "blue");
      grdBlue.addColorStop(1, "navy");
      ctx.fillStyle = grdBlue;
      ctx.fillRect(widthOffset * multiplier, heightOffset * multiplier, courtWidth * multiplier, courtHeight * multiplier);

      // Rectangular around blue area
      ctx.beginPath();
      ctx.moveTo(widthOffset * multiplier, heightOffset * multiplier);
      ctx.lineTo(widthOffset * multiplier, heightOffset * multiplier + courtHeight * multiplier);
      ctx.lineTo(widthOffset * multiplier + courtWidth * multiplier, heightOffset * multiplier + courtHeight * multiplier);
      ctx.lineTo(widthOffset * multiplier + courtWidth * multiplier, heightOffset * multiplier);
      ctx.lineTo(widthOffset * multiplier, heightOffset * multiplier);

      // Little up tick
      ctx.moveTo(widthOffset * multiplier + courtWidth * multiplier / 2, heightOffset * multiplier);
      ctx.lineTo(widthOffset * multiplier + courtWidth * multiplier / 2, heightOffset * multiplier + tickLength * multiplier);

      // Little down tick
      ctx.moveTo(widthOffset * multiplier + courtWidth * multiplier / 2, heightOffset * multiplier + courtHeight * multiplier);
      ctx.lineTo(widthOffset * multiplier + courtWidth * multiplier / 2, heightOffset * multiplier + courtHeight * multiplier - tickLength * multiplier);

      // playPairLine left
      ctx.moveTo(widthOffset * multiplier + playPairLine * multiplier, heightOffset * multiplier);
      ctx.lineTo(widthOffset * multiplier + playPairLine * multiplier, heightOffset * multiplier + courtHeight * multiplier);

      // playPairLine right
      ctx.moveTo(widthOffset * multiplier + courtWidth * multiplier - playPairLine * multiplier, heightOffset * multiplier);
      ctx.lineTo(widthOffset * multiplier + courtWidth * multiplier - playPairLine * multiplier, heightOffset * multiplier + courtHeight * multiplier);

      // net line
      ctx.moveTo(widthOffset * multiplier, heightOffset * multiplier + courtHeight * multiplier / 2);
      ctx.lineTo(widthOffset * multiplier + courtWidth * multiplier, heightOffset * multiplier + courtHeight * multiplier / 2);

      // Central line perpendicular to net line
      ctx.moveTo(widthOffset * multiplier + courtWidth * multiplier / 2, heightOffset * multiplier + courtHeight * multiplier / 2 + serviceLine2Net * multiplier);
      ctx.lineTo(widthOffset * multiplier + courtWidth * multiplier / 2, heightOffset * multiplier + courtHeight * multiplier / 2 - serviceLine2Net * multiplier);

      // Top Service line
      ctx.moveTo(widthOffset * multiplier + playPairLine * multiplier, heightOffset * multiplier + courtHeight * multiplier / 2 - serviceLine2Net * multiplier);
      ctx.lineTo(widthOffset * multiplier + courtWidth * multiplier - playPairLine * multiplier, heightOffset * multiplier + courtHeight * multiplier / 2 - serviceLine2Net * multiplier);

      // Bottom Service line
      ctx.moveTo(widthOffset * multiplier + playPairLine * multiplier, heightOffset * multiplier + courtHeight * multiplier / 2 + serviceLine2Net * multiplier);
      ctx.lineTo(widthOffset * multiplier + courtWidth * multiplier - playPairLine * multiplier, heightOffset * multiplier + courtHeight * multiplier / 2 + serviceLine2Net * multiplier);

      ctx.strokeStyle = 'white';
      ctx.lineWidth = 4;
      ctx.stroke();


      // Net pillars
      ctx.beginPath();
      ctx.moveTo(widthOffset * multiplier - pillarsOffset * multiplier, heightOffset * multiplier + courtHeight * multiplier / 2);

      ctx.arc(widthOffset * multiplier - pillarsOffset * multiplier, heightOffset * multiplier + courtHeight * multiplier / 2, pillarRadius, 0, 2 * Math.PI);

      ctx.moveTo(widthOffset * multiplier + courtWidth * multiplier + pillarsOffset * multiplier, heightOffset * multiplier + courtHeight * multiplier / 2);

      ctx.arc(widthOffset * multiplier + courtWidth * multiplier + pillarsOffset * multiplier, heightOffset * multiplier + courtHeight * multiplier / 2, pillarRadius, 0, 2 * Math.PI);
      ctx.fillStyle = "red";
      ctx.fill();
      ctx.strokeStyle = 'red';

      ctx.lineWidth = 3;
      ctx.stroke();
    }

    function handleClick(event) {
      alert("I am here "+event.clientX+" "+event.clientY);
    }

    function handleLoginClick(event) {
      alert("handleLoginClick");
    }

    function handleLogoutClick(event) {
      alert("handleLogoutClick");
    }

    function handleSettingsClick(event) {
      alert("handleSettingsClick");
    }

    function handleCalibrationClick(event) {
      alert("handleCalibrationClick");
    }

    function handleAboutClick(event) {
      alert("handleAboutClick");
    }

    React.useEffect(() => {
      const c = document.getElementById("myCanvas");
      const ctx = c.getContext("2d");
//      ctx.moveTo(20, 20);
//      ctx.lineTo(100, 100);
//      ctx.stroke();
      drawACourt(c);
    }, []);

    return (
        <div className="center" height="1300" width="700">
          <div>
            <button id="loginButton" onClick={handleLoginClick}>Login</button>
            <button id="logoutButton" onClick={handleLogoutClick} disabled>Logout</button>
            <button id="settingsButton" onClick={handleSettingsClick} disabled>Settings</button>
            <button id="calibrationButton" onClick={handleCalibrationClick} disabled>Calibration</button>
            <button id="aboutButton" onClick={handleAboutClick} disabled>About</button>
          </div>
          <canvas id="myCanvas" className="center"  height="1200" width="590" onClick={handleClick}>
            Your browser does not support the HTML canvas tag.
          </canvas>
          <div id="loginWindow">
            <form>
              <label id="usernameLabel" htmlFor="username">Username:</label><input id="username" type="text"/>
              <label  id = "passwordLabel" htmlFor="password">Password:</label><input id="password" type="password"/>
              <button id = "submitButton">Submit</button>
            </form>
          </div>
        </div>);
  };

export default Court;
