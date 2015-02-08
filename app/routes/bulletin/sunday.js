import Ember from 'ember';
import request from 'ic-ajax';

export default Ember.Route.extend({
  model: function() {
    var _this = this;
    return request('/api/v1/sunday').then(function(data) {
      _this.store.pushPayload(data);
      var results = _this.store.find('bulletin', data.bulletins.id);
      return results;
    });
  }
});
