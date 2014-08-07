
// perlinNoise is an object for building 3 dimensional perlin-based noise
//
// it comes complete with cached random number generator needed to reproduce random
// values when provided the same argument
//
// requires: cachedRandom.js

function perlinNoise()
{
    // noise profile & controls
    this.maxAmplitude = 280; // the largest number returned by generateNoise()
    this.wholeNumberSpace = 10000000000000000; //the largest number in the pool of numbers used to modulo maxAmplitude
    this.gridUnit = 20; //the equidistant space between each x and y grid unit, used for smoothing and interpolating
                        //WARNING: MUST EQUAL spaceInbetweenGridPoints in generateMeshVertexArray(), FRAGILE!!!

    this.cachedRandom = new CachedRandom();
}



// this method is used to produce a random value based on a particular vertex
// on a two dimensional cartesian plane
perlinNoise.prototype.generateNoise = function(x, y)
{
    var randomFloat = this.cachedRandom.Random(x, y) * this.wholeNumberSpace % this.maxAmplitude;
    return randomFloat;
};


//TODO: Nth neighbor based smoothing (recursive? better iterative?)
perlinNoise.prototype.smoothNoise = function(x, y)
{
    var points = []; //declare an empty array, jslint insists on this syntax

    points.push(this.generateNoise(x-this.gridUnit, y+this.gridUnit)); //top left
    points.push(this.generateNoise(x              , y+this.gridUnit)); //top middle
    points.push(this.generateNoise(x+this.gridUnit, y+this.gridUnit)); //top right
    points.push(this.generateNoise(x-this.gridUnit, y              )); //middle left
    points.push(this.generateNoise(x              , y              )); //center
    points.push(this.generateNoise(x              , y              )); //center again for twice the weight
    points.push(this.generateNoise(x+this.gridUnit, y              )); //middle right
    points.push(this.generateNoise(x-this.gridUnit, y-this.gridUnit)); //bottom left
    points.push(this.generateNoise(x              , y-this.gridUnit)); //bottom middle
    points.push(this.generateNoise(x+this.gridUnit, y-this.gridUnit)); //bottom right

    var sum = 0.0;

    var i = 0;
    for (i = 0; i < points.length; i++)
    { sum = sum + points[i]; }

    return sum / 10.0;

    /* their way

    sum = this.generateNoise(x-this.gridUnit, y+this.gridUnit); //top left
    sum = this.generateNoise(x+this.gridUnit, y+this.gridUnit); //top right
    sum = this.generateNoise(x-this.gridUnit, y-this.gridUnit); //bottom left
    sum = this.generateNoise(x+this.gridUnit, y-this.gridUnit); //bottom right

    sum = sum / 16.0; //smooth corners

    sum = this.generateNoise(x              , y+this.gridUnit); //top middle
    sum = this.generateNoise(x-this.gridUnit, y              ); //middle left
    sum = this.generateNoise(x+this.gridUnit, y              ); //middle right
    sum = this.generateNoise(x              , y-this.gridUnit); //bottom middle

    sum = sum / 8.0; //smooth sides

    sum = this.generateNoise(x              , y              ); //center

    sum = sum / 4.0; //smooth sides

    return sum;
    */
};



// Uses fast, yet accurate cosine interpolation between points a and b. 
// Sample is the position of the sampling between 0 and 1, if sample is 0.0 then a is returned, 1.0 returns b
perlinNoise.prototype.cosineInterpolation = function(a, b, sample)
{
	var samplePi = sample * 3.1415927;
	var samplePosition = (1 - Math.cos(samplePi)) * 0.5;

	return  a*(1-samplePosition) + b*samplePosition;
};



//generates interpolated, smoothed noise for the point at x,y
perlinNoise.prototype.interpolateNoise = function(x, y)
{
      var integer_X = Math.floor(x); //all numbers in javascript are floats, no type casting involved!
      var fractional_X = x - integer_X;

      var integer_Y    = Math.floor(y);
      var fractional_Y = y - integer_Y;

      var point1 = this.smoothNoise(integer_X,     integer_Y);
      var point2 = this.smoothNoise(integer_X + 20, integer_Y);
      var point3 = this.smoothNoise(integer_X,     integer_Y + 20);
      var point4 = this.smoothNoise(integer_X + 20, integer_Y + 20);

      var i1 = this.cosineInterpolation(point1 , point2 , fractional_X);
      var i2 = this.cosineInterpolation(point3 , point4 , fractional_X);

      return this.cosineInterpolation(i1 , i2 , fractional_Y);
};



perlinNoise.prototype.perlinNoise = function(x, y)
{
      var total = 0;
      var persistence = 0.95;
      var numOctaves = 2; //number of octaves - 1

      var i; //jslint requires the declaration to be outside of the for statement

      for (i = 1; i < numOctaves; i++)
      { 
          frequency = Math.pow(2,i);
          amplitude = Math.pow(persistence,i);
          

          var octaveSum = this.interpolateNoise(x * frequency, y * frequency) * amplitude;
          total = total + octaveSum;
      }

      return total;
};

//end perlinNoise object implementation
