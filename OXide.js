docs = new Meteor.Collection('docs')


if (Meteor.isClient) {
	Meteor.subscribe('users',function() {
		var url = location.href.split("//")[1].split("/")
	        var stuff = url[1].split("?")
	        var ext = stuff[0]
		Session.set('sid',ext)
									
		Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.active": ext}})
	})
	Meteor.subscribe('docs',function() {
		var url = location.href.split("//")[1].split("/")
		Session.set('domain',url[0])
		Session.set('window','people')
		var stuff = url[1].split("?")
		var ext = stuff[0]
		Session.set('sid',ext)
		if (!Session.get('sid')) {
			//console.log(Session.get('sid'))
			Session.set('edit','splash')
		} else if (stuff[1] && stuff[1]=='run') {
			Session.set('edit','run')
		} else if (stuff[1] && stuff[1]=='burn') {
			//console.log('huh')
			var id = docs.findOne({sid:Session.get('sid')})
			docs.update(id._id, {$set:{content:["main = function() {"],uid:Session.get('uid'),change:parseInt($(this).attr('num'))}})
		} else {
			Session.set('edit','edit')
		}
		var test = docs.findOne({sid:ext})
		if (!test) {
			docs.insert({sid:ext,content:["main = function() {"]})
		}
	})
	Template.filebrowser.people = function() {
		return Meteor.users.find({"profile.active":Session.get('sid')})
	}
	$(window).load(function() {
		$("#but").click(function() {
		        var win=window.open(Session.get('domain')+"/"+$("#newone").val(), '_blank');
			win.focus()
		})
		$(window).on("beforeunload",function() {
			Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.active": ""}})
		})
		$("#swap").click(function() {
			if (Session.get('window')=='people') {
				Session.set('window','console')
				$("#swap").html("Console")
				$("#logger").css("display","block")
				$("#friends").css("display","none")
			} else {
				Session.set('window','people')
				$("#swap").html("People")
				$("#logger").css("display","none")
				$("#friends").css("display","block")
			}
		})
		$("#chooseyourblade").change(function() {
			showColors()
		})
		$("#untab").click(function() {
			$("line").css("left","0px")
		})
		$("#tab").click(function() {
			if (!Session.get('locked')) {
				$("line").css("left","40px")
			}
		})
		$("#new").click(function() {
			console.log(Session.get('domain')+"/"+Math.floor(Math.random()*1000))
			var win=window.open(Session.get('domain')+"/"+Math.floor(Math.random()*10000), '_blank');
			win.focus();
		})
		$("#check").click(function() {
			var script = ""
                        var id = docs.findOne({sid:Session.get('sid')})
                        globalCache = id.content || []
                        for (i in globalCache) {
                                script+=globalCache[i]+"\n"
                        }
			alert("(ctr^c)\n"+script)
			var win=window.open("http://jshint.com", '_blank');
			win.focus();
		})
		$("#lock").click(function() {
			if (Session.get('locked')) {
				Session.set('locked',false)
			} else {
				Session.set('locked',true)
			}
			var tmp = $("line").toArray()
			for (i = 0; i < tmp.length; i++) {
				$($("line")[i]).attr('contenteditable',Session.get('locked'))
			}
		})
				
		$("#play").click(function() {
			run()
		})
		$("#tab").click(function() {
			//console.log(getSelection().getRangeAt(0))
		})
		console = new nConsole()
	})
	Meteor.autorun(function() {
		if (Session.get('edit')=='splash') {
			$(document.body).html(Template.splash())
		}
	})
	Meteor.autorun(function() {
		if (Session.get('sid') && Session.get('edit')=='edit') {
			//console.log('blah')
			var tmp = docs.findOne({sid:Session.get('sid')})
			Session.set('content',tmp.content)
			if (tmp.uid!=Session.get('uid')) {
				var lines = $("line")
				if (lines.length==tmp.content.length) {
					$(lines[tmp.change]).html(tmp.content[tmp.change])
					//console.log('yeah')
				} else if (lines.length+1==tmp.content.length) {
					appendLine(tmp.change,tmp.content[tmp.change],true)
					lineBind()
				/**
				} else if (lines.length-1==tmp.content.length) {
					removeLine(tmp.change)
					console.log('deleting line')
					lineBind()
				**/
				} else {
					$("#content").html("")
					for (i in tmp.content) {
						appendLine(i,tmp.content[i],true)
					}
					lineBind()
					showColors()
				}
				drawNums()
				
			}
		}
	})
	drawNums = function() {
		var tmp = $("#linenumbers")
		tmp.html("")
		for (i=0; i < Session.get('content').length; i++) {
			tmp.append("<div id=num"+i+" class='number'>"+(i+1)+"</div>")
		}
	}
	Template.header.sid = function() {
		return Session.get('sid')
	}
	Deps.autorun(function() {
		if (Session.get('sid') && Session.get('edit')=='edit') {
			var ln = []
			var tmp = docs.findOne({sid:Session.get('sid')})
			for (i = 0; i < tmp.content.length; i++) {
				ln.push(i)
			}
			//Session.set('linenumbers',ln)
		}
	})
	lineBind = function() {
		$("line").off()
		$("line").blur(function() {
			//console.log('blur')
			//moveCursor(Session.get('element'),Session.get('position'))
		})
		$("line").keyup(function(e) {
			if (e.keyCode!=13) {
				var id = docs.findOne({sid:Session.get('sid')})
				globalCache = id.content || []
				globalCache[parseInt($(this).attr('num'))] = parse($(this).text())
				docs.update(id._id, {$set:{content:globalCache,uid:Session.get('uid'),change:parseInt($(this).attr('num'))}})
			}
			if (e.keyCode == 8) {
				Session.set('bksphelp',true)
				//console.log('bksp up')
			}
			drawNums()
		})
		$("line").keydown(function(e) {
			Session.set("position",getSelection().getRangeAt(0).startOffset)
			Session.set("element",$(this).attr('id'))
			if (e.keyCode == 8 && Session.get('bksphelp')) {
				//console.log('bkspdown')
				Session.set('bksphelp',false)
				//console.log($(this))
				if (!$(this).text()) {
					//console.log("delete!")
					var el = removeLine(parseInt($(this).attr('num'))).focus().select()
					//console.log(el)
					var index = el.text().length
					moveCursor(el,index)
					e.preventDefault()
				}
			} else if (e.keyCode == 9) {
				var index = rangy.getSelection().getAllRanges()[0].startOffset+4
				insertTextAtCursor("    ",$(this));
				//console.log($(this))
				//console.log(index)
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
				///console.log('go')
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
			//console.log("anything")
			if (e.keyCode == 13) {
				appendLine(parseInt($(this).attr('num'))+1,"")
				$($("line")[parseInt($(this).attr('num'))+1]).focus().select()
				lineBind()
				showColors()
				//console.log('wat')
				e.preventDefault()
			}
            		//$(this).html(genColors($(this).text(),'js'));
		})
	}
    
    langBind = function(){
        $("select").mousedown(function(e){
            showColors();
        });
    }
    
	showColors = function() {
		var lin = $("line")
       	                 for (var l = 0; l<lin.length; l++) {
                         $(lin[l]).html(genColors($(lin[l]).text(),$("select").val()));
                }
	}

	/**
	getProperNode = function(el,index) {
		if (el.length) {
			if (el.length>index) {
				return [true,el,index]
			} else {
				return [false,el,index-el.length];
			}
		}
		if (!el.length) {
			for (i in el.childNodes) {
				tmp = getProperNode(el.childNodes[i],index)
				if (tmp[0]) {
					return [true,tmp[1],tmp[2]]
				} else {
					index = tmp[2]
				}
			}
			return [false,el,index]
		}
	}**/
	getProperNode = function(el,index) {
		if (el.length) {
			if (index < el.length) {
				return [el,index]
			} else {
				return [el,el.length]
			}
		} else {
			for (iter in el.childNodes) {
				var obj = el.childNodes[iter]
				if (obj.childNodes && obj.childNodes[0]) {
					obj = obj.childNodes[0]
				}
				if (obj.length>index) {
					return [obj,index]
				} else {
					index -= obj.length
				}
			}
			var tmp = el.childNodes
			return [tmp[tmp.length-1],tmp[tmp.length-1].length]
		}
	}
	moveCursor = function(el,index) {
		if (el[0].childNodes.length==0) {
			el.focus().select()
			return
		}
		var range = rangy.createRange();
		//console.log(el[0].childNodes)
		globr = el[0]
		tmp = getProperNode(el[0],index)
		//console.log("Node ->"+tmp)
		range.setStart(tmp[0], tmp[1]);
		range.collapse(true);
		var sel = rangy.getSelection();
		sel.setSingleRange(range);
	}
	removeLine = function(i) {
		$($("line")[i]).remove()
		var id = docs.findOne({sid:Session.get('sid')})
		globalCache = id.content || []
		globalCache.splice(i,1)
		docs.update(id._id, {$set:{content:globalCache,uid:Session.get('uid'),change:i}})
		var lin  = $("line").toArray()
		for (iter in lin) {
			$(lin[iter]).attr("num",iter)
			$(lin[iter]).attr("id","field"+iter)
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
		docs.update(id._id, {$set:{content:globalCache,uid:Session.get('uid'),change:i}})
		var lin  = $("line").toArray()
		for (iter in lin) {
			$(lin[iter]).attr("num",iter)
			$(lin[iter]).attr("id","field"+iter)
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
	run = function() {
		if (Session.get('sid')) {
			$("#logger").html("")
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
			//document.body.innerHTML = ""
			OXIDE_STARTUP()
			
		}
	}


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
		var sel, range, childNodeshtml;
		if (window.getSelection) {
			sel = window.getSelection();
			if (sel.getRangeAt && sel.rangeCount) {
				range = sel.getRangeAt(0);
				range.deleteContents();
				glob = range
				txt = range.commonAncestorContainer.textContent
				newtxt = txt.slice(0,range.startOffset)+text+txt.slice(range.startOffset,txt.length)
				if (!range) {
					//console.log("no range")
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
		$("#logger")[0].innerHTML+="<span class='out'>"+str+"</span><br>"

	}
	nConsole.prototype.error = function(str) {
		$("#logger")[0].innerHTML+="<span class='out'>"+str+"</span><br>"
	}

}
if (Meteor.isServer) {
	Meteor.startup(function () {
    // code to run on server at startup
  });
  Meteor.publish('docs',function() {
  	return docs.find()
  })
  Meteor.publish("users", function () {
      //You might want to alter this depending on what you want to send down
        return Meteor.users.find();
  });
}
