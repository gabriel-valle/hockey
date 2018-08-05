function gameloop()
{
    console.log(ACEL);
    io.emit("game_positions", getPositions());
    tela.move();
    pontuar();
    podeAcelerar['player1'] = true;
    podeAcelerar['player2'] = true;
    if(jogando)
        setTimeout(gameloop, 14);*/
}
gameloop();