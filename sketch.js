//<reference path="./p5/p5.global-mode.d.ts" />
let sumVelTot = 0;
var shapes = [];
var maxHeight;
var maxVel;
var maxh;
var ybefore;
var yafter;
var r, g, b;
var framecount;

function setup() 
{
    framecount = 0;
    init();
    createCanvas(1590, 780);
    background(0);
    maxHeight = height;
    maxVel = 0;

    stroke(200, 110, 110);
    strokeWeight(1);
    fill(255,0,0);
    //ellipse(500, 500, 500, 500);

     for (i = 0; i < 20; i++)
         shapes.push(new Ball(50+i*75, 30+i*10, 150, 50, 35, CONST_RESTITUTION));
    for (i = 0; i < 22; i++)
         shapes.push(new Ball(50+i*70, 115+i*10, 150, 40, 35+i, CONST_RESTITUTION));
    for (i = 0; i < 22; i++)
         shapes.push(new Ball(50+i*70, 210+i*10, 150, 40, 35-i, CONST_RESTITUTION));
    for (i = 0; i < 22; i++)
         shapes.push(new Ball(50+i*70, 310+i*10, 150, 40, 35+2*i, CONST_RESTITUTION));         
    for (i = 0; i < 22; i++)
         shapes.push(new Ball(50+i*70, 410+i*10, 150, 40, 35, CONST_RESTITUTION));         
    for (i = 0; i < 50; i++)
         shapes.push(new Ball(40+i*30, 560, 50, 20, 15, CONST_RESTITUTION));
    for (i = 0; i < 50; i++)
         shapes.push(new Ball(40+i*30, 660, 50, 20, 15, CONST_RESTITUTION));
    for (i = 0; i < 50; i++)
         shapes.push(new Ball(40+i*30, 700, 50, 20, 15, CONST_RESTITUTION));         

        //  shapes.push(new Ball(500, 500, 500, 500, 500, CONST_RESTITUTION));
        // shapes.push(new Ball(110, 200, 150, 60, 60, CONST_RESTITUTION));
        // shapes.push(new Ball(110, 400, 100, 200, 20, CONST_RESTITUTION));
        
        maxHeight = shapes[0].pos.y;
    //for (i = 0; i < 1; i++)
    //    shapes.push(new Rect(100+i*40, 400+i*20, 50, 15, 45,));
    //shapes[0].vel.y = -15;
    //shapes[1].vel.y = -10;
    //shapes[0].vel.x = 5;
}
  
function draw()
{  
    let sumVel = 0;
    let s1 = shapes[0];
    let s2 = shapes[1];
    framecount++;
    background(0);
    //fill(255);
    // for (let i = 0; i < shapes.length; i++)
    // {
    //     shapes[i].hide();
    // }
    for (let i = 0; i < shapes.length; i++)
    {
        shapes[i].update(i);
        //collision2Ds(s1.mass, s2.mass, 1, s1.pos.x, s1.pos.y, s2.pos.x, s2.pos.y, s1.vel.x, s1.vel.y, s2.vel.x, s2.vel.y);
        shapes[i].show(0);
        sumVel += roundPrec(shapes[i].vel.mag(), 2);
    }
    if(shapes[0].pos.y <= maxHeight)
        maxHeight = shapes[0].pos.y;
    if(shapes[0].vel.y >= maxVel)
        maxVel = shapes[0].vel.y;

    stroke(0);
    strokeWeight(0);
    fill(255,0,5);
    rect(549, 174, 100, 12);
    fill(255);
    stroke(255);
    sumVelTot = (sumVel + sumVelTot)/2;
    text('Frames = ' + roundPrec(sumVel,2), 550, 185);    
    // text('Speed = ' + shapes[0].vel.y, 350, 85);    
    // if(shapes[0].vel.y <= 0){
    //     text('MaxHeight = ' + shapes[0].pos.y, 550, 85);
    //     maxh = shapes[0].pos.y;
    // }
    // else
    // {
    //     //maxVel = 0;
    //     maxHeight = maxh;
    // }
    // text('MaxHeight = ' + maxHeight, 550, 65);
    
    
    // text('MaxVel = ' + maxVel, 350, 65);        
}

function mousePressed(event)
{
    for (i = 0; i < shapes.length; i++)
    {
        shapes[i].clicked(mouseX, mouseY);
        //shapes[i].vel.setMag(0);
        //shapes[i].acc.setMag(0);
    }

    return false;
}