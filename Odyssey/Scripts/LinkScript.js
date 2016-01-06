$(function () {
	var path = window.location.pathname;
	$(document).click(function (e) {
		var target, query, args = {}, keyValuePair;
		target = e.target;
		if (target.nodeName !== "A") {
			return;
		}
		query = target.href.split("?");
		query = query && query[1];
		query = query.split("&");
		for (var i = 0, len = query.length; i < len; i += 1) {
			keyValuePair = query[i].split("=");
			args[keyValuePair[0]] = keyValuePair[1];
		}
		if (args.x && args.y && args.z) {
			tw.Odyssey.position.set(parseInt(args.x), parseInt(args.y), parseInt(args.z));
		}
		e.preventDefault();
	});
});