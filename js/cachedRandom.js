
//create CachedRandom object
function CachedRandom()
{ 
    //create member properties
    this.cache = Array();
}





CachedRandom.prototype.isCached = function (x, y)
{
    if (this.cache[x] == null)
    { return false; }

    if (this.cache[x][y] == null)
    { return false; }

    return true;
}



//create member functions
CachedRandom.prototype.Random = function (x, y)
{
    if (this.isCached(x, y))
    { return this.cache[x][y]; }

    //the request is not cached, we must generate the random number, put it in the cache and return it...
    
    if (this.cache[x] == null)
    {
        this.cache[x] = Array();
        this.cache[x][y] = Math.random();
        return this.cache[x][y];
    }


    if (this.cache[x][y] == null)
    {
        this.cache[x][y] = Math.random();
        return this.cache[x][y];
    }

    console.log("ERROR: Panic! The cache is either corrupt or something has gone terribly wrong in CachedRandom.Random()");
}



CachedRandom.prototype.isCached3 = function (x, y, z)
{
    if (this.cache[x] == null)
    { return false; }

    if (this.cache[x][y] == null)
    { return false; }

    if (this.cache[x][y][z] == null)
    { return false; }

    return true;
}



//create member functions
CachedRandom.prototype.Random3 = function (x, y, z)
{
    if (this.isCached(x, y, z))
    { return this.cache[x][y][z]; }


    if (this.cache[x] == null)
    {
        this.cache[x] = Array();
        this.cache[x][y] = Array();
        this.cache[x][y][z] = Math.random();
        return this.cache[x][y][z];
    }


    if (this.cache[x][y] == null)
    {
        this.cache[x][y] = Array();
        this.cache[x][y][z] = Math.random();
        return this.cache[x][y][z];
    }


    if (this.cache[x][y][z] == null)
    {
        this.cache[x][y][z] = Math.random();
        return this.cache[x][y][z];
    }

    console.log("ERROR: Panic! The cache is either corrupt or something has gone terribly wrong in CachedRandom.Random()");
}
