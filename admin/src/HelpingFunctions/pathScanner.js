
const PathScanner = (array) => {
    var url;
    var array = array;
    function Scanner(input, includeTokensInOutput, tokens) {
        this.input = input;
        this.includeTokensInOutput = includeTokensInOutput;
        this.tokens = tokens;
    }
    Scanner.prototype.scan = function () {
        var inp = this.input;
        var parse = [];
        this.tokens.sort(function (a, b) {
            return b.length - a.length; //ASC, For Descending order use: b - a
        });
      for (var i = 0; i < inp.length; i++) {
    for (var j = 0; j < this.tokens.length; j++) {
        var token = this.tokens[j];
        var len = token.length;
        if (len > 0 && i + len <= inp.length) {
            var portion = inp.substring(i, i + len);
            if (portion === token) {
                if (i !== 0) {//avoid empty spaces
                    parse[parse.length] = inp.substring(0, i);
                }
                if (this.includeTokensInOutput) {
                    parse[parse.length] = token;
                }
                inp = inp.substring(i + len);
                i = -1;
                break;
            }
        }
    }
    }
    if (inp.length > 0) {
      parse[parse.length] = inp;
    }
    return parse;
    };
      var path = new Scanner(array, true , new Array('/')).scan();
      console.log(path)
      
      const pathlastLength = path.length;
      const lastindexpath =  path[pathlastLength-1].length
      const secondlastindexpath =  path[pathlastLength-2]
      const thirdlastindexpath =  path[pathlastLength-3]
      const fourthlastIndex = path[pathlastLength-4]
      const fifthlastindex = path[pathlastLength-5]
      if(( lastindexpath === 24 &&  secondlastindexpath == '/' && fourthlastIndex === '/' && ( thirdlastindexpath === 'edit' ||  thirdlastindexpath === 'view')) && 
        ( fifthlastindex === 'blog' || fifthlastindex === 'category' || fifthlastindex === 'services' || fifthlastindex === 'cms' || fifthlastindex === 'coaches' 
        || fifthlastindex === 'schedular' || fifthlastindex === 'view' || fifthlastindex === 'coachmembership' 
        || fifthlastindex === 'membermembership'))
        {
            path[pathlastLength-1] = 'id';
            path[pathlastLength-2] = '/:';
            url = path.join('')
        } 
        console.log(lastindexpath,"lastindexpath")
        console.log(secondlastindexpath,"secondlastindexpath")
        console.log(thirdlastindexpath,"thirdlastindexpath")
        console.log(fourthlastIndex,"fourthlastIndex")
        console.log(fifthlastindex,"fifthlastindex")
        console.log(url,"url")

    return url;
}
export default PathScanner;