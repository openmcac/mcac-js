import Ember from "ember";

export default Ember.Controller.extend({
  actions: {
    save() {
      Pace.restart();
      this.get("model").save().then((post) => {
        Pace.stop();
        this.transitionToRoute("group.post.edit", post.group.slug, post);
      });
    }
  }
});
