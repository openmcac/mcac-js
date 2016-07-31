export default function() {
  this.get("/api/v1/bulletins/:id");

  this.get("/api/v1/sermons/:id");

  this.patch("/api/v1/sermons/:id");

  this.patch("/api/v1/bulletins/:id");

  this.get("/api/v1/bulletins");

  this.patch("/api/v1/announcements/:id");

  this.get("/api/v1/announcements");

  this.post("/api/v1/announcements");

  this.get("/api/v1/groups");

  this.post("/api/v1/sermons");

  this.post("/api/v1/bulletins");

  this.post("/api/v1/groups");

  this.get("/api/v1/posts/:id");

  this.get("/api/v1/announcements/:id");

  this.delete("/api/v1/announcements/:id");

  this.get("/api/v1/posts", function(schema, request) {
    const groupId = request.queryParams["filter[group]"];

    if (groupId) {
      const group = schema.groups.find(groupId);
      return group.posts;
    }

    return schema.posts.all();
  });

  this.get("/api/v1/sunday", function({ db }) {
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
}
