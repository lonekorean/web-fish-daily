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
	defaultColumns: 'title|60%, publish|20%, createdBy|20%',
	defaultSort: '-publish'
});
Link.add({
	title: {
		type: Types.Text,
		initial: true,
		required: true,
		index: true
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
		index: true
	},
	blurb: {
		type: Types.Textarea,
		initial: true,
		required: true
	},
	category: {
		type: Types.Select,
		options: 'article, audio/video, demo, discussion, reference, slides, tool, tutorial, showcase',
		initial: true,
		required: true,
		index: true
	},
	publish: {
		type: Types.Date,
		initial: true,
		required: true,
		index: true
	}
});

Link.register();
