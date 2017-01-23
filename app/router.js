import Ember from "ember";
import config from "./config/environment";
import RouterScroll from 'ember-router-scroll';

const Router = Ember.Router.extend(RouterScroll, {
	rootURL: config.rootURL,
  location: config.locationType,
  metrics: Ember.inject.service(),

  didTransition() {
    this._super(...arguments);
    this._trackPage();
  },

  _trackPage() {
    Ember.run.scheduleOnce("afterRender", this, () => {
      const page = document.location.pathname;
      const title = this.getWithDefault("currentRouteName", "unknown");

      Ember.get(this, "metrics").trackPage({ page, title });
    });
  }
});

Ember.Route.reopen({
  activatePace: Ember.on('activate', function() {
    return Pace.restart();
  }),
  deactivatePace: Ember.on('deactivate', function() {
    return Pace.stop();
  }),
  activate() {
    const cssClass = this.toCssClass();
    if (cssClass !== "application") {
      Ember.$("body").addClass(cssClass);
    }
  },
  deactivate() {
    Ember.$("body").removeClass(this.toCssClass());
  },
  toCssClass() {
    return this.slugify(this.routeName);
  },
  slugify(string) {
    return string.toLowerCase().trim().replace(/[\s\W-]+/g, '-');
  }
});

Router.map(function() {
  this.route("index", { path: "/" });
  this.route("bulletin/sunday", { path: "sunday" });
  this.route("dashboard");
  this.route("group", { path: ":group_slug" }, function() {
    this.route("post", { path: ":year/:month/:day/:post_id/:slug" }, function() {
    });
  });
});

export default Router;
