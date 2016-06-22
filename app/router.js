import Ember from "ember";
import config from "./config/environment";

var Router = Ember.Router.extend({
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
  this.route("group", { path: ":group_slug" }, function() {
    this.route("index", { path: "/" }, function() {});
    this.route("edit", function() {});

    this.route("bulletin", { resetNamespace: true, path: "bulletins/:bulletin_id" }, function() {
      this.route("edit");
    });

    this.route("post", { resetNamespace: true, path: "" }, function() {
      this.route("index", { path: ":year/:month/:day/:post_id/:slug" }, function() {});
      this.route("edit", { path: "post/:post_id/edit" }, function() {});
    });

    this.route("page", { resetNamespace: true, path: ":slug" }, function() {
      this.route("index", { path: "/" }, function() {});
    });

    this.route('posts', { resetNamespace: true, path: 'posts' }, function() {
      this.route('new', function() {});
    });

    this.route("bulletins", { resetNamespace: true, path: "bulletins" }, function() {
      this.route("new", function() {
        this.route("announcements");
      });
    });
  });

  this.route("bulletin/sunday", { path: "/sunday" }, function() {
  });

  this.route("login");
  this.route("logout");

  this.route('groups', function() {
    this.route('new');
  });
  this.route('dashboard', function() {});
  this.route("not-found", { path: "*path" });

  this.route('settings', function() {
    this.route('password');
  });
});

export default Router;
