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

  this.get("/api/v1/sunday", function(db) {
    let attrs = db.bulletins[0];

    return {
      data: {
        type: "bulletins",
        id: attrs.id,
        attributes: attrs,
        links: {
          self: `/api/v1/bulletins/${attrs.id}`
        },
        relationships: {
          announcements: {
            links: {
              self: `/api/v1/bulletins/${attrs.id}/relationships/announcements`,
              related: `/api/v1/bulletins/${attrs.id}/announcements`
            }
          },
          group: {
            links: {
              self: `/api/v1/bulletins/${attrs.id}/relationships/group`,
              related: `/api/v1/bulletins/${attrs.id}/group`
            }
          },
          sermon: {
            links: {
              self: `/api/v1/bulletins/${attrs.id}/relationships/sermon`,
              related: `/api/v1/bulletins/${attrs.id}/sermon`
            }
          }
        }
      }
    };
  });

  this.get("/api/v1/bulletins/:id/group", function(db, request) {
    const bulletin = db.bulletins.find(request.params.id);
    const attrs = bulletin.group;

    return {
      data: {
        type: "groups",
        id: attrs.id,
        attributes: attrs
      }
    };
  });

  this.get("/api/v1/bulletins/:id");

  this.get("/api/v1/sermons/:id");

  this.patch("/api/v1/sermons/:id");

  this.patch("/api/v1/bulletins/:id");

  this.get("/api/v1/bulletins");

  this.get("/api/v1/bulletins/:bulletinId/announcements", () => ({ data: [] }));
  this.get("/api/v1/bulletins/:bulletinId/sermon", () => ({ data: [] }));

  this.patch("/api/v1/announcements/:id");

  this.get("/api/v1/announcements");

  this.post("/api/v1/announcements");

  this.get("/api/v1/groups");
//    let groups = db.groups;
//
//    if (request.params &&
//        request.params.filter &&
//        request.params.filter.slug) {
//      let slug = request.params.filter.slug;
//      groups = groups.select(g => g.slug === slug);
//    }
//
//    return {
//      data: groups.map(attrs => ({
//        type: "groups",
//        id: attrs.id,
//        attributes: attrs,
//        relationships: {
//          posts: {
//            links: {
//              self: `/api/v1/groups/${attrs.id}/relationships/posts`,
//              related: `/api/v1/groups/${attrs.id}/posts`
//            }
//          }
//        }
//      }))
//    };
//  });

  this.post("/api/v1/sermons");

  this.post("/api/v1/bulletins");

  this.post("/api/v1/groups");

  this.get("/api/v1/posts", function(schema, request) {
    const groupId = request.queryParams["filter[group]"];

    if (groupId) {
      const group = schema.groups.find(groupId);
      return group.posts;
    }

    return schema.posts.all();
  });

  this.get("/api/v1/posts/:id");

  this.get("/api/v1/announcements/:id");

  this.delete("/api/v1/announcements/:id");
}
