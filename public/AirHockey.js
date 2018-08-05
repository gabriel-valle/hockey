var disco1, frisbee, tela, disco2, p;
var last5Fps = new Array();
var fps_label, lastCalledTime, fps;
var pressionadas = [false, false, false, false];
function novoJogo()
{
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    tela = new World(context, canvas);
    run();
}
function load()
{
    var obj = new Circle(canvas.width/4, canvas.height/2, 50);
    obj.color.setColor(141, 32, 32);
    tela.addObject(obj, "disco1");
    obj = new Circle(canvas.width/2, canvas.height/2, 30);
    obj.color.setColor(196, 108, 44);
    tela.addObject(obj, "frisbee");
    obj = new Circle(3*canvas.width/4, canvas.height/2, 50);
    obj.color.setColor(32, 49, 141);
    tela.addObject(obj, "disco2");
    p = new Placar();
    fps_label = new Texto("fps: 0", 20, 20);
    tela.addText(fps_label);
    fps_label.setSize("16pt");
    
    tela.objects.disco1.addEventListener("draw",
        function(e)
        {
            var sndLayer = new Circle(tela.objects.disco1.position.X, tela.objects.disco1.position.Y, tela.objects.disco1.raio-10)
            sndLayer.color.setColor(165, 24, 24);
            sndLayer.draw(context, true);
            sndLayer.raio = sndLayer.raio/2+5;
            sndLayer.color.setColor(141, 32, 32);
            sndLayer.draw(context, true);
    })
    tela.objects.frisbee.addEventListener("draw",
        function(e)
        {
            var sndLayer = new Circle(tela.objects.frisbee.position.X, tela.objects.frisbee.position.Y, tela.objects.frisbee.raio-10)
            sndLayer.color.setColor(250, 124, 32);
            sndLayer.draw(context, true);
    })
    tela.objects.disco2.addEventListener("draw",
        function(e)
        {
            var sndLayer = new Circle(tela.objects.disco2.position.X, tela.objects.disco2.position.Y, tela.objects.disco2.raio-10)
            sndLayer.color.setColor(24, 40, 165);
            sndLayer.draw(context, true);
            sndLayer.raio = sndLayer.raio/2+5;
            sndLayer.color.setColor(32, 49, 141);
            sndLayer.draw(context, true);
    })
    inicializar();
}
function inicializar()
{
    context.fill();
    context.clearRect(0, 0, canvas.width, canvas.height);
    update_fps();
    gameloop();
}

function acionarTeclas()
{
    var direction = new Point(0,0);
    if (tela.teclas[37])
        direction.X--;
    if (tela.teclas[38])
        direction.Y--;
    if (tela.teclas[39])
        direction.X++;
    if (tela.teclas[40])
        direction.Y++;
    if(direction.distanceFrom(new Point(0,0)) != 0)
        socket.emit('keydown', (new Line(new Point(0,0), direction)).getInclinacao());
}

function gameloop()
{
    context.clearRect(0,0,canvas.width,canvas.height);
    tela.draw();
    tela.writeTexts();
    acionarTeclas();
    update_fps();
    requestAnimationFrame(gameloop);
}

function update_fps() {
    if(!lastCalledTime) {
        lastCalledTime = Date.now();
        fps = 0;
        return;
    }
    delta = (Date.now() - lastCalledTime)/1000;
    lastCalledTime = Date.now();
    fps = 1/delta;
    last5Fps.unshift(fps);
    if(last5Fps.length>=60)
        last5Fps.pop();
    sum = 0;
    for(let counter = 0; counter<last5Fps.length; counter++)
        sum+=last5Fps[counter]
    fps_label.setText("fps: " + Math.floor(sum/last5Fps.length));
} 

var Placar = function()
{
    var pontos1 = 0;
    var pontos2 = 0;
    this.pontuar1 = function()
    {
        pontos1++;
        this.showText();
    }  
    this.pontuar2 = function()
    {
        pontos2++;
        this.showText();
    }
    this.showText = function()
    {
        var txt = new Texto(pontos1 + " x " + pontos2, canvas.width/2, 40);
        txt.setTextAlign("center");
        txt.setFont("Arial");
        txt.setSize("32pt");
        setTimeout(function(){txt.startFadeOut(0.05, 80)}, 500);
        tela.addText(txt, "placar");
    }
}