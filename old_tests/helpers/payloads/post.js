import Ember from 'ember';

const DEFAULT_OPTIONS = {
  groupId: 1
};

export default {
  build: function(id, attributes, options = {}) {
    options = Ember.$.extend(DEFAULT_OPTIONS, options);

    let response = {
      "id": `${id}`,
      "type": "posts",
      "links": {
        "self": `/api/v1/posts/${id}`
      },
      "attributes": attributes,
      "relationships": {
        "author": {
          "links": {
            "self": `/api/v1/posts/${id}/relationships/author`,
            "related": `/api/v1/posts/${id}/author`
          },
          "data": null
        },
        "editor": {
          "links": {
            "self": `/api/v1/posts/${id}/relationships/editor`,
            "related": `/api/v1/posts/${id}/editor`
          },
          "data": null
        },
        "group": {
          "links": {
            "self": `/api/v1/posts/${id}/relationships/group`,
            "related": `/api/v1/posts/${id}/group`
          },
          "data": { "type": "groups", "id": `${options.groupId}` }
        }
      }
    };

    if (options.authorId) {
      response.relationships.author["data"] = {
        "type": "users",
        "id": `${options.authorId}`
      };
    }

    if (options.editorId) {
      response.relationships.editor["data"] = {
        "type": "users",
        "id": `${options.editorId}`
      };
    }

    return response;
  }
};
