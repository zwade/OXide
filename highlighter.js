genColors = function(line){
    //all the things
    matchRegexStr = '(//.*)|(".[^"]*"?")|(\'.[^\']*\'?)|';
    
    for(keyword in jsScheme){
        matchRegexStr += "(\\b" + keyword + "\\b)|";
    }
    
    line = line.replace(new RegExp(matchRegexStr.substr(0, matchRegexStr.length-1), "g"), function(match){
        if(match == ""){
            return "";
        }
        if(match.charAt(0) == "'"){
            return '<span style="' + jsStyles[jsScheme["sqString"]] + '">' + match + '</span>';
        }
        if(match.charAt(0) == '"'){
            return '<span style="' + jsStyles[jsScheme["dqString"]] + '">' + match + '</span>';
        }
        if(match.charAt(0) == "/"){
            return '<span style="' + jsStyles[jsScheme["linCom"]] + '">' + match + '</span>';
        }
        return '<span style="' + jsStyles[jsScheme[match]] + '">' + match + '</span>';
    });
    
    return line;
}
