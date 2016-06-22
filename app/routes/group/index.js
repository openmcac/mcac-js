import Ember from 'ember';

const KIND_POST = 0;

export default Ember.Route.extend({
  model() {
    const group = this.modelFor("group");

    const filter = {
      group: group.get("id"),
      kind: KIND_POST
    };

    const posts = this.store.query("post", {
      filter: filter,
      page: { size: 5 },
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
