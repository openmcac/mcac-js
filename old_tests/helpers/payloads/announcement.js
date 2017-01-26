export default {
  build: function(id, bulletinId, attributes) {
    return {
      "attributes": attributes,
      "id": `${id}`,
      "links": {
        "self": `/api/v1/announcements/${id}`
      },
      "relationships": {
        "bulletin": {
          "data": { "type": "bulletin", "id": `${bulletinId}` },
          "links": {
            "related": `/api/v1/announcements/${id}/bulletin`,
            "self": `/api/v1/announcements/${id}/relationships/bulletin`
          }
        },
        "post": {
          "data": null,
          "links": {
            "related": `/api/v1/announcements/${id}/post`,
            "self": `/api/v1/announcements/${id}/relationships/post`
          }
        }
      },
      "type": "announcements"
    };
  }
};
