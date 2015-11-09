import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Ember from 'ember';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model: function() {
    let bulletin = this.modelFor("bulletin");

    bulletin.get("announcements").then((announcements) => {
      if (announcements.get("length") === 0) {
        populateLatestAnnouncements(bulletin, this.store);
      }
    });

    return bulletin;
  }
});

function populateLatestAnnouncements(bulletin, store) {
  let query = { filter: { defaults_for_bulletin: bulletin.id } };
  store.query('announcement', query).then(function(announcements) {
    copyAnnouncementsIntoBulletin(store, announcements, bulletin);
  });
}

function copyAnnouncementsIntoBulletin(store, announcements, bulletin) {
  announcements.forEach(function(announcement) {
    bulletin.get('announcements').
             addObject(cloneAnnouncement(store, announcement));
  });
}

function cloneAnnouncement(store, announcement) {
  return store.createRecord('announcement', {
    description: announcement.get('description'),
    url: announcement.get('url'),
    position: announcement.get('position')
  });
}
