var Algorithm = function(){
    this.format_code = "";
    this.cont_id = 1;
}; 

var Challenge = function(){
    //this.last = 0;
    var alg = new Algorithm();
    this.algs = [alg];
};

Challenge.prototype.addAlg = function(){  
    //this.last++;
    //var nalg = Algorithm();
    //this.alg[this.last] = nalg;
    var nalg = new Algorithm();
    this.alg.push(nalg);
}
Challenge.prototype.getLastAlg = function(){  
    //return this.algs[this.last];
    return this.algs[this.algs.length - 1];
}