import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  session: Ember.inject.service(),
  actions: {
    onPost: function() {
      let group = this.get("group");
      let store = this.get("store");
      let currentUserId = this.get("session.data.authenticated.data.id");
      let currentUser = store.peekRecord("user", currentUserId);

      let post = store.createRecord("post", {
        title: "test post",
        content: this.get("content"),
        group: group,
        publishedAt: new Date(),
        author: currentUser
      });

      post.save();
    }
  }
});
