import Ember from "ember";
import config from "./config/environment";

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource("group", { path: ":group_slug" }, function() {
    this.resource("bulletin", { path: "bulletins/:bulletin_id" }, function() {
      this.route("edit");
    });

    this.resource("bulletins", { path: "bulletins" }, function() {
      this.route("new", function() {
        this.route("announcements");
      });
    });
  });

  this.route("bulletin/sunday", { path: "/sunday" }, function() {
  });
});

export default Router;
