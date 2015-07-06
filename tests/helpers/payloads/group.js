import Ember from 'ember';

export default {
  build: build,
  englishService: function() {
    return build("1", {
      "name": "English Service",
      "slug":"english-service",
      "created-at": "2015-03-06T04:01:33+00:00"
    });
  }
};

function build(id, attributes) {
  return {
    "id": `${id}`,
    "type": "groups",
    "links": { "self": `/api/v1/groups/${id}` },
    "attributes": attributes
  };
}
