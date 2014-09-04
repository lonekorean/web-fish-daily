var keystone = require('keystone'),
	Types = keystone.Field.Types;

// model
var Link = new keystone.List('Link', {
	track: true,
	autokey: {
		path: 'slug',
		from: 'text',
		unique: true
	},
	map: { name: 'text' },
	defaultColumns: 'text, publishOn, createdBy',
	defaultSort: '-publishOn'
});
Link.add({
	text: {
		type: Types.Text,
		initial: true,
		required: true,
		index: true,
	},
	url: {
		type: Types.Url,
		initial: true,
		required: true
	},
	author: {
		type: Types.Text,
		initial: true,
		required: true,
		index: true,
	},
	blurb: {
		type: Types.Textarea,
		initial: true,
		required: true
	},
	category: {
		type: Types.Select,
		options: 'article, demo, discussion, media, rtfm, utility',
		initial: true,
		required: true,
		index: true
	},
	publishOn: {
		type: Types.Date,
		initial: true,
		required: true,
		index: true
	}
});

Link.register();
