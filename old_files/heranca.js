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