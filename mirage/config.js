import Mirage from "ember-cli-mirage";

export default function() {
  this.post("/api/auth/sign_in", function(schema, request) {
    const user = schema.db.users.find(1);
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
    const pageSize = parseInt(request.queryParams["page[size]"] || 15);
    const pageNumber = parseInt(request.queryParams["page[number]"] || 1);

    if (groupId) {
      const group = schema.groups.find(groupId);
      const postIds = group.posts.models.map(model => model.id);
      const offset = (pageNumber - 1) * pageSize;
      const lastPage = Math.ceil(group.posts.models.length / pageSize);

      let json = this.serialize(schema.posts.find(postIds.slice(offset, offset + pageSize)));
      json.links = { "last": `http://example.com/api/v1/posts?page%5Bnumber%5D=${lastPage}` };
      return json;
    }

    return schema.posts.all();
  });

  this.post("/posts");
  this.patch("/posts/:id");

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
