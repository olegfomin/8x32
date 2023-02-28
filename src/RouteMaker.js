import Court from "./Court";

/* This class creates a valid route on a tennis court from point A to point B taking into account that there is
* a net across the court. Meaning that if the given points are located on the opposite sides of the court the rover go
* around the net not trying to go through it
*
* All rights belong to www.roboticrover.com
*  */
export default class RouteMaker {
    ON_SAME_SIDE      = 0;
    ON_OPPOSITE_SIDES = 1;
    ON_CORRIDOR_LEFT  = 2;
    ON_CORRIDOR_RIGHT = 3;

    X_COURT_MAX_COORD = 590;
    Y_COURT_MAX_COORD = 1095;
    X_COURT_MIN_COORD = 0;
    Y_COURT_MIN_COORD = 70;

    Y_NET_COORDINATE       = 544;
    X_LEFT_CORRIDOR_LEFT   =  8;
    X_LEFT_CORRIDOR_RIGHT  =  64;
    X_LEFT_CORRIDOR_MEDiAN = (this.X_LEFT_CORRIDOR_RIGHT+this.X_LEFT_CORRIDOR_LEFT)/2;
    X_RIGHT_CORRIDOR_LEFT  =  520;
    X_RIGHT_CORRIDOR_RIGHT = 575;
    X_RIGHT_CORRIDOR_MEDIAN= (this.X_RIGHT_CORRIDOR_LEFT+this.X_RIGHT_CORRIDOR_RIGHT)/2;
    CORRIDOR_LENGTH        = 46;
    CORRIDOR_BOTTOM_Y      = this.Y_NET_COORDINATE + this.CORRIDOR_LENGTH/2;
    CORRIDOR_TOP_Y         = this.Y_NET_COORDINATE - this.CORRIDOR_LENGTH/2;
    X_MEDIAN_LINE          = 292;
    HOW_MANY_JUMPS_A_SECOND= 20;
    DURATION_OF_EACH_JUMP  = 1000/this.HOW_MANY_JUMPS_A_SECOND;

    constructor(court) {
        this.court = court;
        this.route=null;
        this.x2 = null;
        this.y2 = null;
        this.recursiveCallbackHandler = this.recursiveCallbackHandler.bind(this);

    }

    /* Traversing the array of dots that represent the list of vectors being the route's rover. This path is
    *  rendered to the screen as a black circle wih capital R inside that is moving along the path  */
    recursiveCallbackHandler(error, data) {
        if(error == null) {
            let x1 = this.x2;
            let y1 = this.y2;
            let vectorFinish = this.route.shift();
            if(vectorFinish != null) {
                this.x2 = vectorFinish.x;
                this.y2 = vectorFinish.y;
                this.moveRover(x1, y1, this.x2, this.y2, this.recursiveCallbackHandler);
            } else {
                this.court.setState({"Current_X": this.x2, "Current_Y": this.y2}); // TODO it is much better to leave the calls to this function inside Court.js
            }
        } else {
            throw new Error("Something went wrong while moving the rover's picture");
        }
    }

    /* A shadow function of the Court handler */
    handleClick(currentX, currentY, mouseX, mouseY) {
        this.route = this.routeBuilder(currentX, currentY, mouseX, mouseY);
        let vectorStart = this.route.shift();
        let x1 = vectorStart.x;
        let y1 = vectorStart.y;
        let vectorFinish = this.route.shift();
        this.x2 = vectorFinish.x;
        this.y2 = vectorFinish.y;
        this.moveRover(x1, y1, this.x2, this.y2, this.recursiveCallbackHandler);
    }

    // Move a rover picture from one point to another in a straight line only
    moveRover(fromX, fromY, toX, toY, callback) {
        console.log("fromX= "+fromX+" fromY"+fromY+" toX="+toX+" toY"+toY);
        let counter=0;
        const stepX = Math.round((toX - fromX) / 20.0);
        const stepY = Math.round((toY - fromY) / 20.0);
        let currentX = fromX+stepX;
        let currentY = fromY+stepY;
        const intervalId = setInterval(() => {
            this.court.redrawPicture(currentX, currentY);
            currentX += stepX;
            currentY += stepY;
            if(counter >= this.HOW_MANY_JUMPS_A_SECOND-1) {
                clearInterval(intervalId);
                callback(null);
            }
            counter++;
        }, this.DURATION_OF_EACH_JUMP);
    };

    // The function returns 0 if both current and target Y belong to the same part of the court
    // The function returns 1 if the current and target sides are on the different sides of the court
    // it renders 2 if the target is on the left corridor
    // and it returns 3 it the target belongs to the right corridor
    findSides(startX, startY, endX, endY) {
        if((startY > this.CORRIDOR_TOP_Y && endY > this.CORRIDOR_TOP_Y) ||
            (startY < this.CORRIDOR_BOTTOM_Y && endY < this.CORRIDOR_BOTTOM_Y)) return this.ON_SAME_SIDE;


        if((startY > this.CORRIDOR_BOTTOM_Y && endY < this.CORRIDOR_TOP_Y) ||
            (startY < this.CORRIDOR_TOP_Y && endY > this.CORRIDOR_BOTTOM_Y)) return this.ON_OPPOSITE_SIDES;

        return endX > this.X_MEDIAN_LINE ? this.ON_CORRIDOR_RIGHT : this.ON_CORRIDOR_LEFT;

    }

    // Builds the route from point A(x, y) to point B(x, y). Also the input includes right and left corridors so
    // to avoid hitting the net. The output
    // is an array of intermediate x and y like that [{x:x1,y:y1}, {x:x2,y:y2}, {x:x3,x:y3}, ...]
    routeBuilder(startX, startY, endX, endY) {
        const changingSides = this.findSides(startX, startY,
            endX, endY);
        let route = [];
        switch (changingSides) {
            case this.ON_SAME_SIDE: route.push({"x": startX, "y": startY},
                {"x": endX,   "y": endY}); break;
            case this.ON_OPPOSITE_SIDES: route = this.fourBendRoute(startX, startY,
                this.X_LEFT_CORRIDOR_MEDiAN, this.CORRIDOR_BOTTOM_Y,
                this.X_LEFT_CORRIDOR_MEDiAN, this.CORRIDOR_TOP_Y,
                this.X_RIGHT_CORRIDOR_MEDIAN, this.CORRIDOR_BOTTOM_Y,
                this.X_RIGHT_CORRIDOR_MEDIAN, this.CORRIDOR_TOP_Y,
                endX, endY
            ) ; break;

            default: throw Error("Other cases not implemented yet");
        }

        return route;
    }

    // Derives the route from point A on the court to point B on the court. It looks for the shortest route if two
    // given points startX and startY are divided by a net then it looks for the shortest way using the left or the
    // right corridor
    fourBendRoute(startX, startY,
                  leftBendX1, leftBendY1, // left corridor
                  leftBendX2, leftBendY2,
                  rightBendX1, rightBendY1, // right corridor
                  rightBendX2, rightBendY2,
                  endX, endY) {

        const bendLeftOrder12 = {x: [leftBendX1, leftBendX2], y : [leftBendY1, leftBendY2]};
        const bendLeftOrder21 = {x: [leftBendX2, leftBendX1], y : [leftBendY2, leftBendY1]};
        const bendOrderLeft = startY > this.Y_NET_COORDINATE ? bendLeftOrder12 : bendLeftOrder21;

        const leftDistFromStartToBend1 = Math.sqrt((startX-bendOrderLeft.x[0])**2+(startY-bendOrderLeft.y[0])**2);
        const leftDistFromBend2ToEnd = Math.sqrt((bendOrderLeft.x[1]-endX)**2+(bendOrderLeft.y[1]-endY)**2);

        const leftResult = [{x:startX, y:startY}, {x: bendOrderLeft.x[0],
            y: bendOrderLeft.y[0]},
            {x: bendOrderLeft.x[1],
                y: bendOrderLeft.y[1]},
            {x: endX, y: endY}];
        console.log("leftResult="+JSON.stringify(leftResult));
        const distanceThroughLeft    = leftDistFromStartToBend1+leftDistFromBend2ToEnd;

        const bendRightOrder12 = {x: [rightBendX1, rightBendX2], y: [rightBendY1, rightBendY2]}
        const bendRightOrder21 = {x: [rightBendX2, rightBendX1], y: [rightBendY2, rightBendY1]}
        const bendOrderRight = startY > this.Y_NET_COORDINATE ? bendRightOrder12 : bendRightOrder21;

        const rightDistFromOrder12 = Math.sqrt((startX-bendOrderRight.x[0])**2+(startY-bendOrderRight.y[0])**2);
        const rightDistFromBend2ToEnd = Math.sqrt((bendOrderRight.x[1]-endX)**2+(bendOrderRight.y[1]-endY)**2);
        const rightResult = [{x:startX, y:startY}, {x: bendOrderRight.x[0], y: bendOrderRight.y[0]},
            {x: bendOrderRight.x[1], y: bendOrderRight.y[1]}, {x: endX, y: endY}];


        const distanceThroughRight = rightDistFromOrder12+rightDistFromBend2ToEnd;

        const result = distanceThroughLeft < distanceThroughRight ? leftResult : rightResult; // see which is shorter and then sending the response

        return result;

    }

}