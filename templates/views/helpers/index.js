var keystone = require('keystone');
//var handlebars = require('handlebars');
var moment = require('moment-timezone');

module.exports = function() {
	var _helpers = {};

	_helpers.formatDate = function(date, format) {
		return moment(date).format(format);
	};

	_helpers.formatCurrentDate = function(date, format, isHome) {
		return (isHome ? 'Today\'s Catch' : _helpers.formatDate(date, format));
	};

	_helpers.getNavUrl = function(date) {
		var config = keystone.app.locals.config;
		var today = moment.tz(config.timezone).startOf('d').format(config.dateFormat);
		return ((date === today) ? config.homePath : '/archives/' + date);
	};

	_helpers.formatAuthor = function(author) {
		if(!author) {
			return '';
		} else if (author.charAt(0) === '@') {
			return '<a href="https://twitter.com/' + author.substring(1) + '" target="_blank">' + author + '</a>';
		} else {
			return author;
		}
	};

	_helpers.outputScriptVars = function(scriptVars) {
		return '<script>var scriptVars = ' + JSON.stringify(scriptVars) + '</script>';
	};

	return _helpers;
};
