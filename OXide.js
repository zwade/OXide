docs = new Meteor.Collection('docs')

if (Meteor.isClient) {
	$(window).load(function() {
		var url = location.href.split("//")[1].split("/")
		var ext = url[1]
		Session.set('sid',ext);
		var test = docs.findOne({sid:ext})
		if (!test) {
			docs.insert({sid:ext})
		}
	})
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
