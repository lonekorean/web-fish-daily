var keystone = require('keystone'),
	Types = keystone.Field.Types;

// model
var Link = new keystone.List('Link', {
	track: true,
	autokey: {
		path: 'slug',
		from: 'title',
		unique: true
	},
	map: { name: 'title' },
	defaultColumns: 'title|55%, priority|15%, publish|15%, createdBy|15%',
	defaultSort: '-publish'
});
Link.add({
	title: {
		type: Types.Text,
		initial: true,
		required: true
	},
	url: {
		type: Types.Url,
		initial: true,
		required: true
	},
	author: {
		type: Types.Text,
		initial: true,
		required: true
	},
	blurb: {
		type: Types.Textarea,
		initial: true,
		required: true
	},
	category: {
		type: Types.Relationship,
		ref: 'LinkCategory',
		initial: true,
		required: true,
		index: true
	},
	publish: {
		type: Types.Date,
		initial: true,
		required: true,
		index: true
	},
	priority: {
		type: Types.Number,
		initial: true
	}
});

Link.register();
