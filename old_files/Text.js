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
}