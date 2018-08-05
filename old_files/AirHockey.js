var disco1, frisbee, start, tela;
var pressionadas = [false, false, false, false];
function novoJogo()
{
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    tela = new World(context, canvas);
    var obj = new Circle(canvas.width/4, canvas.height/2, 50);
    obj.color.setColor(141, 32, 32);
    tela.addObject(obj, "disco1");
    obj = new Circle(canvas.width/2, canvas.height/2, 50);
    obj.color.setColor(196, 108, 44);
    tela.addObject(obj, "frisbee");
    disco1 = new Circulo(50, canvas.width/4, canvas.height/2);
    frisbee = new Circulo(50, canvas.width/2, canvas.height/2);
    inicializar();
}
function inicializar()
{
    start = true;
    document.addEventListener("keydown", keydown);
    document.addEventListener("keyup", keyup);
    //start = setInterval(gameloop, 10);
    context.fill();
    context.clearRect(0, 0, canvas.width, canvas.height);
    gameloop();
}
function keydown(e)
{
    if (e.keyCode==37)
        pressionadas[0] = true;
    if (e.keyCode==38)      // up arrow
        pressionadas[1] = true;
    if (e.keyCode==39)
        pressionadas[2] = true;
    if (e.keyCode==40)      // up arrow
        pressionadas[3] = true;
    if (e.keyCode==82)
        inicializar();
}

function keyup(e)
{
    if (e.keyCode==37)
        pressionadas[0] = false;
    if (e.keyCode==38)      // up arrow
        pressionadas[1] = false;
    if (e.keyCode==39)
        pressionadas[2] = false;
    if (e.keyCode==40)      // up arrow
        pressionadas[3] = false;
}

function acionarTeclas()
{
    if (pressionadas[0])
        tela.objects.disco1.setAcelX(false);
    if (pressionadas[1])
        tela.objects.disco1.setAcelY(false);
    if (pressionadas[2])
        tela.objects.disco1.setAcelX(true);
    if (pressionadas[3])
        tela.objects.disco1.setAcelY(true);
}

function gameloop()
{
    context.clearRect(0,0,canvas.width,canvas.height);
    tela.move();
    tela.draw();
    //Disco 1__________________________________________
    //1ª Camada
    context.beginPath();
    context.fillStyle = "rgb(141, 32, 32)";
    acionarTeclas();
    disco1.mover();
    context.arc(disco1.getX(), disco1.getY(), disco1.getRaio(), 0, 2*Math.PI);
    context.fill();
    context.closePath();
    //2ª Camada
    context.beginPath()
    context.fillStyle = "#a51818";
    context.arc(disco1.getX(), disco1.getY(), disco1.getRaio()-10, 0, 2*Math.PI);
    context.fill();
    context.closePath();
    //3ª Camada
    context.beginPath()
    context.fillStyle = "#8d2020";
    context.arc(disco1.getX(), disco1.getY(), disco1.getRaio()/2, 0, 2*Math.PI);
    context.fill();
    context.closePath();
    //Frisbee_________________________________________
    //1ª Camada
    context.beginPath();
    context.fillStyle = "rgb(196, 108, 44)";
    frisbee.mover();
    context.arc(frisbee.getX(), frisbee.getY(), frisbee.getRaio(), 0, 2*Math.PI);
    context.fill();
    context.closePath();
    //2ªCamada
    context.beginPath();
    context.fillStyle = "#fa7c20";
    context.arc(frisbee.getX(), frisbee.getY(), frisbee.getRaio()-10, 0, 2*Math.PI);
    context.fill();
    context.closePath();
    //_________________________________________________
    if(disco1.colidiu(frisbee))
    {
        var aux;
        aux = frisbee.getVelX();   
        frisbee.setVelX(disco1.getVelX());
        disco1.setVelX(aux);        
        aux = frisbee.getVelY();
        frisbee.setVelY(disco1.getVelY());
        disco1.setVelY(aux);
       // alert(angleBetween(disco1, frisbee));
    }
    requestAnimationFrame(gameloop);
}

function angleBetween(obj1, obj2)
{
    var co = Math.abs(obj1.getY() - obj2.getY());
    var ca = Math.abs(obj1.getX() - obj2.getX());
    var result;
    result = Math.atan(co/ca);
    if (obj1.getY()>=obj2.getY() && obj2.getX()>=obj1.getX())
    {
        return radToDeg(Math.PI/2-result);
    }
    if (obj1.getY()<=obj2.getY() && obj2.getX()>=obj1.getX())
    {
        return radToDeg(Math.PI/2+result);
    }
    if (obj1.getY()<=obj2.getY() && obj2.getX()<=obj1.getX())
    {
        return radToDeg(3*Math.PI/2-result);
    }
    if (obj1.getY()>=obj2.getY() && obj2.getX()<=obj1.getX())
    {
        return radToDeg(3*Math.PI/2 + result);
    }
}

function radToDeg(x)
{
    return x*180/Math.PI;
}

const Circulo = function(raio, X, Y)
{
    const aceleracao = 0.3,
          coef_atrito = 0.01,
          coef_colisao = 0.6;
    var raio = raio;
    var X = X;
    var Y = Y;
    var VelX = 0;
    var VelY = 0;
    
    var counter;
    
    this.colidiu = function(outroCirculo) //public
    {
        if (Math.sqrt( Math.pow( Math.abs(X-outroCirculo.getX()), 2 ) + Math.pow( Math.abs(Y-outroCirculo.getY() ), 2))<=raio+outroCirculo.getRaio())
            return true;
        else
            return false;
    }
    
    this.mover = function()
    {
        if(X+VelX+raio>canvas.width)
        {
            X = canvas.width-raio;
            VelX*=-coef_colisao;
        }
        if(X+VelX-raio<0)
        {
            X = raio;
            VelX*=-coef_colisao;
        }
        if(Y+VelY+raio>canvas.height)
        {
            Y = canvas.height-raio;
            VelY*=-coef_colisao;
        }
        if(Y+VelY-raio<0)
        {
            Y = raio;
             VelY*=-coef_colisao;
        }
        X+=VelX;
        Y+=VelY;
        VelX*=(1-coef_atrito);
        VelY*=(1-coef_atrito);
    }
    
    this.setAngularSpeed = function(velocidade, angulo)
    {
        
    }
    
    this.setAcelX = function(forward)
    {
        if(forward)
            VelX+=aceleracao;
        else
            VelX-=aceleracao;
    }
    this.setAcelY = function(forward)
    {
        if(forward)
            VelY+=aceleracao;
        else
            VelY-=aceleracao;
    }
    this.getRaio = function()
    {
        return raio;
    }
    this.getX = function()
    {
        return X;
    }
    this.getY = function()
    {
        return Y;
    }
    this.getVelX = function()
    {
        return VelX;
    }
    this.getVelY = function()
    {
        return VelY;
    }
    this.getVel = function()
    {
        return Math.sqrt(Math.pow(VelX, 2), Math.pow(VelY, 2));
    }
    this.setVelX = function(newVelX)
    {
        VelX = newVelX;
    }
    this.setVelY = function(newVelY)
    {
        VelY = newVelY;
    }
}
