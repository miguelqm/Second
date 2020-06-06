//<reference path="./shape.js" />

class Ball extends Shape
{
    constructor(x, y, m, h, w, e, c, v, a)
    {
        super(x, y, m, h, w, e, c, v, a);
        this.height = this.width;
        this.radius = this.height/2;
    }

    collision(x, y, o)
    {
        let signY;
        let vecOpposing = createVector(x, y);
        if(vecOpposing.x != 0 || vecOpposing.y != 0)
        {
            this.deform(vecOpposing);
            vecOpposing.normalize();
            signY = vecOpposing.y;
            vecOpposing.x *= abs(this.vel.x);
            vecOpposing.y *= abs(this.vel.y);
            roundVector(vecOpposing);
            this.applyForce(p5.Vector.mult(vecOpposing, this.mass));
            this.vel.add(this.acc);
            if(o === undefined)
                this.applyForce(this.weight().mult(-1));
            else
            {
                o.applyForce(p5.Vector.mult(vecOpposing, -o.mass));
                o.vel.add(o.acc);
            }
        }
        else this.reform();
    }

    testCollisionEdges(i)
    {
        // let vec = this.checkEdges();
        // if(vec.x != 0)
        // this.vel.x *= vec.normalize().x;
        // if(vec.y != 0)
        // this.vel.y *= vec.normalize().y;
        // this.pos.add(vec);
        let vec = this.checkEdges();
        //this.collision(vec.x, vec.y);
        //this.testCollisionBalls();
        if(vec.mag() != 0)
            collision2DsEdges(this, vec);
        let colliding = this.testCollisionBalls(i);
        if(colliding !== undefined)
            collision2DsShapes(this, colliding);
    }

    testCollisionBalls(j)
    {
        for (let i = 0; i < shapes.length; i++)
        {
            let s1 = shapes[i];
            if(s1 != this)
            {
                let x1 = this.pos.x;
                let y1 = this.pos.y;
                let x2 = s1.pos.x;
                let y2 = s1.pos.y;
                let distCenters = dist(x1, y1, x2, y2);
                let sumRadius = this.radius + s1.radius;
                
                if(distCenters <= sumRadius)
                {
                    //collision2DsShapes(this, s1);
                    // if(abs(distCenters - sumRadius) > 0 && abs(distCenters - sumRadius) < 1 && this.vel.mag() < 1)
                    // {
                    //     this.pos = this.storedPos;
                    //     //this.vel.mult(-1);
                    //     return;
                    // }                    
                    // let delta = (distCenters - sumRadius);
                    // if(abs(delta) <= 1 && abs(delta) > 0)
                    // {
                    //     let vx = createVector(x1 - x2, y1 - y2);
                    //     vx.normalize();
                    //     vx.setMag(delta);
                    //     this.pos.add(vx);
                    // }
                    // if(delta <= 0 && this.vel.mag() < 1 && this.acc.mag() < 1)
                    // {
                    //     let vx = createVector(x1 - x2, y1 - y2);
                    //     vx.normalize();
                    //     vx.setMag(round(-delta+1));
                    //     this.pos.add(vx);
                    //     //this.vel.setMag(0);
                    // }    
                    
                    return shapes[i];
                }
            }
        }
    }

    collision2D()
    {

    }

    checkEdges()
    {
        let f = createVector(0, 0);

        let r = this.pos.x + this.radius - width;
        let l = this.pos.x - this.radius;
        let b = this.pos.y + this.radius - height;
        let t = this.pos.y - this.radius;

        if(r >= 0) // Right
            f.add(createVector(-r, 0));        
        if(l <= 0) // Left
            f.add(createVector(-l, 0));
        if(b >= 0) // Bottom
            f.add(createVector(0, -b));
        if(t <= 0) // Top
            f.add(createVector(0, -t));
        
        return f;
    }

    checkEdges2()
    {
        let f = createVector(0, 0);

        let r = this.pos.x + this.radius - width;
        let l = this.pos.x - this.radius;
        let b = this.pos.y + this.radius - height;
        let t = this.pos.y - this.radius;

        if(r >= 0) // Right
            f.add(createVector(-1, 0));        
        if(l <= 0) // Left
            f.add(createVector(-1, 0));
        if(b >= 0) // Bottom
            f.add(createVector(0, -1));
        if(t <= 0) // Top
            f.add(createVector(0, -1));
        
        return f;
    }

    deform(opVec)
    {
        let v = opVec.copy();
        let dif = v.mag();
        let signX = (v.x != 0 ? -1 : 1);
        let signY = (v.y != 0 ? -1 : 1);

        let Xdif = (((this.height-dif/2)/2)-(this.radius-dif))*v.x/dif;
        let Ydif = (((this.height-dif/2)/2)-(this.radius-dif))*v.y/dif;

        this.pos.x += Xdif+this.restitution;
        this.pos.y += Ydif+this.restitution;
        this.width += (dif/2*signX)+this.restitution*2;
        this.height += (dif/2*signY)-this.restitution*2;
        
        //this.storedPos.set(-Xdif-this.restitution, -Ydif-this.restitution);
        //this.storedEnergy = p5.Vector.sub(this.pos, this.storedEnergy);
        // this.storedEnergy.y = (((this.height-dif/2)/2)-(this.radius-dif))*v.y/dif;
    }
    pause(){
        this.vel = this.vel;
    }

    reform()
    {
        if(this.height != this.radius || this.width != this.radius)
        {
            this.width = this.radius * 2;
            this.height = this.radius* 2;
        }
    }
    
    hide()
    {
        stroke(0, 0, 0);
        strokeWeight(2);
        fill(0,0,0);
        ellipse(this.pos.x, this.pos.y, this.width+1, this.height+1);
    }

    show(cc)
    {   
        super.show();
        stroke(200, 110, 110);
        strokeWeight(1);
        fill(255,cc,0);
        ellipse(this.pos.x, this.pos.y, this.width, this.height);
    }
    // update()
    // {
    //     //this.applyForce(this.weight);
    //     this.drag();
    //     this.friction();
    //     if((this.height == this.radiusadius * 2) && (this.width == this.radiusadius * 2))
    //         //this.vel.add(this.acc);
    //         this.applyForce(this.weight);
    //     else
    //     {
    //         //this.vel.x += this.acc.x;
    //         if(this.height != this.radiusadius * 2)
    //             this.height = this.radiusadius * 2;
    //         if(this.width != this.radiusadius * 2)
    //             this.width = this.radiusadius * 2;
    //     }       
    //     this.pos.add(this.vel);          
    //     this.edges1();
    //     //}
    //     //this.edges();
    //     this.acc.set(0, 0);
    // }

    // show()
    // {
    //     stroke(255);
    //     strokeWeight(2);
    //     fill(205,102,120);
    //     // this.size.x += random(2)*random([-1,1]);
    //     // this.size.y += random(2)*random([-1,1]);
    //     // if(this.size.x < 10)
    //     //     this.size.x = 10;
    //     // if(this.size.y < 10)
    //     //     this.size.y = 10;            
    //     // this.size.limit(40);
    //     ellipse(this.pos.x, this.pos.y, this.width, this.height);
    // }

    edges()
    {
        if(this.pos.x + this.radius >= width)
        {
            this.vel.x *= -1;            
            this.height += (this.pos.x + this.radius - width) * 2;
            this.width -= (this.pos.x + this.radius - width) * 2;
        }
        if(this.pos.x <= this.radius)
        {
            this.vel.x *= -1;
            this.height += (this.radius - this.pos.x) * 2;
            this.width -= (this.radius - this.pos.x) * 2;
        }
        if(this.pos.y + this.radius >= height)
        {
            if(abs(this.vel.y) < 1)
            {
                this.vel.y = 0;
                this.pos.y = height - this.radius;
            }
            else
            {
                this.vel.y *= -1;
                this.height -= (this.pos.y + this.radius - height) * 2;
                this.width += (this.pos.y + this.radius - height) * 2;
            }
            this.acc.y = 0;
            ybefore = this.vel.y;
            yafter = this.vel.y;
        }
        if(this.pos.y <= this.radius)
        {
            if(abs(this.vel.y) < 1)
            {
                this.vel.y = 0;
                this.pos.y = this.radius;
            }
            else
            {
                this.vel.y *= -1;
                this.height -= (this.radius - this.pos.y) * 2;
                this.width += (this.radius - this.pos.y) * 2;
            }
        }
    }

    // edges() {
    //     if (this.pos.y >= height - this.radius) {
    //       this.pos.y = height - this.radius;
    //       this.vel.y *= -1;
    //     }
    
    //     if (this.pos.x >= width - this.radius) {
    //       this.pos.x = width - this.radius;
    //       this.vel.x *= -1;
    //     } else if (this.pos.x <= this.radius) {
    //       this.pos.x = this.radius;
    //       this.vel.x *= -1;
    //     }
    //   }

//     clicked(x, y)
//     {
//         let d = dist(x, y, this.pos.x, this.pos.y);
//         if(d <= this.radius)
//             this.applyForce(createVector(50, 0));
//     }

//     drag()
//     {
//         let drag = this.vel.copy();
//         drag.setMag(dragCoef);
//         this.applyForce(drag);
//     }

//     friction() 
//     {
//         let diff = height - (this.pos.y + this.radius);
//         if (diff < 1) 
//         {    
//             let friction = this.vel.copy();
//             let accMag = p5.Vector.mult(friction, this.mass).mag();
//             friction.normalize();
//             friction.mult(-1);

//             let normal = this.mass;
//             friction.setMag(mu * normal);
//             if(friction.mag() > accMag)
//                 friction.setMag(accMag);
// //friction.y = 0;                
//             this.applyForce(friction);
//         }
//       }
}