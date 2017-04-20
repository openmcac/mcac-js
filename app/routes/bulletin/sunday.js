import Ember from 'ember';
import headTags from "mcac/utils/head-tags/group/bulletin/index";

export default Ember.Route.extend({
  ajax: Ember.inject.service(),
  titleToken(model) {
    return model.get("name");
  },
  model: function() {
    var _this = this;
    return this.get("ajax").request('/api/v1/sunday?include=group').then(function(data) {
      var store = _this.get('store');
      store.pushPayload("bulletin", data);
      var results = store.peekRecord('bulletin', data.data.id);
      return results;
    });
  },
  headTags() {
    const bulletin = this.modelFor(this.routeName);
    return headTags(bulletin.get("group"), bulletin);
  }
});
