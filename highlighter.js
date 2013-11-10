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

matchRegexStr = '(//.*)|(".[^"]*"?")|(\'.[^\']*\'?)|';
    
for(keyword in j7Scheme){
    keyword = keyword.replace(/\+|\*|\||\^|\?/g, function(match){return "\\" + match;});
    if(/[a-z]/.test(keyword)){
        matchRegexStr += "(\\b" + keyword + "\\b)|";
    } else {
        matchRegexStr += "(" + keyword + ")|";
    }
}

j7Reg = new RegExp(matchRegexStr, "g");

matchRegexStr = '(//.*)|(".[^"]*"?")|(\'.[^\']*\'?)|';
    
for(keyword in cpScheme){
    keyword = keyword.replace(/\+|\*|\||\^|\?/g, function(match){return "\\" + match;});
    if(/[a-z]/.test(keyword)){
        matchRegexStr += "(\\b" + keyword + "\\b)|";
    } else {
        matchRegexStr += "(" + keyword + ")|";
    }
}

cpReg = new RegExp(matchRegexStr, "g");

matchRegexStr = '(//.*)|(".[^"]*"?")|(\'.[^\']*\'?)|';
    
for(keyword in ccScheme){
    keyword = keyword.replace(/\+|\*|\||\^|\?/g, function(match){return "\\" + match;});
    if(/[a-z]/.test(keyword)){
        matchRegexStr += "(\\b" + keyword + "\\b)|";
    } else {
        matchRegexStr += "(" + keyword + ")|";
    }
}

ccReg = new RegExp(matchRegexStr, "g");

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

commentDelimiters = {
    "js":"/",
    "py":"#",
    "j7":"/",
    "cp":"/",
    "cc":"/"
};

genColors = function(line, lang){
    line = line.replace(window[lang + "Reg"], function(match){
        if(match == ""){
            return "";
        }
        if(match.charAt(0) == "'"){
            return '<span style="' + window[lang + "Styles"][window[lang + "Scheme"]["sqString"]] + '">' + match + '</span>';
        }
        if(match.charAt(0) == '"'){
            return '<span style="' + window[lang + "Styles"][window[lang + "Scheme"]["dqString"]] + '">' + match + '</span>';
        }
        if(match.charAt(0) == commentDelimiters[lang]){
            return '<span style="' + window[lang + "Styles"][window[lang + "Scheme"]["linCom"]] + '">' + match + '</span>';
        }
        return '<span style="' + window[lang + "Styles"][window[lang + "Scheme"][match]] + '">' + match + '</span>';
    });
    
    return line;
}
