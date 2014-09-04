var keystone = require('keystone'),
	Types = keystone.Field.Types;

// model
var User = new keystone.List('User', {
	track: true,
	autokey: {
		path: 'slug',
		from: 'name',
		unique: true
	},
	map: { name: 'name' },
	defaultColumns: 'name, email',
	defaultSort: 'name'
});
User.add({
	name: {
		type: Types.Name,
		initial: true,
		required: true,
		index: true
	},
	email: {
		type: Types.Email,
		initial: true,
		required: true,
		index: true
	},
	password: {
		type: Types.Password,
		initial: true,
		required: true
	}
});

// access to keystone
User.schema.virtual('canAccessKeystone').get(function() {
	return true;
});

User.register();
