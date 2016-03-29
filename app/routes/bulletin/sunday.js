import Ember from 'ember';
import request from 'ic-ajax';

export default Ember.Route.extend({
  titleToken(model) {
    return model.get("name");
  },
  model: function() {
    var _this = this;
    return request('/api/v1/sunday').then(function(data) {
      var store = _this.get('store');
      store.pushPayload("bulletin", data);
      var results = store.peekRecord('bulletin', data.data.id);
      return results;
    });
  }
});
