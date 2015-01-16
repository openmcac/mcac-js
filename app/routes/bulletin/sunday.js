import Ember from 'ember';
import request from 'ic-ajax';

export default Ember.Route.extend({
  model: function() {
    var _this = this;
    return request('/api/v1/sunday').then(function(data) {
      var group = _this.store.normalize('group', data.group);
      _this.store.push('group', group);

      var bulletin = _this.store.normalize('bulletin', data.bulletin);
      return _this.store.push('bulletin', bulletin);
    });
  }
});
