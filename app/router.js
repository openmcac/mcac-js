import Ember from "ember";
import config from "./config/environment";

var Router = Ember.Router.extend({
  location: config.locationType
});

Ember.Route.reopen({
  activatePace: function() {
    return Pace.restart();
  }.on('activate'),
  deactivatePace: function() {
    return Pace.stop();
  }.on('deactivate')
});

Router.map(function() {
  this.resource("group", { path: ":group_slug" }, function() {
    this.resource("bulletin", { path: "bulletins/:bulletin_id" }, function() {
      this.route("edit");
    });

    this.resource('post', { path: "posts/:post_id" }, function() {
      this.route('edit', function() {});
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
