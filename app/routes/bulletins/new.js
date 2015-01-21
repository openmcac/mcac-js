import Ember from 'ember';
import request from 'ic-ajax';

function upcomingSunday(now) {
  var montrealMoment = moment(now).tz('America/Montreal');

  if (hasServiceStarted(montrealMoment)) {
    montrealMoment = montrealMoment.endOf('week').add(1, 'day');
  }

  return montrealMoment.hours(9).minutes(30).seconds(0).milliseconds(0);
}

function hasServiceStarted(now) {
  return now.day() > 0 || now.hours() > 9 || now.minutes() >= 30;
}

export default Ember.Route.extend({
  model: function() {
    var _this = this;
    var now = (arguments[0] && arguments[0].currentTime) || new Date();
    var publishedAt = upcomingSunday(now);
    var group = this.modelFor('group');
    var latestAnnouncementsEndpoint =
        '/api/v1/announcements/latest?group_id=' + group.id;

    return request(latestAnnouncementsEndpoint).then(function(data) {
      var hash = _this.store.normalize('announcement', data.announcements);
      _this.store.pushMany('announcement', hash);

      var defaultBulletin = _this.store.createRecord('bulletin', {
        publishedAt: publishedAt.toDate(),
        name: 'Sunday Worship Service',
        description: publishedAt.format('MMMM Do YYYY, h:mm a'),
        serviceOrder: 'Default service order',
        group: group
      });

      hash.forEach(function(currentAnnouncement) {
        delete currentAnnouncement.id;
        currentAnnouncement.bulletin = defaultBulletin;
        var announcement = _this.store.createRecord('announcement', currentAnnouncement);
        defaultBulletin.get('announcements').addObject(announcement);
      });

      return defaultBulletin;
    });
  }
});
