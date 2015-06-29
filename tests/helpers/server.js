import Ember from "ember";
import Pretender from "pretender";

var englishService = {
  "id": "1",
  "type": "groups",
  "links": { "self": "/api/v1/groups/1" },
  "attributes": {
    "name": "English Service",
    "slug":"english-service",
    "created-at": "2015-03-06T04:01:33+00:00"
  }
};

var groups = { "data": [englishService] };

export default function() {
  return new Pretender(function() {
    this.get("/api/v1/groups", function(request) {
      var all = JSON.stringify(groups);
      return [200, {"Content-Type": "application/vnd.api+json"}, all];
    });

    this.get("/api/v1/groups/1", function(request) {
      var group = JSON.stringify({ "data": englishService });
      return [200, {"Content-Type": "application/vnd.api+json"}, group];
    });
  });
}
