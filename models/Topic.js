var keystone = require('keystone'),
	Types = keystone.Field.Types;

// model
var Topic = new keystone.List('Topic', {
	track: true,
	autokey: {
		path: 'slug',
		from: 'headline',
		unique: true
	},
	map: { name: 'headline' },
	defaultColumns: 'headline|60%, publish|20%, createdBy|20%',
	defaultSort: '-publish'
});
Topic.add({
	headline: {
		type: Types.Text,
		initial: true,
		required: true,
		index: true
	},
	blurb: {
		type: Types.Textarea,
		initial: true,
		required: true
	},
	publish: {
		type: Types.Date,
		initial: true,
		required: true,
		index: true
	}
});

Topic.register();
