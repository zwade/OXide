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
					console.log('yeah')
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
	lineBind = function() {
		$("line").off()
		$("line").keyup(function(e) {
			if (e.keyCode!=13) {
				var id = docs.findOne({sid:Session.get('sid')})
				globalCache = id.content || []
				globalCache[parseInt($(this).attr('num'))] = parse($(this).html())
				docs.update(id._id, {$set:{content:globalCache,uid:Session.get('uid'),change:parseInt($(this).attr('num'))}})
			}
		})
		$("line").keydown(function(e) {
			if (e.keyCode == 8) {
				console.log($(this))
				if (!$(this).html()) {
					console.log("delete!")
					removeLine(parseInt($(this).attr('num'))).focus().select(),1000
					window.getSelection().addRange(2)
					e.preventDefault()
				}
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
		console.log(globalCache)
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
			console.log(script)
			$(document).append(script)
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
	}
	nConsole = function() {
	}
	nConsole.prototype.log = function(str) {
		document.body.innerHTML+=str+"<br>"

	}

if (Meteor.isServer) {
	Meteor.startup(function () {
    // code to run on server at startup
  });
  Meteor.publish('docs',function() {
  	return docs.find()
  })
}
