import Ember from 'ember';

const KIND_POST = 0;

export default Ember.Controller.extend({
  posts: Ember.computed("model.id", function() {
    const filter = {
      group: this.get("model.id"),
      kind: KIND_POST
    };

    return this.store.query("post", {
      filter: filter,
      page: { size: 5 },
      sort: "-published_at"
    });
  })
});
