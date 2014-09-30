exports.initLocals = function(req, res, next) {
	res.locals.isProd = !!process.env.OPENSHIFT_APP_NAME;
	res.locals.isSignedIn = !!req.user;
	res.locals.scriptVars = {};
	return next();
};

exports.initErrorHandler = function(req, res, next) {
	res.handleError = function(statusCode, message, err) {
		if (err) {
			console.log(err);
		}

		res.status(statusCode).render('error', {
			message: message
		});
	};

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
