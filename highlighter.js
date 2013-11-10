matchRegexStr = '(//.*)|(".[^"]*"?")|(\'.[^\']*\'?)|';
    
for(keyword in jsScheme){
    keyword = keyword.replace(/\+|\*|\||\^|\?/g, function(match){return "\\" + match;});
    if(/[a-z]/.test(keyword)){
        matchRegexStr += "(\\b" + keyword + "\\b)|";
    } else {
        matchRegexStr += "(" + keyword + ")|";
    }
}

matchRegexStr = matchRegexStr.substr(0, matchRegexStr.length-1);

genColors = function(line){
    line = line.replace(new RegExp(matchRegexStr, "g"), function(match){
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
