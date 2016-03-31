import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Ember from 'ember';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  defaultAnnouncementsService: Ember.inject.service("default-announcements"),
  model: function() {
    const bulletin = this.modelFor("bulletin");

    bulletin.get("announcements").then(announcements => {
      if (announcements.get("length") > 0) return;

      const groupId = this.modelFor("group").get("id");
      const defaultAnnouncements =
        this.get("defaultAnnouncementsService").process(groupId);

      defaultAnnouncements.then(defaults => {
        defaults.forEach(a => announcements.addObject(a))
      });
    });

    return bulletin;
  }
});
