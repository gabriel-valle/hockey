const ACEL = 0.3,
      COEF_ATRITO = 0.05,
      COEF_COLISAO = 0.8; // 0.8
var express = require('express'),
    app = express(),
    http = require('http'),
    socketIo = require('socket.io'),
    Worker = require('tiny-worker');

var jogando = false,
    podePontuar = false;

var podeAcelerar, canvas, sockets, conectados, discos, tela, traves, server, io;

var p;
function success(cmd)
{
    eval(cmd);  //Importa o script
    podeAcelerar = new Array();
    podeAcelerar['player1'] = true;
    podeAcelerar['player2'] = true;
    canvas = {"width": 1200, "height":600 };
    sockets = new Array();
    conectados = 0;

    discos = new Array();
    tela = new World();
    
    discos['player1'] = new Circle(canvas.width/4, canvas.height/2, 50);    //Jogador 1
    discos['player1'].coefAtrito = COEF_ATRITO;
    tela.addObject(discos['player1'], "player1");
    
    discos['player2'] = new Circle(3*canvas.width/4, canvas.height/2, 50);  //Jogador 2
    discos['player2'].coefAtrito = COEF_ATRITO;
    tela.addObject(discos['player2'], "player2");
    
    discos['disco'] = new Circle(canvas.width/2, canvas.height/2, 30);      //Disco
    discos['disco'].color.setColor(196, 108, 44);
    discos['disco'].coefAtrito = COEF_ATRITO;
    discos['disco'].mass = 0.2;
    tela.addObject(discos['disco'], "disco");
    
    traves = new Array(4);
    traves[0] = new Circle(0, canvas.height/2-canvas.width/8, 10);
    traves[1] = new Circle(0, canvas.height/2+canvas.width/8, 10);
    traves[2] = new Circle(canvas.width, canvas.height/2-canvas.width/8, 10);
    traves[3] = new Circle(canvas.width, canvas.height/2+canvas.width/8, 10);
    for(var counter = 0; counter<4; counter++)
    {
        traves[counter].fixed = true;
        tela.addObject(traves[counter], "trave"+counter);    //Adiciona as traves
    }
    
    tela.addEventListener("move", function(e){      //Permite colisões entre os discos e entre as paredes
        tela.checkColisions();
        ajustar(discos['player1']);
        ajustar(discos['player2']);
        ajustar(discos['disco']);
    })

    server =  http.createServer(app);   //Abre a porta 4000 e aguarda conexões
    io = socketIo.listen(server);
    server.listen(5555);
    app.use(express.static(__dirname + '/public'));
    console.log("Porta 5555 aberta, aguardando jogadores...");
    
    io.on('connection', function(socket){   //Evento disparado quando algum jogador se conecta à porta
        if(conectados>=2)                       //Bloqueia conexões quando já temos dois jogadores num mesmo servidor
        {
            var msg = "O servidor se encontra cheio, tente novamente mais tarde...";
            socket.emit('server_error', msg);
            console.log("um usuário tentou se contectar");
            return;
        }
        console.log("usuário conectado");
        conectados++;
        var index = conectados;
        sockets['jogador'+conectados] = socket;
        if(conectados == 2)
        {
            socket.emit('start_game', 2);           //Inicia o jogo quando ambos os jogadores estão conectados
            socket.broadcast.emit('start_game', 1);
            console.log('iniciando partida...');
            jogando = true;
            podePontuar = true;
            p = new Placar();
            gameloop();
        }
        socket.on("keydown", function(e){
            if(typeof(e) != "number" || !jogando || !podeAcelerar)
                return;
            discos['player'+index].setAcelByAngle(ACEL, e);
            podeAcelerar['player'+index] = false;
        })
        socket.on('disconnect', function(){     //Evento disparado quando algum jogador se desconecta
            console.log('usuário desconectado');
            io.emit('server_error', "O outro jogador se desconectou");
            resetGame();
        })
    })
}

    function gameloop()
    {
        io.emit("game_positions", getPositions());
        tela.move();
        pontuar();
        podeAcelerar['player1'] = true;
        podeAcelerar['player2'] = true;
        if(jogando)
            setTimeout(gameloop, 14);
    }
    
    function ajustar(obj)        //Impede que os discos saiam da tela
    {
        if(obj.position.X+obj.vel.X+obj.raio>canvas.width)
        {
            if(obj != tela.objects['disco'] || (obj.position.Y < canvas.height/2-canvas.width/8 || canvas.height/2+canvas.width/8 < obj.position.Y))
            {
                obj.position.X = canvas.width-obj.raio;
                obj.vel.X*=-COEF_COLISAO;
            }
        }
        if(obj.position.X+obj.vel.X-obj.raio<0)
        {
            if(obj != tela.objects['disco'] || (obj.position.Y < canvas.height/2-canvas.width/8 || canvas.height/2+canvas.width/8 < obj.position.Y))
            {
                obj.position.X = obj.raio;
                obj.vel.X*=-COEF_COLISAO;
            }
        }
        if(obj.position.Y+obj.vel.Y+obj.raio>canvas.height)
        {
            obj.position.Y = canvas.height-obj.raio;
            obj.vel.Y*=-COEF_COLISAO;
        }
        if(obj.position.Y+obj.vel.Y-obj.raio<0)
        {
            obj.position.Y = obj.raio;
            obj.vel.Y*=-COEF_COLISAO;
        }
    }

    function getPositions()
    {
        var positions = {
            "player1": {"X": discos['player1'].position.X, "Y": discos['player1'].position.Y},
            "player2": {"X": discos['player2'].position.X, "Y": discos['player2'].position.Y},
            "disco": {"X": discos['disco'].position.X, "Y": discos['disco'].position.Y}
        }
        return positions;
    }
    
    function resetGame()
    {
        sockets = new Array();
        conectados = 0;
        console.log("servidor reiniciado");
        discos['player1'].position = new Point(canvas.width/4, canvas.height/2);
        discos['player2'].position = new Point(3*canvas.width/4, canvas.height/2);
        discos['disco'].position = new Point(canvas.width/2, canvas.height/2);
        discos['player1'].vel = new Point(0,0);
        discos['player2'].vel = new Point(0,0);
        discos['disco'].vel = new Point(0,0);
        jogando = false;
    }
    function pontuar()
    {
        if(tela.objects['disco'].position.X <= -tela.objects['disco'].raio && podePontuar)
        {
            p.pontuar1();
            setTimeout(function(){
                tela.objects['disco'].position.X = canvas.width/2;
                tela.objects['disco'].position.Y = canvas.height/2;
                tela.objects['disco'].vel.setPosition(0,0);
                podePontuar = true;
                if(tela.objects['disco'].colidiu(tela.objects['player1']))
                {
                    tela.objects.player1.position = new Point(canvas.width/4, canvas.height/2, 50);
                    tela.objects.player1.vel = new Point(0,0);
                }
                if(tela.objects['disco'].colidiu(tela.objects['player2']))
                {
                    tela.objects.player2.position = new Point(3*canvas.width/4, canvas.height/2, 50);
                    tela.objects.player1.vel = new Point(0,0);
                }
            }, 100)
            podePontuar = false;
        }
        if(tela.objects['disco'].position.X >= canvas.width+tela.objects.disco.raio && podePontuar)
        {
            p.pontuar2();
            setTimeout(function(){
                tela.objects['disco'].position.X = canvas.width/2;
                tela.objects['disco'].position.Y = canvas.height/2;
                tela.objects['disco'].vel.setPosition(0,0);
                podePontuar = true;
                if(tela.objects['disco'].colidiu(tela.objects['player1']))
                {
                    tela.objects.player1.position = new Point(canvas.width/4, canvas.height/2, 50);
                    tela.objects.player1.vel = new Point(0,0);
                }
                if(tela.objects['disco'].colidiu(tela.objects['player2']))
                {
                    tela.objects.player2.position = new Point(3*canvas.width/4, canvas.height/2, 50);
                    tela.objects.player1.vel = new Point(0,0);
                }
            }, 100)
            podePontuar = false;
        }
    }
    
    var Placar = function()
    {
        var pontos1 = 0;
        var pontos2 = 0;

        this.pontuar1 = function()
        {
            pontos1++;
            this.sendScores();
        }

        this.pontuar2 = function()
        {
            pontos2++;
            this.sendScores();
        }

        this.sendScores = function()
        {
            console.log(pontos1 + " x " + pontos2);
            io.emit("placar_jogo", {"player1_score": pontos1, "player2_score": pontos2})
        }
    }

function getFileContent(source, fn)
{
    fs = require('fs');
    fs.readFile(source, 'utf8', function (err,data) {
        if (err)
            return console.log(err);
        fn(data);
    });
}

console.log(Worker);
console.log('importando script...');
getFileContent('./PhysicsLibrary.js', success);