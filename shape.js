class Shape
{
    #mass;
    #height;
    #width;
    #restitution;
    #color;
    #pos;
    #acc;
    #vel;
    #storedPos;

    constructor(x, y, m, w, h, r, c, v, a)
    {
        this.storedPos = initVector();
        this.pos = createVector(x, y);
        this.mass = m;
        this.width = w;
        this.height = h;
        this.restitution = r;
        this.color = c;
        this.vel = initVector(v);
        this.acc = initVector(a);
    }

    set mass(m) {
        if(m === undefined)
            m = 1;
        this.#mass = m;
    }

    get mass() {
        return this.#mass;
    }

    set width(w) {
        if(w === undefined)
            w = 1;
        this.#width = w;
    }

    get width() {
        return this.#width;
    }

    set height(h) {
        if(h === undefined)
            h = 1;
        this.#height = h;
    }

    get height() {
        return this.#height;
    }

    set restitution(r) {
        if(r === undefined)
            r = 1;
        this.#restitution = r;
    }

    get restitution() {
        return this.#restitution;
    }

    set color(c) {
        if(c === undefined)
            c = 255;
        this.#color = c;
    }

    get color() {
        return this.#color;
    }

    get pos() {
        this.#pos.x = roundPrec(this.#pos.x);
        this.#pos.y = roundPrec(this.#pos.y);         
        return this.#pos;
    }

    set pos(p) {
        p.x = roundPrec(p.x);
        p.y = roundPrec(p.y);    
        this.#pos = p;
    }

    get acc() {
        this.#acc.x = roundPrec(this.#acc.x);
        this.#acc.y = roundPrec(this.#acc.y);        
        return this.#acc;
    }

    set acc(a) {
        a.x = roundPrec(a.x);
        a.y = roundPrec(a.y);
        this.#acc = a;
    }

    get vel() {
        this.#vel.x = roundPrec(this.#vel.x);
        this.#vel.y = roundPrec(this.#vel.y); 
        return this.#vel;
    }

    set vel(v) {
        v.x = roundPrec(v.x);
        v.y = roundPrec(v.y);
        this.#vel = v;
    }

    get storedPos() {
        // this.#storedPos.x = roundPrec(this.#storedPos.x);
        // this.#storedPos.y = roundPrec(this.#storedPos.y);         
        return this.#storedPos;
    }

    set storedPos(p) {
        // e.x = roundPrec(e.x);
        // e.y = roundPrec(e.y);
        this.#storedPos = p;
    }    

    weight()
    {
        let g = p5.Vector.mult(gravity, this.mass); 
        return g;
    }

    applyForce(force)
    {
        let f = p5.Vector.div(force, this.mass);
        this.acc.add(f);
    }

    applyWeight()
    {
        this.applyForce(this.weight());
    }

    applyDrag()
    {
        let drag = this.vel.copy();
        drag.mult(this.mass * dragCoef);   
        this.applyForce(drag);
    }

    applyFriction() 
    {
        let diff = height - (this.pos.y + this.radius);
        if (diff < 1) 
        {    
            let friction = this.vel.copy();
            let accMag = p5.Vector.mult(friction, this.mass).mag();
            friction.normalize();
            friction.mult(-1);

            let normal = this.mass;
            friction.setMag(mu * normal);
            if(friction.mag() > accMag)
                friction.setMag(accMag);       
            this.applyForce(friction);
        }
    }

    clicked(x, y)
    {
        let d = dist(x, y, this.pos.x, this.pos.y);
        //if(d <= this.radius)
        let sign = 1;
        let nx, ny;

        if (mouseButton === LEFT) 
        {
            if(y < (height/2))
                sign = -1;
            if(this.vel.y >= 0)
                sign *= -1;
            ny = 650*sign;
            this.applyForce(createVector(0, ny));
        }
        if (mouseButton === RIGHT) 
        {
            if(x < (width/2))
                sign = -1;
            if(this.vel.x >= 0)
                sign *= -1;
            nx = 350*sign;
            this.applyForce(createVector(nx, 0));
        }
    }

    update(i)
    {
        this.pause();
        this.applyWeight();
        this.applyDrag();
        //this.applyFriction();
        this.vel.add(this.acc);     
        if(abs(this.vel.x) <= 0.1)
            this.vel.x = 0;
        if(abs(this.vel.y) <= 0.1)
            this.vel.y = 0;
        this.acc.set(0, 0);
        this.storedPos = this.pos.copy();
        this.pos = p5.Vector.add(this.pos, this.vel);
        this.testCollisionEdges(i);
    }

    show()
    {
        stroke(200, 110, 110);
        strokeWeight(1);
        fill(255,0,0);

        // r = random(0,255);
        // g = random(0,255);
        // b = random(0,255);
        // fill(r,g, b);
    }
}