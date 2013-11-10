docs = new Meteor.Collection('docs')

if (Meteor.isClient) {
	Meteor.subscribe('docs',function() {
		var url = location.href.split("//")[1].split("/")
		var stuff = url[1].split("?")
		var ext = stuff[0]
		if (stuff[1] && stuff[1]=='run') {
			Session.set('edit','run')
		} else {
			Session.set('edit','edit')
		}
		Session.set('sid',ext);
		var test = docs.findOne({sid:ext})
		if (!test) {
			docs.insert({sid:ext,content:[""]})
		}
	})
	/**
	Template.pad.content = function() {
		return Session.get('content')
	}**/
	Meteor.autorun(function() {
		if (Session.get('sid') && Session.get('edit')=='edit') {
			var tmp = docs.findOne({sid:Session.get('sid')})
			if (tmp.uid!=Session.get('uid')) {
				var lines = $("line")
				if (lines.length==tmp.content.length) {
					$(lines[tmp.change]).html(tmp.content[tmp.change])
					//console.log('yeah')
				} else {
					$("#content").html("")
					for (i in tmp.content) {
						appendLine(i,tmp.content[i],true)
					}
					lineBind()
				}
				
			}

		}
	})
	genColors = function(str) {
		return str
	}
	lineBind = function() {
		$("line").off()
		$("line").keyup(function(e) {
			if (e.keyCode!=13) {
				colors = genColors($(this).html())
				//$(this).html(colors)
				var id = docs.findOne({sid:Session.get('sid')})
				globalCache = id.content || []
				globalCache[parseInt($(this).attr('num'))] = parse($(this).html())
				docs.update(id._id, {$set:{content:globalCache,uid:Session.get('uid'),change:parseInt($(this).attr('num'))}})
			}
		})
		$("line").keydown(function(e) {
			if (e.keyCode == 8) {
				//console.log($(this))
				if (!$(this).html()) {
					//console.log("delete!")
					var el = removeLine(parseInt($(this).attr('num'))).focus().select()
					console.log(el)
					var index = el.html().length
					moveCursor(el,index)
					e.preventDefault()
				}
			} else if (e.keyCode == 9) {
				var index = rangy.getSelection().getAllRanges()[0].startOffset+4
				insertTextAtCursor("    ",$(this));
				console.log($(this))
				console.log(index)
				moveCursor($(this),index)
				e.preventDefault()
				
			} else if (e.keyCode==38) {
				var elem = parseInt($(this).attr('num'))
				var position = getSelection().getRangeAt(0).startOffset
				if (elem<=0) {
					return
				}
				var newe = $("#field"+(elem-1))
				moveCursor(newe,Math.min(position,newe.text().length))
				e.preventDefault()
			} else if (e.keyCode==40) {
				console.log('go')
				var elem = parseInt($(this).attr('num'))
				var position = getSelection().getRangeAt(0).startOffset
				if (elem>=$("#content")[0].childNodes.length-1) {
					return
				}
				var newe = $("#field"+(elem+1))
				moveCursor(newe,Math.min(position,newe.text().length))
				e.preventDefault()
			}

		})
		$("line").keypress(function(e) {
			console.log("anything")
			if (e.keyCode == 13) {
				appendLine(parseInt($(this).attr('num'))+1,"")
				$($("line")[parseInt($(this).attr('num'))+1]).focus().select()
				lineBind()
				e.preventDefault()
			}
		})
	}
	moveCursor = function(el,index) {
		if (el[0].childNodes.length==0) {
			el.focus().select()
			return
		}
		var range = rangy.createRange();
		globr = el[0]
		range.setStart(el[0].childNodes[0], index);
		range.collapse(true);
		var sel = rangy.getSelection();
		sel.setSingleRange(range);
	}
	removeLine = function(i) {
		$($("line")[i]).remove()
		var id = docs.findOne({sid:Session.get('sid')})
		globalCache = id.content || []
		globalCache.splice(i,1)
		docs.update(id._id, {$set:{content:globalCache,uid:Session.get('uid'),change:'*'}})
		var lin  = $("line").toArray()
		for (iter in lin) {
			$(lin[iter]).attr("num",iter)
		}
		return $($("line")[i-1])
	}
	appendLine = function(i,content,notdo) {
		$("#content").insertAt(i,"<line style='width:100%;height:100%' contenteditable id='field"+i+"' num='"+i+"'>"+content+"</line>")
		var id = docs.findOne({sid:Session.get('sid')})
		globalCache = id.content || []
		//console.log(globalCache)
		if (!notdo) {
			globalCache.splice(i,0,"")
		}
		docs.update(id._id, {$set:{content:globalCache,uid:Session.get('uid'),change:'*'}})
		var lin  = $("line").toArray()
		for (iter in lin) {
			$(lin[iter]).attr("num",iter)
		}
		return $("#field"+i)
	}
		
	parse = function(html) {
		rep = {"&gt;":">","&lt;":"<","&amp;":"&","&nbsp;":" "}
		for (i in rep) {
			html = html.split(i).join(rep[i])
		}
		return html
	}
	Meteor.startup(function() {
    		var d = new Date()
		Session.set('uid',Math.floor(d.getTime()*Math.random()))
		$.fn.insertAt = function(index, element) {
			var lastIndex = this.children().size()
			if (index < 0) {
				index = Math.max(0, lastIndex + 1 + index)
			}
			this.append(element)
			if (index < lastIndex) {
				this.children().eq(index).before(this.children().last())
			}
			return this;
		}

	})
	Meteor.autorun(function() {
		if (Session.get('edit')=='run' && !Session.get('hasrun') && Session.get('sid')) {
			Session.set('hasrun',true)
			script = ""
			var id = docs.findOne({sid:Session.get('sid')})
			globalCache = id.content || []
			for (i in globalCache) {
				script+=globalCache[i]+"\n"
			}
			script = "<script>\nOXIDE_STARTUP = function() {"+script+"}\n</script>"
			//console.log(script)
			$(document).append(script)
			document.body.innerHTML = ""
			console = new nConsole()
			OXIDE_STARTUP()
			
		}
	})


	setCursor = function(node,pos){
		var node = (typeof node == "string" || node instanceof String) ? document.getElementById(node) : node;
		if(!node){
			return false;
		}else if(node.createTextRange){
			var textRange = node.createTextRange();
			textRange.collapse(true);
			textRange.moveEnd(pos);
			textRange.moveStart(pos);
			textRange.select();
			return true;
		}else if(node.setSelectionRange){
			node.setSelectionRange(pos,pos);
			return true;
		}
		return false;
	}

	insertTextAtCursor = function(text,parentE) {
		var sel, range, html;
		if (window.getSelection) {
			sel = window.getSelection();
			if (sel.getRangeAt && sel.rangeCount) {
				range = sel.getRangeAt(0);
				range.deleteContents();
				glob = range
				txt = range.commonAncestorContainer.textContent
				newtxt = txt.slice(0,range.startOffset)+text+txt.slice(range.startOffset,txt.length)
				if (!range) {
					console.log("no range")
				}
				
				globa = parentE.html(newtxt)
			}
		} else if (document.selection && document.selection.createRange) {
			document.selection.createRange().text = text;
		}
	}
	nConsole = function() {
	}
	nConsole.prototype.log = function(str) {
		document.body.innerHTML+="<span class='out'>"+str+"</span><br>"

	}
}
if (Meteor.isServer) {
	Meteor.startup(function () {
    // code to run on server at startup
  });
  Meteor.publish('docs',function() {
  	return docs.find()
  })
}
