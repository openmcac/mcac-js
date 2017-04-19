import Ember from 'ember';
import headTags from "mcac/utils/head-tags/bulletin/sunday";

export default Ember.Route.extend({
  ajax: Ember.inject.service(),
  headTags: function() {
    return headTags(this.modelFor(this.routeName));
  },
  titleToken(model) {
    return model.get("name");
  },
  model: function() {
    var _this = this;
    return this.get("ajax").request('/api/v1/sunday').then(function(data) {
      var store = _this.get('store');
      store.pushPayload("bulletin", data);
      var results = store.peekRecord('bulletin', data.data.id);
      return results;
    });
  }
});
