var BORDER_WIDTH = 943;
var BORDER_HEIGHT = 503;
var stg= new createjs.Stage("a");
//var background = new createjs.Shape();
var shp = new createjs.Shape();
var objs = new createjs.Container();
var gridShape = new createjs.Shape();
var turn = 0;
var gridSwitch=true;
var team = true;
var move = false;
var lineSwitch=true;
var clickTimes=0;
var Img =function (p,w,h) {this.p=p;this.w=w;this.h=h;}
var ColorCircle=function (color,sw,r,x,y) {this.color=color;this.sw=sw;this.r=r;this.x=x;this.y=y;}
var ColorCross=function (color,sw,l,x,y) { this.color=color;this.sw = sw;this.l=l;this.y=y;}
var footballBGImg = new Img("footballField.png",BORDER_WIDTH,BORDER_HEIGHT);
var circleArray= [new ColorCircle("white",3,20,0,0), new ColorCircle("red",5,20,0,0)];
var crossArray = [new ColorCross("white",3,20,0,0), new ColorCross("red",5,20,0,0)];
var mouseX =0;
var mouseY =0;

function trans(){
    turn++;
    if(turn > 2){
        turn = 0;
    }
    document.getElementById("show").innerHTML = turn + " " + team;
}
function add() {turn=1;}
function del() {turn=2;}
function drag() {turn=0;}
function line() {turn=4;}
function arc() {turn=5;}

function init()
{
    stg  = new createjs.Stage("a");

    var image = new Image();
    image.src=footballBGImg.p;
    image.onload = stageSetting;
}
function stageSetting(e) {
    // stg.addChild(CreateField());

    var image = e.target;
    var bitmap = new createjs.Bitmap(image);
    shp.graphics.beginFill("#00aa00").drawRect(0, 0, BORDER_WIDTH, BORDER_HEIGHT).endFill();
    gridShape=createGrid();
    stg.addChild(shp);
    stg.addChild(bitmap);
    stg.addChild(gridShape);
    stg.update();
    objs.setBounds(0, 0, BORDER_WIDTH, BORDER_HEIGHT);
    stg.addChild(objs);

    stg.on("click",function(ev){
        var x = ev.rawX;
        var y = ev.rawY;
        document.getElementById("show2").innerHTML = x+","+y;
        if(turn == 1){
            if(team == true){
                addObject(drawCircle("Red",2,20),x,y);

            }else{
                addObject(drawCross("Red",3,20),x,y);
            }
        }
        if(turn == 4)
        {
            if(clickTimes==1)
            {
               addObject(drawLine("Red",3,x-mouseX,y-mouseY),mouseX,mouseY);
                clickTimes = 0;
            }
            else
            {
                mouseX=x;
                mouseY=y;
                clickTimes++;
            }

        }
        if(turn ==  5)
        {
            if(clickTimes==1)
            {
                var s_angle;
                var e_angle;
                var r= Math.sqrt(Math.pow(x-mouseX,2)+Math.pow(y-mouseY,2));
               var condition = new ArcCondition(mouseX,mouseY,x,y);
                s_angle = condition.getS();
                e_angle = condition.getE();
                console.log (s_angle);
                console.log (e_angle);


                addObject(drawArc("Red",3,r,s_angle,e_angle),mouseX,mouseY);
               //addObject(drawArcLine("Red",3,100,100,50),100,100);
                clickTimes = 0;
            }
            else
            {
                mouseX=x;
                mouseY=y;
                clickTimes++;
            }
        }
    });
    objs.on("click", function(e){
        if(turn == 2){
            objs.removeChild(e.target);
            stg.update();
        }
    });
    objs.on("pressup", function(e) {
        if(turn == 0) {
            e.target.alpha = 1;
            stg.update();
        }
    });
    objs.on("pressmove", function(e){
        if(turn == 0){
            e.target.alpha=0.5;
            e.target.x = e.stageX;
            e.target.y = e.stageY;
            stg.update();
        }
    });


}
function ArcCondition(x1,y1,x2,y2)
{
    this.s =0;
    this.e = 0;
    if(x1<x2 && y1<y2)
    {
        this.s = Math.PI*1.5;
        this.e = 0;
    }
    else if(x1>x2 && y1<y2)
    {
        this.s = 0;
        this.e = Math.PI/2;
    }
    else if(x1 > x2 && y1>y2)
    {
        this.s = Math.PI/2;
        this.e = Math.PI;
    }
    else if(x1 < x2 && y1>y2)
    {
        this.s = Math.PI;
        this.e = Math.PI*1.5;
    }
    else if(x1 == x2 && y1<y2)
    {
        this.s = Math.PI*1.5;
        this.e = Math.PI/2;
    }
    else if(x1==x2 && y1 > y2)
    {
        this.s = Math.PI/2;
        this.e = Math.PI*1.5;
    }
    else if(x1 < x2 && y1==y2)
    {
        this.s = Math.PI;
        this.e = 0;
    }
    else if(x1>x2 && y1==y2)
    {
        this.s=0;
        this.e=Math.PI;
    }

}
ArcCondition.prototype.getS = function(){
    return this.s;
}
ArcCondition.prototype.getE = function(){
    return this.e;
}


function addObject(shape,x1,y1)
{
    shape.set({x:x1,y:y1});
    objs.addChild(shape);
    stg.update();
}
function drawArc(color,strokeStyle,r,s_angle,e_angle)
{
    var arc = new createjs.Shape();
    arc.graphics.setStrokeStyle(strokeStyle).beginStroke(color).arc(0,0,r,s_angle,e_angle).endStroke();
    return arc;
}
function drawArcLine(color,strokeStyle,x1,y1,r)
{
    var arcLine = new createjs.Shape();
    arcLine.graphics.setStrokeStyle(strokeStyle).beginStroke(color).moveTo(0,0).arcTo(50,0  ,x1,y1,r).endStroke();
    return arcLine;
}
function drawLine(color,strokeStyle,x1,y1)
{
    var line = new createjs.Shape();
    line.graphics.setStrokeStyle(strokeStyle).beginStroke(color).moveTo(0,0).lineTo(x1,y1).endStroke();

    return line;

}
function drawCircle(color,strokeStyle,r){
    var circle = new createjs.Shape();
    circle.graphics.setStrokeStyle(strokeStyle).beginStroke("#000000").drawCircle(0,0,r).endStroke();
    circle.graphics.setStrokeStyle(strokeStyle).beginStroke("#FF9933").drawCircle(0,0,r-2).endStroke();
    circle.graphics.setStrokeStyle(strokeStyle).beginStroke("#999966").drawCircle(0,0,r-4).endStroke();
    circle.graphics.endFill();
    return circle;
}
function drawCross(color,strokeStyle,long){
    var cross = new createjs.Shape();
    cross.graphics.setStrokeStyle(strokeStyle).beginStroke(color).moveTo(-long, -long).lineTo(long, long).moveTo(-long, long).lineTo(long, -long).endStroke();
    return cross;
}

function CreateField(backGroundId,fieldBitmap,p){
    var background = new createjs.Shape();
    fieldBitmap.src=p;
    backGroundId = typeof backGroundId !== 'undefined' ? backGroundId:1;
    switch (backGroundId) {
        default:
            fieldBitmap.src=footballBGImg.p;
            break;
    }
    background.graphics.clear();
    var offsetMatrix = new createjs.Matrix2D(1,0,0,1,0,0);
    background.graphics.beginBitmapFill(fieldBitmap,"repeat-x",offsetMatrix);

    background.graphics.drawRect(0,0,BORDER_WIDTH,BORDER_HEIGHT);
    background.graphics.endFill();

}
function grid()
{
    var state = document.getElementById('gridBtn').value;
    if(state =="on") {
        gridSwitch=true;
        document.getElementById('gridBtn').value = "off";
        gridShape.visible=false;
        stg.update();

    }
    else
    {
        gridSwitch=false;
        document.getElementById('gridBtn').value = "on";
        gridShape.visible=true;
        stg.update();

    }
}
function teamSwtich()
{
    var state = document.getElementById('teamBtn').value;
    if(state =="o") {
        gridSwitch=true;
        document.getElementById('teamBtn').value = "x";
        team=false;

    }
    else
    {
        gridSwitch=false;
        document.getElementById('teamBtn').value = "o";
        team=true;


    }
}
function createGrid(){
    var grid= new createjs.Shape();
    grid.name="grid";
    //lineStyle(3, 0x333333, .1)
    grid.graphics.clear();
    grid.graphics.setStrokeStyle(3);
    //0x333333 = rgb(51,51,51)
    grid.graphics.beginStroke("rgba(51,51,51,0.1)");
    for (var x = 20; x < BORDER_WIDTH; x = x + 20) {
        grid.graphics.moveTo(x, 0);
        grid.graphics.lineTo(x, BORDER_HEIGHT);
    }
    for (var y = 20; y < BORDER_HEIGHT; y = y + 20) {
        grid.graphics.moveTo(0, y);
        grid.graphics.lineTo(BORDER_WIDTH, y);
    }
    //grid.graphics.alpha(0.5);
    grid.graphics.endFill();
    return grid;

}