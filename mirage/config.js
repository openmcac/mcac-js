import Mirage from "ember-cli-mirage";

export default function() {
  this.post("/api/auth/sign_in", function(schema, request) {
    const user = schema.users.find(1);
    return new Mirage.Response(
        200,
        { "access-token": "adssafsdafsdsfd", "client": "asdfasdfasafs", "uid": "test@example.com" },
        {"data":{"id":`${user.id}`,"type":"users","links":{"self":`/api/v1/users/${user.id}`},"attributes":{"name":user.name,"email":user.email}}}
    );
  });

  this.namespace = "/api/v1";

  this.delete("/announcements/:id");
  this.get("/announcements/:id");
  this.patch("/announcements/:id");
  this.post("/announcements");

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

  this.get("/speakers", function(schema, request) {
    if (schema.speakers.all().models.length > 0 &&
        request.queryParams["filter[autocomplete]"]) {
      const nameFilter = request.queryParams["filter[autocomplete]"];
      return schema.speakers.where({ name: nameFilter });
    }

    return schema.speakers.all();
  });

  this.get("/speakers/:id");
  this.patch("/speaker/:id");
  this.post("/speakers");

  this.get("/bulletins", function(schema, request) {
    if (schema.bulletins.all().models.length > 0 &&
        request.queryParams["filter[latest_for_group]"]) {
      return schema.bulletins.find([1]);
    }

    return schema.bulletins.all();
  });

  this.get("/announcements", function(schema, request) {
    if (schema.announcements.all().models.length > 0 &&
        request.queryParams["filter[latest_for_group]"]) {
      return schema.announcements.find([1, 2, 3]);
    }

    return schema.announcements.all();
  });

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
