import Ember from 'ember';
import Pagination from 'ember-cli-jsonapi-pagination/mixins/routes/jsonapi-pagination';
import headTags from 'mcac/utils/head-tags/group/index';

const KIND_POST = 0;

export default Ember.Route.extend(Pagination, {
  headTags: function() {
    return headTags(this.modelFor(this.routeName).group, this.router);
  },
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
  }
});
