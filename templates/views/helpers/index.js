var keystone = require('keystone');
var moment = require('moment');

module.exports = function() {
	var _helpers = {};

	_helpers.formatDate = function(date, format) {
		return moment(date).format(format);
	};

	_helpers.formatCurrentDate = function(date, format, isHome) {
		return (isHome ? 'Today' : _helpers.formatDate(date, format));
	};

	_helpers.getNavUrl = function(date) {
		var today = moment.tz('America/Vancouver').startOf('d').format('YYYY-MM-DD');
		return ((date === today) ? '/home' : '/archives/' + date);
	};

    _helpers.formatAuthor = function(author) {
        return 'by ' + author;
    };

	return _helpers;
};
