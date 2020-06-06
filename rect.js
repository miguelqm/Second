class Rect extends Shape
{
    constructor(x, y, m, h, w, e, c, v, a)
    {
        super(x, y, m, h, w, e, c, v, a);
    }

    testCollision()
    {
        let vecOpposing = this.checkEdges();
        if(vecOpposing.mag() != 0)
        {
            this.deform(vecOpposing);
            vecOpposing.normalize();
            vecOpposing.mult(this.vel.mag());
            roundVector(vecOpposing);
            this.applyForce(p5.Vector.mult(vecOpposing, this.mass));
            this.vel.add(this.acc);
        }
    }

    checkEdges()
    {
        let f = createVector(0, 0);

        let r = this.pos.x + this.radius + this.vel.x - width;
        let l = this.pos.x - this.radius + this.vel.x;
        let b = this.pos.y + this.radius + this.vel.y - height;
        let t = this.pos.y - this.radius + this.vel.y;

        if(r >= 0) // Right
            f.add(createVector(-r, 0));        
        if(l <= 0) // Left
            f.add(createVector(l, 0));
        if(b >= 0) // Bottom
            f.add(createVector(0, -b));
        if(t <= 0) // Top
            f.add(createVector(0, t));
        
        return f;
    }

    deform(opVec)
    {
        let v = opVec.copy();
        if(v.x != 0)
            v.y -= v.x;
        else
            v.x -= v.y;

        this.height += v.y/2;
        this.width += v.x/2;
        this.pos.x -= opVec.x/2;
        this.pos.y = height + opVec.y;
    }

    show()
    {
        super.show();
        rect(this.pos.x, this.pos.y, this.width, this.height);
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