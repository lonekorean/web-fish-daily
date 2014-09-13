var keystone = require('keystone');
var moment = require('moment-timezone');

module.exports = function() {
	var _helpers = {};

	// config isn't available when this helper object is created
	// wrapping in an anonymous function solves this timing issue
	var config = function() { return keystone.app.locals.config; };

	_helpers.formatDate = function(date, format) {
		return moment(date).format(format);
	};

	_helpers.formatCurrentDate = function(date, format, isHome) {
		return (isHome ? 'Today' : _helpers.formatDate(date, format));
	};

	_helpers.getNavUrl = function(date) {
		var today = moment.tz(config.timezone).startOf('d').format(config.dateFormat);
		return ((date === today) ? config.homePath : '/archives/' + date);
	};

    _helpers.formatAuthor = function(author) {
        return 'by ' + author;
    };

	return _helpers;
};
