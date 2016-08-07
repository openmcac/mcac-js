import Ember from 'ember';

export default Ember.Route.extend({
  ajax: Ember.inject.service(),
  titleToken(model) {
    return model.get("name");
  },
  model: function() {
    return this.store.queryRecord("bulletin", {
      custom: "sunday",
      include: "announcements,sermon,group"
    });
  }
});
