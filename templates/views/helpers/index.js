var moment = require('moment');

module.exports = function() {
	var _helpers = {};

	_helpers.formatDate = function(date, format) {
		return moment(date).format(format);
	};

    _helpers.formatAuthor = function(author) {
        return 'by ' + author;
    };

	return _helpers;
};
