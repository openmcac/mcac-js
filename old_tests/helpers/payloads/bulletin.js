import Ember from 'ember';

const DEFAULT_OPTIONS = {
  groupId: 1,
  withAnnouncements: false
};

export default {
  build: function(id, attributes, options = {}) {
    options = Ember.$.extend(DEFAULT_OPTIONS, options);

    let payload = {
      "attributes": attributes,
      "id": `${id}`,
      "links": {
        "self": `/api/v1/bulletins/${id}`
      },
      "relationships": {
        "announcements": {
          "links": {
            "related": `/api/v1/bulletins/${id}/announcements`,
            "self": `/api/v1/bulletins/${id}/relationships/announcements`
          }
        },
        "group": {
          "data": { "type": "groups", "id": `${options.groupId}` },
          "links": {
            "related": `/api/v1/bulletins/${id}/group`,
            "self": `/api/v1/bulletins/${id}/relationships/group`
          }
        }
      },
      "type": "bulletins"
    };

    if (!options.withAnnouncements) {
      payload.relationships.announcements["data"] = null;
    }

    return payload;
  }
};
