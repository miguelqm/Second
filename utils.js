const CONST_MU = 0.01;
const CONST_DRAG = -0.001;
const CONST_GRAVITY = 0.05;
const CONST_PRECISION = 20;
const CONST_RESTITUTION = 1;

var gravity;

function init()
{
    mu = CONST_MU;
    dragCoef = CONST_DRAG;
    gravity = createVector(0, CONST_GRAVITY);
}

function initVector(newVector, n)
{
    if(n === undefined)
        n = 0;
    if(newVector === undefined)
        newVector = createVector(n, n);
    else
        newVector.set(n);
    return newVector;
}

function roundVector(v)
{
    v.x = roundPrec(v.x, CONST_PRECISION);
    v.y = roundPrec(v.y, CONST_PRECISION);
}

function roundPrec(value, precision) {
    if(precision === undefined)
        precision = CONST_PRECISION;
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}