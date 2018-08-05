var posX, posY;

function drawBg()
{
    background = document.getElementById("BackgroundCanvas");
    bgContext = background.getContext("2d");
    //Linha Central
    bgContext.beginPath();
    bgContext.moveTo(background.width/2, 0);
    bgContext.lineTo(background.width/2, background.height/2-background.height/6);
    bgContext.moveTo(background.width/2, background.height/2+background.height/6);
    bgContext.lineTo(background.width/2, background.height);
    bgContext.strokeStyle = "#a51818";
    bgContext.stroke();
    bgContext.closePath();
    //Arco Central
    bgContext.beginPath();
    bgContext.arc(background.width/2, background.height/2, background.height/6, 0, 2*Math.PI);
    bgContext.stroke();
    bgContext.closePath();
    bgContext.beginPath();
    bgContext.fillStyle = "#a51818"
    bgContext.arc(background.width/2, background.height/2, 3, 0, 2*Math.PI);
    bgContext.fill();
    bgContext.closePath();
    //Linhas Intermediarias
    bgContext.beginPath();
    bgContext.moveTo(5*background.width/16, 0);
    bgContext.lineTo(5*background.width/16, background.height);
    bgContext.moveTo(11*background.width/16, 0);
    bgContext.lineTo(11*background.width/16, background.height);
    bgContext.stroke();
    bgContext.closePath();
    //Áreas do Gol
    bgContext.beginPath();
    // 1ª Area
    bgContext.moveTo(0, background.height/2-background.width/8);
    bgContext.lineTo(background.height/6, background.height/2-background.width/8);
    bgContext.lineTo(background.height/6, background.height/2+background.width/8);
    bgContext.lineTo(0, background.height/2+background.width/8);
    //2ªa Area
    bgContext.moveTo(background.width, background.height/2-background.width/8);
    bgContext.lineTo(background.width-background.height/6, background.height/2-background.width/8);
    bgContext.lineTo(background.width-background.height/6, background.height/2+background.width/8);
    bgContext.lineTo(background.width, background.height/2+background.width/8);
    bgContext.strokeStyle = "#a51818";
    bgContext.stroke();
    bgContext.closePath();
    //Traves
    (new Circle(0, background.height/2-background.width/8, 10)).draw(bgContext, true);
    (new Circle(0, background.height/2+background.width/8, 10)).draw(bgContext, true);
    (new Circle(background.width, background.height/2-background.width/8, 10)).draw(bgContext, true);
    (new Circle(background.width, background.height/2+background.width/8, 10)).draw(bgContext, true);
    novoJogo();
}