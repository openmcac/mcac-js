import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Ember from 'ember';
import { task } from 'ember-concurrency';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  defaultAnnouncementsService: Ember.inject.service("default-announcements"),
  model: function() {
    const bulletin = this.modelFor("bulletin");
    this.get("populateDefaultAnnouncementsTask").perform(bulletin);
    return bulletin;
  },
  populateDefaultAnnouncementsTask: task(function * (bulletin) {
    const announcements = yield bulletin.get("announcements");
    if (announcements.get("length") > 0) {
      return;
    }

    const groupId = this.modelFor("group").get("id");
    const defaultAnnouncements =
      yield this.get("defaultAnnouncementsService").process(groupId);

    defaultAnnouncements.forEach(a => announcements.addObject(a));
  })
});
