var keystone = require('keystone'),
	Types = keystone.Field.Types;

// model
var LinkCategory = new keystone.List('LinkCategory', {
	track: true,
	autokey: {
		path: 'slug',
		from: 'name',
		unique: true
	},
	map: { name: 'name' },
	defaultColumns: 'name|20%, description|80%',
	defaultSort: 'name'
});
LinkCategory.add({
	name: {
		type: Types.Text,
		initial: true,
		required: true,
		index: true
	},
	description: {
		type: Types.Textarea,
		initial: true,
		required: true
	},
	icon: {
		type: Types.Text,
		initial: true,
		required: true
	}
});

LinkCategory.register();
