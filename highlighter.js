genColors = function(line){
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
}
