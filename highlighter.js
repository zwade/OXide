genColors = function(line){
    //comments
    line = line.replace(new RegExp("//.*", "g"), function(match){return '<span style="' + jsStyles[jsScheme["linCom"]] + '">' + match + '</span>';});
    
    //strings
    line = line.replace(new RegExp('".[^"]*"?"', "g"), function(match){return '<span style="' + jsStyles[jsScheme["dqString"]] + '">' + match + '</span>';});
    
    line = line.replace(new RegExp("'.[^']*'?", "g"), function(match){return '<span style="' + jsStyles[jsScheme["sqString"]] + '">' + match + '</span>';});
    
    //all the rest
    for(keyword in jsScheme){
        line = line.replace(keyword, '<span style="' + jsStyles[jsScheme[keyword]] + '">' + keyword + '</span>');
    }
    return line
}
/**
    out = "";
    var tmp = line.split(" ");
    for(word in tmp){
        if(tmp[word] in jsScheme){
            out += '<span style="' + jsStyles[jsScheme[tmp[word]]] + '">' + tmp[word] + '</span>';
        } else {
            out += tmp[word];
        }
        out += " ";
    }
    return out.substr(0, out.length-1);
}**/
