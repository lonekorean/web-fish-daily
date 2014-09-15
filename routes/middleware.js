exports.initLocals = function(req, res, next) {
	res.locals.scriptVars = {};
	return next();
};

exports.requireUser = function(req, res, next) {
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else {
		return next();
	}
};
