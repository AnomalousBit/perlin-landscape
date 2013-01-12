
// perlinNoise is an object for building 3 dimensional perlin-based noise
//
// it comes complete with seeded random number generator needed to reproduce random
// values when provided the same argument
//
// requires: seedrandom.js  (http://davidbau.com/encode/seedrandom.js)

function perlinNoise()
{
    // noise profile & controls
    this.maxAmplitude = 240; // the largest number returned by generateNoise()
    this.wholeNumberSpace = 1000000000; //the largest number in the pool of numbers used to modulo maxAmplitude
    this.gridUnit = 20; //the equidistant space between each x and y grid unit, used for smoothing and interpolating


    // used for dynamic number generation
    this.dateObject = new Date();

    // used to generate a new seed everytime the page is loaded
    // if it changes, calls made to generateNoise() will not return the same value
    this.seedSalt = this.dateObject.getTime(); 
}



// this method is used to produce a random value based on a particular vertex
// on a two dimensional cartesian plane
perlinNoise.prototype.generateNoise = function(x, y)
{
    Math.seedrandom((x * 0.000007) + (y * 1000) + this.seedSalt);
    var randomFloat = Math.random() * this.wholeNumberSpace % this.maxAmplitude;

    return randomFloat;
};



perlinNoise.prototype.smoothNoise = function(x, y)
{
    var points = []; //declare an empty array, jslint insists on this syntax

    points.push(this.generateNoise(x-this.gridUnit, y+this.gridUnit)); //top left
    points.push(this.generateNoise(x              , y+this.gridUnit)); //top middle
    points.push(this.generateNoise(x+this.gridUnit, y+this.gridUnit)); //top right
    points.push(this.generateNoise(x-this.gridUnit, y              )); //middle left
    points.push(this.generateNoise(x              , y              )); //center
    points.push(this.generateNoise(x+this.gridUnit, y              )); //middle right
    points.push(this.generateNoise(x-this.gridUnit, y-this.gridUnit)); //bottom left
    points.push(this.generateNoise(x              , y-this.gridUnit)); //bottom middle
    points.push(this.generateNoise(x+this.gridUnit, y-this.gridUnit)); //bottom right

    var sum = 0.0;

    var i = 0;
    for (i = 0; i < points.length; i++)
    { sum = sum + points[i]; }

    return sum / 9.0;
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
      var point2 = this.smoothNoise(integer_X + 1, integer_Y);
      var point3 = this.smoothNoise(integer_X,     integer_Y + 1);
      var point4 = this.smoothNoise(integer_X + 1, integer_Y + 1);

      var i1 = this.cosineInterpolation(point1 , point2 , fractional_X);
      var i2 = this.cosineInterpolation(point3 , point4 , fractional_X);

      return this.cosineInterpolation(i1 , i2 , fractional_Y);
};



perlinNoise.prototype.perlinNoise = function(x, y)
{
      var total = 0;
      var persistence = 0.1;
      var numOctaves = 5; //number of octaves, 0 inclusive

      var frequency = 0;
      var amplitude = 0;

      var i; //jslint requires the declaration to be outside of the for statement
      for (i = 0; i < numOctaves; i++)
      { 
          frequency = 4 * i;
          amplitude = persistence * i;

          total = total + this.interpolateNoise(x * frequency, y * frequency) * amplitude;
      }

      return total;
};


//end perlinNoise object implementation
