import './RoverWindow.css';
import React from 'react';

export default class RoverWindow extends React.Component {


    constructor(props) {
        super(props);
        this.rover_sign = ["Ro","Ro","ov","ve","eR","eR"];
    }

    componentDidMount() {
      let counter=0;
      const rover = document.getElementById("Rover");
      setInterval(()=>{let currentVal=this.rover_sign[counter%(this.rover_sign.length-1)]; rover.innerHTML=currentVal; counter++;}, 500);
    }

    render() {
        return (
            <div id="Rover" style={{"display" : this.props.visible ? "inherit" : "none"}}>Ro</div>
        );
    };
}
