import Ember from 'ember';

export default Ember.Route.extend({
	headTags: [{
		type: 'meta',
		tagId: 'meta-og-title',
		attrs: {
			property: 'og:title',
			content: 'Montreal Chinese Alliance Church'
		}
	}, {
		type: 'meta',
		tagId: 'meta-og-description',
		attrs: {
			property: 'og:description',
			content: "Listen to a sermon, read a bulletin, get involved. As a congregation, we believe because God loves us, we will love Jesus, love His people, and love the world, for Jesus' sake."
		}
	}, {
		type: 'meta',
		tagId: 'meta-og-image',
		attrs: {
			property: 'og:image',
			content: "https://mcac.s3.amazonaws.com/bulletins/3e22317c-3b06-40d1-82c9-3c8a0ef2c41c."
		}
	}, {
		type: 'meta',
		tagId: 'meta-og-url',
		attrs: {
			property: 'og:url',
			content: "https://mcac.church"
		}
	}, {
		type: 'link',
		tagId: 'canonical-link',
		attrs: {
			rel: 'canonical',
			content: 'https://mcac.church'
		}
	}]
});
