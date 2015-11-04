import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  actions: {
    onPost: function() {
      let group = this.get("group");
      let store = this.get("store");
      let post = store.createRecord("post", {
        title: "test post",
        content: this.get("content"),
        group: group,
        publishedAt: new Date()
      });

      post.save();
    }
  }
});
