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

  this.get("/api/v1/bulletins/:id", function(db, request) {
    let attrs = db.bulletins.find(request.params.id);

    return {
      data: {
        type: "bulletins",
        id: attrs.id,
        attributes: attrs,
        relationships: {
          groups: {
            links: {
              self: `/api/v1/bulletins/${attrs.id}/relationships/groups`,
              related: `/api/v1/bulletins/${attrs.id}/groups`
            }
          }
        }
      }
    };
  });

  this.get("/api/v1/bulletins", function(db) {
    let bulletins = db.bulletins;

    return {
      data: bulletins.map(attrs => ({
        type: "bulletins",
        id: attrs.id,
        attributes: attrs,
        relationships: {
          groups: {
            links: {
              self: `/api/v1/bulletins/${attrs.id}/relationships/groups`,
              related: `/api/v1/bulletins/${attrs.id}/groups`
            }
          }
        }
      }))
    };
  });

  this.get("/api/v1/announcements", function(db, request) {
    let announcements = db.announcements;

    return {
      data: announcements.map(attrs => ({
        type: "announcements",
        id: attrs.id,
        attributes: attrs,
        relationships: {
          posts: {
            links: {
              self: `/api/v1/announcements/${attrs.id}/relationships/bulletins`,
              related: `/api/v1/announcements/${attrs.id}/bulletins`
            }
          }
        }
      }))
    };
  });

  this.get("/api/v1/groups", function(db, request) {
    let groups = db.groups;

    if (request.params &&
        request.params.filter &&
        request.params.filter.slug) {
      let slug = request.params.filter.slug;
      groups = groups.select(g => g.slug === slug);
    }

    return {
      data: groups.map(attrs => ({
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

  this.post("/api/v1/bulletins", (db, request) => {
    let data = JSON.parse(request.requestBody).data;
    let attributes = data.attributes;
    attributes.id = data.id;

    let createdBulletin = db.bulletins.insert(data.attributes);

    return {
      data: {
        type: "bulletins",
        id: createdBulletin.id,
        attributes: createdBulletin
      }
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
