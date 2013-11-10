genColors = function(line){
    out = "";
    for(word in line.split(" ")){
        if(word in jsScheme){
            out += '<span style="' + jsStyles[jsScheme[word]] + '">' + word + '</span>';
        } else {
            out += word;
        }
        out += " ";
    }
    return out.substr(0, out.length-1);
}