genColors = function(line){
    //comments
    line.replace(new RegExp("//.*", "g"), function(match){return '<span style="' + jsStyles[jsScheme["linCom"]] + '">' + match + '</span>';});
    
    //strings
    line.replace(new RegExp('".[^"]*"?"', "g"), function(match){return '<span style="' + jsStyles[jsScheme["dqString"]] + '">' + match + '</span>';});
    
    line.replace(new RegExp("'.[^']*'?", "g"), function(match){return '<span style="' + jsStyles[jsScheme["sqString"]] + '">' + match + '</span>';});
    
    //all the rest
    for(keyword in jsScheme){
        line.replace(keyword, '<span style="' + jsStyles[jsScheme[keyword]] + '">' + keyword + '</span>');
    }
}