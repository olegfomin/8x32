function drawACourt(ctx) {
    const greenFieldWidth = 20;
    const greenFieldHeight = 34.2;
    const courtWidth = 12;
    const courtHeight = 24;
    const tickLength = 0.5;
    const playPairLine = 1.37;
    const serviceLine2Net = 6.4;
    const verticalCorrection = 0.3;
    const horizontalCorrection = 1.78; //2.75
    const pillarsOffset = 0.5;
    const pillarRadius = 5;
    const widthOffset = (greenFieldWidth - courtWidth - horizontalCorrection) / 2;

    const heightOffset = (greenFieldHeight - courtHeight - verticalCorrection) / 2;

    const multiplier = 32; //

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

export default drawACourt;