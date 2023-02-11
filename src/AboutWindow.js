import './AboutWindow.css';
import React, { useRef, useEffect } from 'react';

export default class AboutWindow extends React.Component {
    componentDidMount() {
    }
    render() {
        return (
            <div id="AboutWindow">
              <form>
                <div>
                    <div id="UpfrontImage" src="./images/UpfrontView.png"></div>
                    <p>This web-site contains information, data, settings and it can control a universal four wheeled chassis.
                    This device is going to become autonomous but you can also control this machine from this web-site.
                    The author of this site can see a lot of applications for this apparatus starting from being a tennis-court
                    janitor, then it can be a tennis ball picker and at the very peak of its development it can be an avid
                    a tennis player that can successfully compete with the humans in a game of tennis. Though it is started
                    as a tennis court application the all terrain automated cart may also finds its application in other
                    type of games or become a decoy for a hunting game where the hunters a trying to aim at the artifact
                    rather than target a life animal. This chassis can also be useful in the construction industry and
                    other types of applications. The only thing where the author of this site does NOT want this frame to
                    be used is a military operations. Never I can see any real terminal weapon I can see mounted on top
                    of the invention. Where I am still hesitating is the mine fields defusing operation where this robot
                    can be really useful about and it can safe lives and health of people on the other hand it can also
                        facilitate more rapid motion and deployment of the armed forces.</p>
                </div>
                <button id="aboutSubmitButton" onClick={this.props.handleAboutSubmitClick}>Ok</button>
              </form>
            </div>
        );
    }
}