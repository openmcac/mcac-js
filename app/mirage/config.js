export default function() {
  this.get("/api/v1/groups/:id/posts", function(db, request) {
    let groupId = parseInt(request.params.id);
    let posts = db.posts.filter(attrs => {
      return attrs["group-id"] === groupId;
    });

    let response = {
      data: posts.map(attrs => ({
        type: "posts",
        id: attrs.id,
        attributes: attrs
      }))
    };

    return response;
  });

  this.get("/api/v1/groups", function(db) {
    return {
      data: db.groups.map(attrs => ({
        type: "groups",
        id: attrs.id,
        attributes: attrs,
        relationships: {
          posts: {
            links: {
              self: `/api/v1/groups/${attrs.id}/relationships/posts`,
              related: `/api/v1/groups/${attrs.id}/posts`
            }
          }
        }
      }))
    };
  });

  this.post("/api/v1/groups", (db, request) => {
    let data = JSON.parse(request.requestBody).data;
    let attributes = data.attributes;
    attributes.id = data.id;

    db.groups.insert(data.attributes);

    return {
      data: {
        type: "groups",
        id: attributes.id,
        attributes: attributes
      }
    };
  });

  this.get("/api/v1/posts", function(db) {
    return {
      data: db.posts.map(attrs => ({
        type: "posts",
        id: attrs.id,
        attributes: attrs
      }))
    };
  });
}
