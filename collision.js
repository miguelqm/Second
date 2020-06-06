//******************************************************************************
//   This program is a 'remote' 2D-collision detector for two balls on linear
//   trajectories and returns, if applicable, the location of the collision for 
//   both balls as well as the new velocity vectors (assuming a partially elastic
//   collision as defined by the restitution coefficient).
//   The equations on which the code is based have been derived at
//   http://www.plasmaphysics.org.uk/collision2d.htm
//
//   In  'f' (free) mode no positions but only the initial velocities
//   and an impact angle are required.
//   All variables apart from 'mode' and 'error' are of Precision /   Floating Point type.
//
//   The Parameters are:
//
//    mode  (char) (if='f' alpha must be supplied; otherwise arbitrary)
//    alpha (impact angle) only required in mode='f'; 
//                     should be between -PI/2 and PI/2 (0 = head-on collision))
//    R    (restitution coefficient)  between 0 and 1 (1=perfectly elastic collision)
//    m1   (mass of ball 1)
//    m2   (mass of ball 2)
//    r1   (radius of ball 1)        not needed for 'f' mode
//    r2   (radius of ball 2)                "
//  & x1   (x-coordinate of ball 1)          "
//  & y1   (y-coordinate of ball 1)          "
//  & x2   (x-coordinate of ball 2)          "
//  & y2   (y-coordinate of ball 2)          "
//  & vx1  (velocity x-component of ball 1) 
//  & vy1  (velocity y-component of ball 1)         
//  & vx2  (velocity x-component of ball 2)         
//  & vy2  (velocity y-component of ball 2)
//  & error (int)  (0: no error
//                  1: balls do not collide
//                  2: initial positions impossible (balls overlap))
//
//   Note that the parameters with an ampersand (&) are passed by reference,
//   i.e. the corresponding arguments in the calling program will be updated;
//   however, the coordinates and velocities will only be updated if 'error'=0.
//
//   All variables should have the same data types in the calling program
//   and all should be initialized before calling the function even if
//   not required in the particular mode.
//
//   This program is free to use for everybody. However, you use it at your own
//   risk and I do not accept any liability resulting from incorrect behaviour.
//   I have tested the program for numerous cases and I could not see anything 
//   wrong with it but I can not guarantee that it is bug-free under any 
//   circumstances.
//
//   I would appreciate if you could report any problems to me
//   (for contact details see  http://www.plasmaphysics.org.uk/feedback.htm ).
//
//   Thomas Smid, January  2004
//                December 2005 (corrected faulty collision detection; 
//                               a few minor changes to improve speed;
//                               added simplified code without collision detection)
//                December 2009 (generalization to partially inelastic collisions)
//*********************************************************************************

function collision2D(mode, alpha, R, m1, m2, r1, r2, x1, y1, x2, y2, vx1, vy1, vx2, vy2, error) {

    let r12,m21,d,gammav,gammaxy,dgamma,dr,dc,sqs,t,dvx2,a,x21,y21,vx21,vy21,pi2,vx_cm,vy_cm;

    //     ***initialize some variables ****
    pi2=2*acos(-1.0);
    error=0;
    r12=r1+r2;
    m21=m2/m1;
    x21=x2-x1;
    y21=y2-y1;
    vx21=vx2-vx1;
    vy21=vy2-vy1;

    vx_cm = (m1*vx1+m2*vx2)/(m1+m2) ;
    vy_cm = (m1*vy1+m2*vy2)/(m1+m2) ;

    //     ****  return old positions and velocities if relative velocity =0 ****
    if ( vx21==0 && vy21==0 ) {error=1; return;}
        gammav=atan2(-vy21,-vx21); //     *** calculate relative velocity angle             

    //******** this block only if initial positions are given *********
    if (mode != 'f') {
        d=sqrt(x21*x21 +y21*y21);

        //     **** return if distance between balls smaller than sum of radii ***
        if (d<r12) {error=2; return;}

        //     *** calculate relative position angle and normalized impact parameter ***
        gammaxy=atan2(y21,x21);
        dgamma=gammaxy-gammav;

        if (dgamma>pi2) {dgamma=dgamma-pi2;}
        else if (dgamma<-pi2) {dgamma=dgamma+pi2;}

        dr=d*sin(dgamma)/r12;

        //     **** return old positions and velocities if balls do not collide ***
        if (  (abs(dgamma)>pi2/4 && abs(dgamma)<0.75*pi2) || abs(dr)>1 )   
            {error=1; return;}

        //     **** calculate impact angle if balls do collide ***
        alpha=asin(dr);

        //     **** calculate time to collision ***
        dc=d*cos(dgamma);

        if (dc>0) {sqs=1.0;} else {sqs=-1.0;}

        t=(dc-sqs*r12*sqrt(1-dr*dr))/sqrt(vx21*vx21+ vy21*vy21);
        //    **** update positions ***
        x1=x1+vx1*t;
        y1=y1+vy1*t;
        x2=x2+vx2*t;
        y2=y2+vy2*t;
    }

    //******** END 'this block only if initial positions are given' *********

    //     ***  update velocities ***

    a=tan( gammav +alpha);

    dvx2=-2*(vx21 +a*vy21) /((1+a*a)*(1+m21));

    vx2=vx2+dvx2;
    vy2=vy2+a*dvx2;
    vx1=vx1-m21*dvx2;
    vy1=vy1-a*m21*dvx2;

    //     ***  velocity correction for inelastic collisions ***
    vx1=(vx1-vx_cm)*R + vx_cm;
    vy1=(vy1-vy_cm)*R + vy_cm;
    vx2=(vx2-vx_cm)*R + vx_cm;
    vy2=(vy2-vy_cm)*R + vy_cm;

    return;
}



    //******************************************************************************
    //  Simplified Version
    //  The advantage of the 'remote' collision detection in the program above is 
    //  that one does not have to continuously track the balls to detect a collision. 
    //  The program needs only to be called once for any two balls unless their 
    //  velocity changes. However, if somebody wants to use a separate collision 
    //  detection routine for whatever reason, below is a simplified version of the 
    //  code which just calculates the new velocities, assuming the balls are already 
    //  touching (this condition is important as otherwise the results will be incorrect)
    //****************************************************************************
function collision2DsEdges(s1, edge) {

    let nX, nY;
    //     ***  update velocities ***
    if(edge.x != 0)
        s1.vel.x=-s1.vel.x;
    if(edge.y != 0)
        s1.vel.y=-s1.vel.y;
    
    s1.pos.x += edge.x;
    s1.pos.y += edge.y;

    return;
}

function collision2DsShapes(s1, s2) {

    let m21,dvx2,a,x21,y21,vx21,vy21,fy21,sign,vx_cm,vy_cm;

    m21=s2.mass/s1.mass;
    x21=s2.pos.x-s1.pos.x;
    y21=s2.pos.y-s1.pos.y;
    vx21=s2.vel.x-s1.vel.x;
    vy21=s2.vel.y-s1.vel.y;

    vx_cm = (s1.mass*s1.vel.x+s2.mass*s2.vel.x)/(s1.mass+s2.mass);
    vy_cm = (s1.mass*s1.vel.y+s2.mass*s2.vel.y)/(s1.mass+s2.mass);



    //     *** return old velocities if balls are not approaching ***
    if ( (vx21*x21 + vy21*y21) >= 0) return;

    //     *** I have inserted the following statements to avoid a zero divide; 
    //         (for single precision calculations, 
    //          1.0E-12 should be replaced by a larger value). **************  

    fy21=10e-12*abs(y21);
    if ( abs(x21)<fy21 ) {  
        if (x21<0) { sign=-1; } else { sign=1;}  
        x21=fy21*sign; 
    } 

    //     ***  update velocities ***
    a=y21/x21;
    dvx2= -2*(vx21 +a*vy21)/((1+a*a)*(1+m21));
    
    // let distance = dist(s1.pos.x, s1.pos.y, s2.pos.x, s2.pos.y);
    // let sumRad = s1.radius + s2.radius;
    // if(abs(distance - sumRad) < 1 && vx21 < 1 && vy21 < 1)
    // {
    //     let vRadius = createVector(s1.pos.x - s2.pos.x, s1.pos.y - s2.pos.y);
    //     vRadius.normalize();
    //     vRadius.setMag(abs(distance - sumRad));
    //     // s1.vel.mult(-1);
    //     // s2.vel.mult(-1);
    //     dvx2 = 0;
    // }
    // if(s1.vel.mag() < 0.1 && s2.vel.mag() < 0.1)
    // {
    //     dvx2 = 0;
    //     s1.vel.x = 0;
    //     s1.vel.y = 0;
    //     s2.vel.x = 0;
    //     s2.vel.y = 0;
    // }
    s2.vel.x=s2.vel.x+dvx2;
    s2.vel.y=s2.vel.y+a*dvx2;
    s1.vel.x=s1.vel.x-m21*dvx2;
    s1.vel.y=s1.vel.y-a*m21*dvx2;

    //     ***  velocity correction for inelastic collisions ***
    s1.vel.x=(s1.vel.x-vx_cm)*s1.restitution + vx_cm;
    s1.vel.y=(s1.vel.y-vy_cm)*s1.restitution + vy_cm;
    s2.vel.x=(s2.vel.x-vx_cm)*s2.restitution + vx_cm;
    s2.vel.y=(s2.vel.y-vy_cm)*s2.restitution + vy_cm;

    let distance = dist(s1.pos.x, s1.pos.y, s2.pos.x, s2.pos.y);
    let sumRad = s1.radius + s2.radius;
    let penetration = sumRad - distance;
    if(penetration >= 0)
    {
        let vRadius = createVector(s1.pos.x - s2.pos.x, s1.pos.y - s2.pos.y);
        vRadius.normalize();
        let percent = 1.3; // usually 20% to 80%
        let slop = 0.051; // usually 0.01 to 0.1
        let correction = vRadius.mult((max(penetration - slop, 0) / (1/s1.mass + 1/s2.mass)) * percent);
        s1.pos.add(p5.Vector.mult(correction, 1/s1.mass));
        s2.pos.sub(p5.Vector.mult(correction, 1/s2.mass));
        if(abs(s1.vel.x) < 0.05)
            s1.vel.x = 0;
        // if(abs(s1.vel.y) < 0.05)
        //     s1.vel.y = 0;        
        // if(abs(s2.vel.x) < 0.05)
        //     s2.vel.x = 0;
        // if(abs(s2.vel.y) < 0.05)
        //     s2.vel.y = 0;        
    }
    //  if((s2.vel.mag() < 1 && s2.acc.mag() < 1) && (s1.vel.mag() < 1 && s1.acc.mag() < 1)){
    //     s1.vel.x = round(s1.vel.x);
    //     s1.vel.y = round(s1.vel.y);
    //     s1.pos = s1.storedPos;
    // }
    // {
    //     let vRadius = createVector(s1.pos.x - s2.pos.x, s1.pos.y - s2.pos.y);
    //     vRadius.normalize();
    //     let vPerp = createVector(-1 * vRadius.y/vRadius.x, 1);
    //     vPerp.normalize();
    //     let zxc = vPerp.dot(vRadius);
    //     initVector(s2.vel, 0);
    //     initVector(s2.acc, 0);
    //     initVector(s1.vel, 0);
    //     initVector(s1.acc, 0);
    //     s1.pos = s1.storedPos.copy();
    // }
    // else
    // {
    //     drag = 0;            
    // }    

    return;
}

function collision2Ds(m1, m2, R, x1, y1, x2, y2, vx1, vy1, vx2, vy2) {

    let m21,dvx2,a,x21,y21,vx21,vy21,fy21,sign,vx_cm,vy_cm;

    m21=m2/m1;
    x21=x2-x1;
    y21=y2-y1;
    vx21=vx2-vx1;
    vy21=vy2-vy1;

    vx_cm = (m1*vx1+m2*vx2)/(m1+m2);
    vy_cm = (m1*vy1+m2*vy2)/(m1+m2);   


    //     *** return old velocities if balls are not approaching ***
    if ( (vx21*x21 + vy21*y21) >= 0) return;

    //     *** I have inserted the following statements to avoid a zero divide; 
    //         (for single precision calculations, 
    //          1.0E-12 should be replaced by a larger value). **************  

    fy21=1.0-12*abs(y21);
    if ( abs(x21)<fy21 ) {  
        if (x21<0) { sign=-1; } else { sign=1;}  
        x21=fy21*sign; 
    } 

    //     ***  update velocities ***
    a=y21/x21;
    dvx2= -2*(vx21 +a*vy21)/((1+a*a)*(1+m21)) ;
    vx2=vx2+dvx2;
    vy2=vy2+a*dvx2;
    vx1=vx1-m21*dvx2;
    vy1=vy1-a*m21*dvx2;

    //     ***  velocity correction for inelastic collisions ***
    vx1=(vx1-vx_cm)*R + vx_cm;
    vy1=(vy1-vy_cm)*R + vy_cm;
    vx2=(vx2-vx_cm)*R + vx_cm;
    vy2=(vy2-vy_cm)*R + vy_cm;

    return;
}

