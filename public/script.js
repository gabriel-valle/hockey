var socket, player_index;
function run()
{
    socket = new io();
    socket.on("start_game", function(e){
        player_index = e;
        load();
    });
    socket.on("server_error", function(e){ alert(e); });
    
    socket.on("game_positions", function(data){
        tela.objects.disco1.position = new Point(data['player1'].X, data['player1'].Y);
        tela.objects.disco2.position = new Point(data['player2'].X, data['player2'].Y);
        tela.objects.frisbee.position = new Point(data['disco'].X, data['disco'].Y);
    })
    
    socket.on("placar_jogo", function(data){
        var txt = new Texto(data['player1_score'] + " x " + data['player2_score'], canvas.width/2, 40);
        txt.setTextAlign("center");
        txt.setFont("Arial");
        txt.setSize("32pt");
        setTimeout(function(){txt.startFadeOut(0.05, 80)}, 500);
        tela.addText(txt, "placar");
    })
    //var pos=2;
    /*var dots = setTimeout(function(){
        context.clearRect(0, 0, canvas.width, canvas.height);
        tela.draw()
        pos = (pos+1)%3;
        str = "";
        for(let counter = 0; counter<pos; counter++);
            str += " ";
        str+=".";
        var txt = new Texto(str, canvas.width/2, canvas.height/2);
        txt.setFont("50pt");
        txt.setTextAlign = "center";
        txt.startFadeOut(0.1, 100);
        tela.addText(txt);
    });*/
}