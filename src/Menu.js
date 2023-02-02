import './Menu.css';
import React from 'react';

class Menu extends React.Component {
    render() {
        return <div id="menuArea">
            <ul>
                <li className="enabled">Login</li>
                <li className="disabled">Logout</li>
                <li className="disabled">Sign Up</li>
                <li className="disabled">Settings</li>
                <li className="disabled">Calibration</li>
            </ul>
        </div>;
    }
}

export default Menu;

