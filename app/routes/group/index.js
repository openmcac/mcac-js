import Ember from 'ember';
import Pagination from 'ember-cli-jsonapi-pagination/mixins/routes/jsonapi-pagination';

const KIND_POST = 0;

export default Ember.Route.extend(Pagination, {
  model(params) {
    const group = this.modelFor("group");

    const filter = {
      group: group.get("id"),
      kind: KIND_POST
    };

    const posts = this.queryPaginated("post", {
      filter: filter,
      size: params.size,
      number: params.number,
      sort: "-published_at"
    });

    return Ember.RSVP.hash({
      group: group,
      posts: posts
    });
  },
  titleToken(model) {
    return model.group.get("name");
  },
  setupController(controller, model) {
    controller.set("posts", model.posts);
    controller.set("group", model.group);
  },
	headTags() {
    const model = this.modelFor(this.routeName);

    return [{
      type: 'meta',
      tagId: 'meta-og-title',
      attrs: {
        property: 'og:title',
        content: `${model.group.get("name")} | Montreal Chinese Alliance Church`
      }
    }, {
      type: 'meta',
      tagId: 'meta-og-description',
      attrs: {
        property: 'og:description',
        content: `${model.group.get("shortDescription")}`
      }
    }, {
      type: 'meta',
      tagId: 'meta-og-image',
      attrs: {
        property: 'og:image',
        content: `https://res.cloudinary.com/fisherhall/image/fetch/w_1200,h_630,c_pad,b_white/${model.group.get("bannerUrl")}`
      }
    }];
  }
});
