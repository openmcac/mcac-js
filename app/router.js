import Ember from "ember";
import config from "./config/environment";

var Router = Ember.Router.extend({
  location: config.locationType
});

Ember.Route.reopen({
  activatePace: Ember.on('activate', function() {
    return Pace.restart();
  }),
  deactivatePace: Ember.on('deactivate', function() {
    return Pace.stop();
  })
});

Router.map(function() {
  this.resource("group", { path: ":group_slug" }, function() {
    this.resource("bulletin", { path: "bulletins/:bulletin_id" }, function() {
      this.route("edit");
    });

    this.resource("post", { path: "" }, function() {
      this.route("index", { path: ":year/:month/:day/:post_id/:slug" }, function() {});
      this.route("edit", { path: "post/:post_id/edit" }, function() {});
    });

    this.resource('posts', { path: 'posts' }, function() {
      this.route('new', function() {});
    });

    this.resource("bulletins", { path: "bulletins" }, function() {
      this.route("new", function() {
        this.route("announcements");
      });
    });
  });

  this.route("bulletin/sunday", { path: "/sunday" }, function() {
  });

  this.route("login");
  this.route("logout");
});

export default Router;
