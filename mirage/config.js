export default function() {
  this.namespace = "/api/v1";

  this.delete("/announcements/:id");
  this.get("/announcements");
  this.get("/announcements/:id");
  this.patch("/announcements/:id");
  this.post("/announcements");

  this.get("/bulletins");
  this.get("/bulletins/:id");
  this.get("/bulletins/:id/sermon");
  this.patch("/bulletins/:id");
  this.post("/bulletins");

  this.get("/groups");
  this.get("/groups/:id");
  this.post("/groups");

  this.get("/posts/:id");

  this.get("/sermons/:id");
  this.patch("/sermons/:id");
  this.post("/sermons");

  this.get("/posts", function(schema, request) {
    const groupId = request.queryParams["filter[group]"];

    if (groupId) {
      const group = schema.groups.find(groupId);
      return group.posts;
    }

    return schema.posts.all();
  });

  this.get("/sunday", function(schema) {
    return schema.bulletins.find(3);
  });

  this.get("/bulletins/:id/previous", (schema, request) => {
    return schema.bulletins.find(parseInt(request.params.id) - 1);
  });

  this.get("/bulletins/:id/next", (schema, request) => {
    return schema.bulletins.find(parseInt(request.params.id) + 1);
  });

  this.get("/bulletins/:id/announcements", ({ bulletins }, request) => {
    const bulletin = bulletins.find(request.params.id);
    return bulletin.announcements;
  });
}
