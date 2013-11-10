matchRegexStr = '(//.*)|(".[^"]*"?")|(\'.[^\']*\'?)|';
    
for(keyword in jsScheme){
    keyword = keyword.replace(/\+|\*|\||\^|\?/g, function(match){return "\\" + match;});
    if(/[a-z]/.test(keyword)){
        matchRegexStr += "(\\b" + keyword + "\\b)|";
    } else {
        matchRegexStr += "(" + keyword + ")|";
    }
}

jsReg = new RegExp(matchRegexStr, "g");

matchRegexStr = '(#.*)|(".[^"]*"?")|(\'.[^\']*\'?)|';
    
for(keyword in pyScheme){
    keyword = keyword.replace(/\+|\*|\||\^|\?/g, function(match){return "\\" + match;});
    if(/[a-z]/.test(keyword)){
        matchRegexStr += "(\\b" + keyword + "\\b)|";
    } else {
        matchRegexStr += "(" + keyword + ")|";
    }
}

pyReg = new RegExp(matchRegexStr, "g");

regex = {
    "js":jsReg,
    "py":pyReg
};

schema = {
    "js":jsScheme,
    "py":pyScheme
};

styles = {
    "js":jsStyles,
    "py":pyStyles
};

commentDelimiters = {
    "js":"/",
    "py":"#"
};

genColors = function(line, lang){
    line = line.replace(regex[lang], function(match){
        if(match == ""){
            return "";
        }
        if(match.charAt(0) == "'"){
            return '<span style="' + styles[lang][schema[lang]["sqString"]] + '">' + match + '</span>';
        }
        if(match.charAt(0) == '"'){
            return '<span style="' + styles[lang][schema[lang]["dqString"]] + '">' + match + '</span>';
        }
        if(match.charAt(0) == commentDelimiters[lang]){
            return '<span style="' + styles[lang][schema[lang]["linCom"]] + '">' + match + '</span>';
        }
        return '<span style="' + styles[lang][schema[lang][match]] + '">' + match + '</span>';
    });
    
    return line;
}
