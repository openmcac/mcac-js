import Ember from "ember";

export default Ember.Controller.extend({
  actions: {
    save: function () {
      var _this = this;

      Pace.restart();
      _this.get("model").save().then(function(post) {
        Pace.stop();
        _this.transitionToRoute("group.post.edit", post.group.slug, post);
      });
    }
  }
});
