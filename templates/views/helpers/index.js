var keystone = require('keystone');
//var handlebars = require('handlebars');
var moment = require('moment-timezone');

module.exports = function() {
	var _helpers = {};

	_helpers.getTitle = function(title) {
		var config = keystone.app.locals.config;
		return config.siteName + (title ? ' - ' + title : '');
	};

	_helpers.getDescription = function() {
		var config = keystone.app.locals.config;
		return config.siteDescription;
	};

	_helpers.formatDate = function(date, format) {
		return moment(date).format(format);
	};

	_helpers.formatCurrentDate = function(date, format, isHome) {
		return (isHome ? 'Today\'s Catch' : _helpers.formatDate(date, format));
	};

	_helpers.getNavUrl = function(date) {
		var config = keystone.app.locals.config;
		var today = moment.tz(config.timezone).startOf('d').format(config.dateFormat);
		return ((date === today) ? '/' : '/archives/' + date);
	};

	_helpers.linkAuthor = function(author) {
		author = author || '';
		author = author.replace(/@(\w+)/g, '<a href="https://twitter.com/$1" target="_blank">@$1</a>');
		return author;
	};

	_helpers.outputScriptVars = function(scriptVars) {
		return '<script>var scriptVars = ' + JSON.stringify(scriptVars) + '</script>';
	};

	return _helpers;
};
