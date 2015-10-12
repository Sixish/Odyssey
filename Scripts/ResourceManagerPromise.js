function ResourceManagerPromise() {
	this.queue = [];
	this.events = {};
}
ResourceManagerPromise.prototype.addEventListener = function (eventName, fn) {
	if (!this.events.hasOwnProperty(eventName)) {
		this.events[eventName] = [];
	}
	this.events[eventName].push(fn);
};
ResourceManagerPromise.prototype.fire = function (e) {
	var i, events = this.events[e], len;
	if (events !== undefined) {
		for (i = 0, len = events.length; i < len; i += 1) {
			events[i]();
		}
	}
};
