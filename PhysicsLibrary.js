var World = function (ctx, canvas)
{
    this.canvas = canvas;
    var context = ctx;
    var gravity = 0;
    var start = false;
    var loading = false;
    this.mouse = new Point(0,0);
    this.sounds = new Array;
    this.images = new Array;
    this.objects = new Array;
    this.texts = new Array;
    this.teclas = new Array(225);
    this.events = new Array;
    
    for(counter = 0; counter<225; counter++)
        this.teclas[counter] = false;
    
    if(typeof(canvas) != 'undefined')
    {
        // Keys scanner
        var teclas = this.teclas;
        document.addEventListener("keydown",
            function(e)
            {
                teclas[e.keyCode] = true;
            }, false);
        document.addEventListener("keyup",
            function(e)
            {
                teclas[e.keyCode] = false;
            }, false);


        // Mouse scanner
        var mouse = this.mouse;
        mouse.isClicked = false;
        canvas.addEventListener("mousemove",
                                function(event){
                var x = new Number();
                var y = new Number();
                var canvas = document.getElementById("canvas");

                if (event.x != undefined && event.y != undefined)
                {
                    x = event.x;
                    y = event.y;
                }
                else // Firefox method to get the position
                {
                  x = event.clientX + document.body.scrollLeft +
                      document.documentElement.scrollLeft;
                  y = event.clientY + document.body.scrollTop +
                      document.documentElement.scrollTop;
                }

            x -= canvas.offsetLeft;
            y -= canvas.offsetTop;
            mouse.setPosition(x, y);
        }, false);

        var world = this;

        canvas.addEventListener("mousedown", function(event){
            console.log("mousedown...");
            mouse.isClicked = true;
            world.dispatchEvent("mousedown");
        })

        canvas.addEventListener("mouseup", function(event){
            mouse.isClicked = false;
            world.dispatchEvent("mouseup"); 
        })
    }
    else
        console.log("WARNING: canvas is not defined");
    
    
    this.getObjectIndex = function(obj)
    {
        for(counter=0; counter<this.objects.length; counter++)
            if(this.objects[counter] === obj)
                return counter;
        return 'undefined';
    }
    
    this.writeTexts = function()
    {
        for(counter = 0; counter<this.texts.length; counter++)
            this.texts[counter].write(context);
    }
    
    this.removeText = function(index)
    {
        if(index>=this.texts.length)
            return 0;
        var counter;
        for(counter=index; counter<this.texts.length-1; counter++)
            this.texts[counter] = this.texts[counter+1];
        this.texts.pop();
        return 1;
    }
    
    this.addText = function(texto)
    {
        this.texts.push(texto);
    }
    
    this.stopAudio = function(index)
    {
        this.sounds[index].pause();
        this.sounds[index].removeEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);
        this.sounds[index].currentTime = 0;
    }
    
    this.loopPlayAudio = function(index)
    {
        this.sounds[index].play();
        this.sounds[index].addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);
    }
    
    this.setVolume = function(index, volume)
    {
        if(index>=this.sounds.length)
            return 0;
        this.sounds[index].volume = volume;
    }
    
    this.removeAudio = function(index)
    {
        if(index>=this.sounds.length)
            return 0;
        var counter;
        for(counter=index; counter<this.sounds.length-1; counter++)
            this.sounds[counter] = this.sounds[counter+1];
        this.sounds.pop();
        return 1;
    }
    
    this.playAudio = function(index)
    {
        var audio;
        audio = new Audio(this.sounds[index].src);
        audio.play();
    }
    
    this.addAudio = function(source, name)
    {
        var audio = new Audio(source);
        this.sounds.push(audio);
        if(typeof(name)=="string")
            this.sounds[name] = this.sounds[this.sounds.length-1];
    }
    this.isLoading = function()
    {
        var counter;
        for(counter = 0; counter<this.images.length; counter++)
            if(this.images[counter]["loaded"] == false)
                return true;
        return false;
    }
    this.addImage = function(source, name)
    {
        var imagem = new Image();
        imagem["loaded"] = false;
        tela.images.push(imagem);
        //var index = this.images.length;
        imagem.src = source;
        loading = true;
        if(typeof(name)=='string')
            this.images[name] = this.images[this.images.length-1];
        imagem.onload = function()
        {
            imagem["loaded"] = true;
            return 1;
        }
    }
    this.removeImage = function(index)
    {
        if(index>=this.images.length)
            return 0;
        var counter;
        for(counter=index; counter<this.images.length-1; counter++)
            this.images[counter] = this.images[counter+1];
        this.images.pop();
        return 1;
    }
    this.clearAll = function()
    {
        gravity = 0;
        start = false;
        images = null;
        this.objects = null;
    }
    this.checkColisions = function()
    {
        var counter, scounter;
        for(counter = 0; counter<this.objects.length-1; counter++)
        {
            for(scounter = counter+1; scounter<this.objects.length; scounter++)
            {
                if(this.objects[counter].getLayer() == this.objects[scounter].getLayer())
                {
                    var col = this.objects[counter].colidiu(tela.objects[scounter]);
                    if(col)
                    {
                        tela.objects[counter].position.X -= tela.objects[counter].vel.X;
                        tela.objects[counter].position.Y -= tela.objects[counter].vel.Y;
                        tela.objects[scounter].position.X -= tela.objects[scounter].vel.X;
                        tela.objects[scounter].position.Y -= tela.objects[scounter].vel.Y;
                        var alpha = new Line(new Point(0,0), tela.objects[counter].vel).getInclinacao() - new Line(tela.objects[counter].position, col).getInclinacao();
                        var vel1 = Math.cos(toRadians(alpha))*tela.objects[counter].getVel();
                        tela.objects[counter].setAcelByAngle(vel1, (tela.objects[counter].getInclinacao(col)+90)%360);
                        alpha = new Line(new Point(0,0), tela.objects[scounter].vel).getInclinacao() - new Line(tela.objects[scounter].position, col).getInclinacao();
                        var vel2 = Math.cos(toRadians(alpha))*tela.objects[scounter].getVel();
                        tela.objects[scounter].setAcelByAngle(vel2, (tela.objects[scounter].getInclinacao(col)+90)%360);
                        var mass1 = tela.objects[counter].getMass();
                        var mass2 = tela.objects[scounter].getMass();
                        var vel1f, vel2f;
                        if(!tela.objects[counter].fixed && !tela.objects[counter].fixed)
                        {
                            vel1f = vel1*(mass1 - mass2)/(mass1 + mass2) + vel2*(2*mass2/(mass1 + mass2));
                            vel2f = vel2*(mass2 - mass1)/(mass2 + mass1) + vel1*(2*mass1/(mass2 + mass1));
                        }
                        else
                        {
                            vel1f *= tela.objects[counter].coefElasticidade * tela.objects[scounter].coefElasticidade;
                            vel2f *= tela.objects[counter].coefElasticidade * tela.objects[scounter].coefElasticidade;
                        }
                        tela.objects[counter].setAcelByAngle(vel1f, (tela.objects[counter].getInclinacao(col)+90)%360);
                        tela.objects[scounter].setAcelByAngle(vel2f, (tela.objects[scounter].getInclinacao(col)+90)%360);
                    }
                }
            }
        }
    }
    this.changeObjects = function(index1, index2)
    {
        if(index1<0||index1>=this.objects.length||index2<0||index2>=this.objects.length)
            console.error("Entrada Inválida");
        var aux = null;
        aux = this.objects[index1];
        this.objects[index1] = this.objects[index2];
        this.objects[index2] = aux;
    }
    this.getObject = function(index)
    {
        return this.objects[index];
    }
    this.getGravity = function()
    {
        return gravity;
    }
    this.setGravity = function(newGravity)
    {
        gravity = newGravity;
    }
    this.addObject = function(object, name)
    {
        this.objects.push(object);
        object.name = name;
        if(typeof(name)=='string')
            this.objects[name] = this.objects[this.objects.length-1];
    }
    this.move = function(deltaTime)
    {
        if(typeof(deltaTime)=='undefined')
            deltaTime = 1;
        var counter;
        for(counter=0; counter<this.objects.length; counter++)
        {
            //this.objects[counter].forces.Y+=tela.objects[0].getMass()*gravity;
            this.objects[counter].move(deltaTime);
        }
        this.dispatchEvent('move');
    }
    this.draw = function()
    {
        var counter;
        for(counter=0; counter<this.objects.length; counter++)
        {
            this.objects[counter].draw(context);
            var drawEvent = new CustomEvent("draw",
            {
                'detail': counter
            });
            document.dispatchEvent(drawEvent);
        }
        this.dispatchEvent('draw');
    }
    this.drawByLayer = function(primeira, ultima)
    {
        if(ultima>primeira)
            return 0;
        var counter,scounter;
        for(counter=primeira; counter<=ultima; counter++)
            for(scounter=0; scounter<this.objects.length; scounter++)
                if(tela.objects[scounter].getLayer()==counter)
                {
                    this.objects[scounter].draw(context);
                    var drawEvent = new CustomEvent("draw",
                    {
                        'detail': scounter
                    });
                    document.dispatchEvent(drawEvent);
                }
    }
    this.removeObject = function(obj, byIndex)
    {
        if(byIndex == undefined)
            byIndex = true;
        if(byIndex)
        {
            if(obj>=this.objects.length)
                return 0;
            var counter;
            for(counter=obj; counter<this.objects.length-1; counter++)
                this.objects[counter] = this.objects[counter+1];
            this.objects.pop();
            return 1;
        }
        else
        {
            for(counter=0; counter<tela.objects.length; counter++)
                if(tela.objects[counter] === obj)
                    this.removeObject(counter);
        }
    }
    this.limpar = function()
    {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    this.setStartFrames = function(comecar)
    {
        start = comecar;
        if (start)
            this.newFrame();
    }
    this.newFrame = function()
    {
        //this.limpar();
        //this.setGravity(3);
        //this.draw();
        //this.move();
        //requestAnimationFrame(this.newFrame);
    }
    this.addEventListener = function(event,fn)
    {
        this.events[event] = fn;
    }
    
    this.removeEventListener = function(event)
    {
        this.events[event] = null;
    }
    
    this.dispatchEvent = function(event, data)
    {
        if(this.events[event] != undefined)
            this.events[event].call();
    }
}
var Matter = function(newX, newY, massa)   //Objeto genérico
{
    this.position = new Point(newX, newY);
    this.fixed = false;
    this.vel = new Point(0,0);
    var absAngle = 0;
    var angleSpeed = 0;
    var mass = massa;
    if(typeof(mass)=='undefined')
        mass = 1;
    this.color = new Cor();
    var layer = 0;
    var imageIndex = -1;
    this.coefElasticidade = 0.8;
    this.coefAtrito = 0;
    this.forces = new Point(0,0);
    this.filter = false;
    this.events=[]; // Eventos simples
    
    this.addEventListener = function(event,fn)
    {
        this.events[event] = fn;
    }
    
    this.removeEventListener = function(event)
    {
        this.events[event] = null;
    }
    
    this.dispatchEvent = function(event, data)
    {
        if(this.events[event] != undefined)
            this.events[event].call();
    }
    
    this.setImageIndex = function(index)
    {
        imageIndex = index;
    }
    this.getImageIndex = function(index)
    {
        return imageIndex;
    }
    this.setLayer = function(newLayer)
    {
        layer = newLayer;
    }
    this.getLayer = function()
    {
        return layer;
    }
    
    this.setAbsAngle = function(newAngle)
    {
        absAngle=newAngle;
    }
    this.setAcelX = function(acelX)
    {
        if (!this.fixed)
            this.vel.X+=acelX;
    }
    
    this.setAcelY = function(acelY)
    {
        if(!this.fixed)
            this.vel.Y+=acelY;
    }
    
    this.getVelAbsoluta = function()
    {
        return Math.sqrt(Math.pow(this.vel.X,2)+Math.pow(this.vel.Y,2));
    }
    
    this.getVelAngle = function()
    {
        var vector = new Line(new Point(0,0), new Point(this.vel.X, this.vel.Y));
        return vector.getInclinacao();
    }
    
    this.setVelByAngle = function(newVel, degrees)//Modifica a velocidade linear do objeto a partir do angulo passado por parametro
    {
        if (!this.fixed)
        {
            degrees = degrees % 360;
            degrees *= 2*Math.PI/360;
            this.vel.X = Math.sin(degrees)*newVel;
            this.vel.Y = -Math.cos(degrees)*newVel;
        }
    }
    
    this.setAcelByAngle = function(newAcel, degrees)
    {
        if (!this.fixed)
        {
            degrees = degrees % 360;
            degrees *= 2*Math.PI/360;
            this.vel.X += Math.sin(degrees)*newAcel;
            this.vel.Y += -Math.cos(degrees)*newAcel;
        }
    }
    /*this.setImpulsoAngular(impulso, degrees)
    {
        degrees = degrees % 360;
        degrees *= 2*Math.PI/360;
        var iX = Math.sin(degrees)*impulso;
        var iY = -Math.cos(degrees)*impulso;
        this.vel.X += iX/this.getMass();
        this.vel.Y += iY/this.getMass();  
    }*/
    this.setAngleSpeed = function(newRotation)
    {
        angleSpeed = newRotation;
    }
    
    this.setAngleAcel = function(newRotation)
    {
        angleSpeed+=newRotation;
    }
    
    this.setMass = function(newMass)
    {
        mass = newMass;
    }
    
    this.getMass = function()
    {
        return mass;
    }
    
    this.getVel = function()
    {
        return Math.sqrt(Math.pow(this.vel.X, 2)+Math.pow(this.vel.Y, 2));
    }
    
    this.getAngleSpeed = function()
    {
        return angleSpeed;
    }
    
    this.getAbsAngle = function()
    {
        return absAngle;
    }
    
    this.move = function(deltaTime)
    {
        //var prev = JSON.parse(JSON.stringify(this));    //Clona o objeto antes de se mover
        if(typeof(deltaTime)=='undefined')
            deltaTime = 1;
        var acel = this.getMass()*this.coefAtrito;
        if(acel>this.getVelAbsoluta())
            this.vel.setPosition(0,0);
        else
            this.setAcelByAngle(acel, (this.getVelAngle()+180)%360);
        absAngle += angleSpeed*deltaTime;
        absAngle %= 360;
        if(!this.fixed)
        {
            //this.setAcelX(this.forces.X*deltaTime);
            this.position.X+=this.vel.X*deltaTime;
            //this.setAcelY(this.forces.Y*deltaTime);
            this.position.Y+=this.vel.Y*deltaTime;
        }
        this.forces.setPosition(0,0);
        //this.vel.X*=1-this.coefAtrito;
        //this.vel.Y*=1-this.coefAtrito;
        //var arr = new Array();
        //arr['previous'] = prev;
        this.dispatchEvent('move');
        /*var fat = this.getMass()*this.coefAtrito;
        var impulso = fat*deltaTime;
        var sum = Math.pow(this.vel.X, 2)+Math.pow(this.vel.Y, 2);
        var vel = Math.sqrt(sum);
        vel -= impulso/mass;
        if(vel<0)
        {
            this.vel.X = 0;
            this.vel.Y = 0;
        }
        else
        {
            var ang = toDegrees(Math.atan(this.vel.Y/this.vel.X));
            this.setVelAngular(vel, ang);
        }*/
    }
}
var Circle = function(newX, newY, radious)
{
    herdar(Matter, this, arguments, 2);
    this.raio = radious;
    this.draw = function(context, preencher)
    {
        if(typeof(preencher)=="undefined")
            preencher = true;
        if(((typeof(this.getImageIndex()) == "string")||(this.getImageIndex() >= 0)) && tela.images[this.getImageIndex()]["loaded"] == true)
        {
            var rect = new Retangulo(this.position.X-this.raio, this.position.Y-this.raio, 2*this.raio, 2*this.raio);
            rect.setImageIndex(this.getImageIndex());
            rect.setAbsAngle(this.getAbsAngle());
            rect.draw(context, preencher);
            return;
        }
        context.beginPath();
        context.fillStyle = this.color.getColor();
        context.arc(this.position.X, this.position.Y, this.raio, 0, 2*Math.PI);
        if(preencher)
            context.fill();
        else
            context.stroke();
        context.closePath();
        this.dispatchEvent('draw');
    }
    
    this.getInclinacao = function(p)
    {
        return (new Line(this.position, p).getInclinacao()+90) % 360;
    }
    
    this.colidiu = function(outro)
    {
        if(outro instanceof Circle)
        {
            var dist = new Point(this.position.X, this.position.Y).distanceFrom(new Point(outro.position.X, outro.position.Y));
            if(dist < this.raio + outro.raio)
                return new Point(this.position.X/2+outro.position.X/2, this.position.Y/2+outro.position.Y/2);
        }
        return false;
    }
    this.getPoint = function(degrees)
    {
        var deltaX = Math.sin(toRadians(degrees))*this.raio;
        var deltaY = -Math.cos(toRadians(degrees))*this.raio;
        var delta = new Point(deltaX, deltaY);
        delta.sumWith(this.position);
        return delta;
    }
    this.contains = function(ponto)
    {
        if(ponto instanceof Point)
        {
            return (this.position.distanceFrom(ponto)<=this.raio);
 
        }
        console.error("Objeto inválido!");
    }
}
var Retangulo = function(newX, newY, largura, altura)
{
    herdar(Matter, this, arguments, 2);
    this.height = altura;
    this.width = largura;

    this.getColisionSide = function(index)
    {
        var space = new Array;
        if(this.vel.X>0)
            space.push(1);
        else
            space.push(3);
        if(this.vel.Y>0)
            space.push(2);
        else
            space.push(0);
    }
    this.checkColision = function(obj)
    {
        //if(obj instanceof Matter)
        //{
            if(this.getLayer()!=obj.getLayer())
                return false;
            if(obj instanceof Retangulo)
            {
                colisaoX = false;
                colisaoY = false;
                if (false)
                {
                //X________________________________
                if(this.position.X<=obj.position.X)
                {
                    if(obj.position.X-this.position.X<this.width)
                        colisaoX=true;
                }
                else
                {
                    if(this.position.X-obj.position.X<obj.getWidth())
                        colisaoX=true;
                }
                //Y________________________________
                if(this.position.Y<=obj.position.Y)
                {
                    if(obj.position.Y-this.position.Y<this.height)
                        colisaoY=true;
                }
                else
                {
                    if(this.position.Y-obj.position.Y<obj.getHeight())
                    {
                        colisaoY=true;
                    }
                }
                return colisaoX && colisaoY;
                }
                else
                {
                    var counter;
                    var colidiu = false;
                    for (counter = 0; counter<=3; counter++)
                        colidiu = colidiu || this.contains(obj.getPoint(counter)) || obj.contains(this.getPoint(counter));
                    return colidiu;
                }
        }
    }
    this.getPoint = function(index)
    {
        var p;
        if (index<=3 && index>=0)
        {
            switch(index)
            {
                case 0:
                    p = new Point(this.position.X, this.position.Y);
                    break;
                case 1:
                    p = new Point(this.position.X+this.width, this.position.Y);
                    break;
                case 2:
                    p = new Point(this.position.X+this.width, this.position.Y+this.height);
                    break;
                case 3:
                    p = new Point(this.position.X, this.position.Y+this.height);
                    break;
            }
                
            if(this.getAbsAngle()==0)
                return p;
            var centro = this.getCenter();
            var raio = new Line(centro, p);
            var dist = centro.distanceFrom(p);
            var inscrito = new Circle(centro.X, centro.Y, dist);
            var alpha = raio.getInclinacao();
            alpha += this.getAbsAngle();
            alpha %= 360;
            return inscrito.getPoint(alpha);
        }
        else
            console.error('Índice inválido');
    }
    this.getArea = function()
    {
        return this.height*this.width;
    }
    this.draw = function(context, preencher)
    {
        if(typeof(preencher)=="undefined")
            preencher = true;
        context.beginPath();
        if(((typeof(this.getImageIndex()) == "string")||(this.getImageIndex() >= 0)) && tela.images[this.getImageIndex()]["loaded"] == true)
        {
            if(this.filter)
            {
                context.fillStyle = this.color.getColor();
                context.moveTo(this.getPoint(0).X, this.getPoint(0).Y); 
                context.lineTo(this.getPoint(1).X, this.getPoint(1).Y);
                context.lineTo(this.getPoint(2).X, this.getPoint(2).Y);
                context.lineTo(this.getPoint(3).X, this.getPoint(3).Y);
                context.lineTo(this.getPoint(0).X, this.getPoint(0).Y);
                context.fill();
            }
            var centro = this.getCenter();
            context.translate(centro.X, centro.Y);
            context.rotate(toRadians(this.getAbsAngle()));
            context.translate(-(centro.X), -(centro.Y));
            context.globalAlpha = this.color.alpha;
            context.drawImage(tela.images[this.getImageIndex()], this.position.X, this.position.Y, this.width, this.height);
            context.globalAlpha = 1;
            context.translate(centro.X, centro.Y);
            context.rotate(-toRadians(this.getAbsAngle()));
            context.translate(-(centro.X), -(centro.Y));
        }
        else
        {
            if(this.getAbsAngle() != 0)
                var a = 0;
                
            context.fillStyle = this.color.getColor();
            context.moveTo(this.getPoint(0).X, this.getPoint(0).Y); 
            context.lineTo(this.getPoint(1).X, this.getPoint(1).Y);
            context.lineTo(this.getPoint(2).X, this.getPoint(2).Y);
            context.lineTo(this.getPoint(3).X, this.getPoint(3).Y);
            context.lineTo(this.getPoint(0).X, this.getPoint(0).Y);
            if (preencher)
            {
                //context.fillRect(this.position.X, this.position.Y, width, height);
                context.fill();
            }
            else
            {
                //context.strokeRect(this.position.X, this.position.Y, width, height);
                context.stroke();
            }
        }
        context.closePath();
        this.dispatchEvent('draw');
    }
    this.contains = function(point)
    {
        /*if(point instanceof Point)
        {
            if(point.X >= this.position.X && point.X<=this.position.X+this.width && point.Y>= this.position.Y && point.Y<=this.position.Y+this.height)
                return true;
            return false;
        }
        if(point instanceof Array && point.length==2)
        {
            if(point[0] >= this.position.X && point[0]<=this.position.X+this.width && point[1]>= this.position.Y && point[1]<=this.position.Y+this.height)
                return true;
            return false;
        }
        console.error("Parâmetro inválido");*/  // So funciona se a inclinacao for 0
        var lados = new Array();
        for(counter = 0; counter < 4; counter++)
            lados.push(new Line(this.getPoint(counter), this.getPoint((counter+1)%4)));
        for(counter = 0; counter < 4; counter++)
            if(lados[counter].getSemiplano(point) == -1)
                return false;
        return true;
    }
    this.getCenter = function()
    {
        return new Point(this.position.X+this.width/2, this.position.Y+this.height/2);
    }
}
var Line = function(start, end)
{
    this.startPoint = start;
    this.endPoint = end;
    
    this.getSemiplano = function(ponto)  //Retorna -1 se o ponto estiver à 'esquerda' ou 1 se estiver à direita
    {
        var plano;
        if(isNaN(this.getCoefAngular()))
        {
           plano = 1;
           if(this.endPoint.X<ponto.X)
                plano = -1;
            if(this.startPoint.Y>this.endPoint.Y)
                plano *= -1;
            return plano;
        }
        var y = this.getCoefAngular()*ponto.X+this.getTermoIndependente();
        plano = 1;
        if(ponto.Y > y)
            plano = -1;
        if(y == ponto.Y)
            return 0;
        if(this.endPoint.X>this.startPoint.X)
            plano *= -1;
        return plano;
    }
    this.lenght = function()
    {
        return this.startPoint.distanceFrom(this.endPoint);
    }
    this.getCoefAngular = function()
    {
        var deltaY = this.endPoint.Y - this.startPoint.Y;
        var deltaX = this.endPoint.X - this.startPoint.X;
        if(deltaX==0)
            return NaN;
        return deltaY/deltaX;
    }
    this.getTermoIndependente = function()
    {
        return this.startPoint.Y-this.getCoefAngular()*this.startPoint.X;
    }
    this.ehPerpendicular = function()
    {
        return this.startPoint.X == this.endPoint.X;
    }
    this.getInclinacao = function()
    {
        if(this.ehPerpendicular())
        {
            if(this.startPoint.Y > this.endPoint.Y)
                return 0;
            else
                return 180;
        }
        var rtrn = (toDegrees(Math.atan(this.getCoefAngular()))+90)%360;
        if(this.endPoint.X<this.startPoint.X)
            rtrn+=180;
        return rtrn%360;
    }
    this.isIntercepted = function(outra)
    {
        if(!outra instanceof Line)
            return false;
        var ptX, ptY;
        ptX = (outra.getTermoIndependente()-this.getTermoIndependente())/(this.getCoefAngular()-outra.getCoefAngular());
        if(isNaN(ptX))
        {
            if(this.ehPerpendicular() && outra.ehPerpendicular())
            {
                if(this.startPoint.X == outra.startPoint.X)
                {
                    var inter =  new Interval(this.startPoint.Y, this.endPoint.Y).intersection(new Interval(outra.startPoint.Y, outra.endPoint.Y));
                    if(inter instanceof Array)
                        return false;
                    return true;
                }
            }
            if(this.getCoefAngular()==outra.getCoefAngular() && this.getTermoIndependente()==outra.getTermoIndependente())
            {
                var X = new Interval(this.startPoint.X, this.endPoint.X).intersection(new Interval(outra.startPoint.X, outra.endPoint.X));
                var Y = new Interval(this.startPoint.Y, this.endPoint.Y).intersection(new Interval(outra.startPoint.Y, outra.endPoint.Y));
                return new Line(new Point(X.inicio, Y.inicio), new Point(X.fim, Y.fim));
            }
            if(this.ehPerpendicular())
            {
                var X = this.startPoint.X;
                var Y = outra.getCoefAngular()*X+outra.getTermoIndependente();
                if(new Interval(this.startPoint.Y, outra.endPoint.Y).openContains(Y)
                  && new Interval(outra.startPoint.X, outra.endPoint.X).openContains(X)
                  && new Interval(outra.startPoint.Y, outra.endPoint.Y).openContains(Y))
                    return true;
                return false;
            }
            if(outra.ehPerpendicular())
            {
                var X = outra.startPoint.X;
                var Y = this.getCoefAngular()*X+this.getTermoIndependente();
                if(new Interval(outra.startPoint.Y, this.endPoint.Y).openContains(Y)
                  && new Interval(this.startPoint.X, this.endPoint.X).openContains(X)
                  && new Interval(this.startPoint.Y, this.endPoint.Y).openContains(Y))
                    return true;
                return false;
            }
            return false;
        }
        var ptY = this.getCoefAngular()*ptX+this.getTermoIndependente();
        if(new Interval(this.startPoint.X, this.endPoint.X).contains(ptX)
          && new Interval(this.startPoint.Y, this.endPoint.Y).contains(ptY)
          && new Interval(outra.startPoint.X, outra.endPoint.X).contains(ptX)
          && new Interval(outra.startPoint.Y, outra.endPoint.Y).contains(ptY))
            return true;
        return false;
    }
    this.getIntersection = function(outra)
    {
        if(!outra instanceof Line)
            return 0;
        var ptX, ptY;
        ptX = (outra.getTermoIndependente()-this.getTermoIndependente())/(this.getCoefAngular()-outra.getCoefAngular());
        if(isNaN(ptX))
        {
            if(this.ehPerpendicular() && outra.ehPerpendicular())
            {
                if(this.startPoint.X == outra.startPoint.X)
                {
                    var inter =  new Interval(this.startPoint.Y, this.endPoint.Y).intersection(new Interval(outra.startPoint.Y, outra.endPoint.Y));
                    if(inter instanceof Array)
                        return undefined;
                    return new Line(new Point(this.startPoint.X, inter.inicio), new Point(this.startPoint.X, inter.fim));
                }
            }
            if(this.getCoefAngular()==outra.getCoefAngular() && this.getTermoIndependente()==outra.getTermoIndependente())
            {
                var X = new Interval(this.startPoint.X, this.endPoint.X).intersection(new Interval(outra.startPoint.X, outra.endPoint.X));
                var Y = new Interval(this.startPoint.Y, this.endPoint.Y).intersection(new Interval(outra.startPoint.Y, outra.endPoint.Y));
                return new Line(new Point(X.inicio, Y.inicio), new Point(X.fim, Y.fim));
            }
            if(this.ehPerpendicular())
            {
                var X = this.startPoint.X;
                var Y = outra.getCoefAngular()*X+outra.getTermoIndependente();
                if(new Interval(this.startPoint.Y, outra.endPoint.Y).openContains(Y)
                  && new Interval(outra.startPoint.X, outra.endPoint.X).openContains(X)
                  && new Interval(outra.startPoint.Y, outra.endPoint.Y).openContains(Y))
                    return new Point (X, Y);
                return undefined;
            }
            if(outra.ehPerpendicular())
            {
                var X = outra.startPoint.X;
                var Y = this.getCoefAngular()*X+this.getTermoIndependente();
                if(new Interval(outra.startPoint.Y, this.endPoint.Y).openContains(Y)
                  && new Interval(this.startPoint.X, this.endPoint.X).openContains(X)
                  && new Interval(this.startPoint.Y, this.endPoint.Y).openContains(Y))
                    return new Point (X, Y);
                return undefined;
            }
            return undefined;
        }
        var ptY = this.getCoefAngular()*ptX+this.getTermoIndependente();
        if(new Interval(this.startPoint.X, this.endPoint.X).contains(ptX)
          && new Interval(this.startPoint.Y, this.endPoint.Y).contains(ptY)
          && new Interval(outra.startPoint.X, outra.endPoint.X).contains(ptX)
          && new Interval(outra.startPoint.Y, outra.endPoint.Y).contains(ptY))
            return new Point (ptX, ptY);
        return undefined;
    }
    this.draw = function(context)
    {
        context.beginPath();
        context.moveTo(this.startPoint.X, this.startPoint.Y);
        context.lineTo(this.endPoint.X, this.endPoint.Y);
        context.stroke();
        context.closePath();
    }
}
var Interval = function(start, end)
{
    this.inicio = start;
    this.fim = end;
    this.openContains = function(valor)
    {
        return (valor>=Math.min(this.inicio, this.fim)) && (valor<=Math.max(this.inicio, this.fim));
    }
    this.contains = function(valor)
    {
        return (valor>Math.min(this.inicio, this.fim)) && (valor<Math.max(this.inicio, this.fim));
    }
    this.unity = function(outro)
    {
        if(this.inicio<outro.inicio)
        {
            if(this.fim<outro.inicio)
                return [this, outro];
            if(this.fim>outro.fim)
                return this;
            return new Interval(this.inicio, outro.fim);
        }
        else
        {
            if(outro.fim<this.inicio)
                return [outro, this];
            if(outro.fim>this.fim)
                return outro;
            return new Interval(outro.inicio, this.fim);
        }
    }
    this.intersection = function(outro)
    {
        if(this.inicio<outro.inicio)
        {
            if(this.fim<outro.inicio)
                return null;
            if(this.fim>outro.fim)
                return outro;
            return new Interval(Math.min(outro.inicio, this.fim), Math.max(outro.inicio, this.fim));
        }
        else
        {
            if(outro.fim<this.inicio)
                return null;
            if(outro.fim>this.fim)
                return this;
            return new Interval(Math.min(this.fim, outro.inicio), Math.max(this.fim, outro.inicio));
        }
    }
}
var Point = function(newX, newY)
{
    this.X = newX;
    this.Y = newY;
    this.setPosition = function(setX, setY)
    {
        this.X = setX;
        this.Y = setY;
    }
    this.getPosition = function()
    {
        return [this.X, this.Y];
    }
    this.sumWith = function(other)
    {
        if(other instanceof Point)
        {
            this.X += other.X;
            this.Y += other.Y;
        }
    }
    this.distanceFrom = function(other)
    {
        if(other instanceof Point)
        {
            var dx = Math.abs(this.X - other.X);
            var dy = Math.abs(this.Y - other.Y);
            return Math.sqrt(Math.pow(dx, 2)+Math.pow(dy, 2));
        }
        if(other instanceof Line)
        {
            if (isNaN(other.getCoefAngular()))
                return Math.abs(this.X - other.startPoint.X);
            var numerador = Math.abs(other.getCoefAngular() * this.X - this.Y + other.getTermoIndependente());
            var denominador = Math.sqrt(Math.pow(other.getCoefAngular(), 2) + 1);
            return numerador / denominador;
        }
    }
    this.equals = function(outro)
    {
        if((outro == null)||!(outro instanceof Point))
            return false;
        if(this.X == outro.X && this.Y == outro.Y)
            return true;
        return false;
    }
}
function toDegrees(angle)
{
    return angle*180/Math.PI;
}
function toRadians(angle)
{
    return Math.PI*angle/180;
}

function herdar (pai, filho, args, nArgs)
{
    var newArgs = new Array;
    
    for (cont = 0; cont < nArgs; cont++)
        newArgs.push(args[cont]);
    
    if (args.length < 2)
        pai.call(filho, args);
    
    else if (args.length >= 2)
        pai.apply(filho, newArgs);
    
    var pai2 = new (pai);   
    filho.prototype = pai2;   
    filho.prototype.constructor = pai;
}

var Texto = function(newText, newX, newY)
{
    var texto = newText;
    var X = newX;
    var Y = newY;
    var size = "12pt";
    var style = "";
    this.color = new Cor();
    var font = "Arial";
    var align = "left";
    var maxWidth = -1;
    this.visible = true;
    
    this.setText = function(text)
    {
        texto = text;
    }
    this.getText = function()
    {
        return texto;
    }
    this.setX = function(newX)
    {
        X = newX;
    }
    this.getX = function()
    {
        return X;
    }
    this.setY = function(newY)
    {
        Y = newY;
    }
    this.getY = function()
    {
        return Y;
    }
    this.setSize = function(tamanho)
    {
        size = tamanho;
    }
    this.getSize = function()
    {
        return size;
    }
    this.setStyle = function(estilo)
    {
        style = estilo;
    }
    this.getStyle = function()
    {
        return style;
    }
    this.getColor = function()
    {
        return this.color.getColor();
    }
    this.setFont = function(fonte)
    {
        font = fonte;
    }
    this.getFont = function()
    {
        return font;
    }
    this.setTextAlign = function(alinhamento)
    {
        align = alinhamento;
    }
    this.getTextAlign = function()
    {
        return align;
    }
    this.setMaxWidth = function(maximo)
    {
        maxWidth = maximo;
    }
    this.getMaxWidth = function()
    {
        return maxWidth;
    }
    this.write = function(context)
    {
        if(this.visible)
        {
            context.beginPath();
            var fonte = "";
            if(style != "")
                fonte = style+" ";
            fonte += size+" "+font;
            context.font = fonte;
            context.fillStyle = this.color.getColor();
            context.textAlign = align;
            if(maxWidth>0)
                context.fillText(texto, X, Y, maxWidth);
            else
                context.fillText(texto, X, Y);
            context.closePath();
        }
    }
    this.startFadeOut = function(razao, intervalo)
    {
        var cor = this.color;
        var fadeOut = setInterval(
            function(){
                cor.alpha -= razao;
                if(cor.alpha<=0)
                {
                    clearInterval(fadeOut);
                }
            }, intervalo);
    }
}

var Cor = function()
{
    this.red = 0;
    this.green = 0;
    this.blue = 0;
    this.alpha = 1;
    
    this.setColor = function(r, g, b, opacity)
    {
        if(typeof(opacity) == "undefined")
            opacity = 1;
        this.red = r;
        this.green = g;
        this.blue = b;
        this.alpha = opacity;
    }
    
    this.getColor = function()
    {
        var color = "rgba("+this.red+","+this.green+","+this.blue+","+this.alpha+")";
        return color;
    }
    
    this.setRandomColor = function()
    {
        this.red = Math.floor(Math.random()*256);
        this.green = Math.floor(Math.random()*256);
        this.blue = Math.floor(Math.random()*256);
    }
}

module.exports = {
    world: World,
    matter: Matter,
    circle: Circle,
    retangulo: Retangulo,
    line: Line,
    point: Point,
    interval: Interval,
    toDegrees: toDegrees,
    toRadians: toRadians,
    herdar: herdar,
    cor: Cor,
    texto: Texto
};