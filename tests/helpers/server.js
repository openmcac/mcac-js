import Ember from 'ember';
import Pretender from 'pretender';

var englishService = {
  "id": "1",
  "name": "English Service",
  "slug": "english-service",
  "createdAt": "2015-03-07T03:58:39+00:00"
};

var groups = { "groups": [englishService] };

export default function() {
  return new Pretender(function() {
    this.get('/api/v1/groups', function(request) {
      var all = JSON.stringify(groups);
      return [200, {"Content-Type": "application/vnd.api+json"}, all];
    });

    this.get('/api/v1/groups/1', function(request) {
      var group = JSON.stringify({ groups: englishService });
      return [200, {"Content-Type": "application/vnd.api+json"}, group];
    });
  });
}
