import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return this.store.findRecord("bulletin", params.bulletin_id, {
      include: "announcements,sermon"
    });
  },
  titleToken(model) {
    return model.get("name");
  }
});
