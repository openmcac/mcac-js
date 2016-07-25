import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Ember from 'ember';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  defaultAnnouncementsService: Ember.inject.service("populate-default-announcements"),
  model: function() {
    const bulletin = this.modelFor("bulletin");
    bulletin.set("group", this.modelFor("group"));

    const store = this.get("store");

    bulletin.get("sermon").then((sermon) => {
      if (Ember.isEmpty(sermon)) {
        bulletin.set("sermon", store.createRecord("sermon"));
      }
    });

    this.get("defaultAnnouncementsService").process(bulletin);
    return bulletin;
  }
});
