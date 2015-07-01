import Ember from 'ember';

export default {
  build: function(id, attributes) {
    return {
      "id": `${id}`,
      "type": "users",
      "links": { "self": `/api/v1/users/${id}` },
      attributes: attributes
    };
  }
};
