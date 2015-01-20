import Ember from 'ember';

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
    var now = (arguments[0] && arguments[0].currentTime) || new Date();
    var publishedAt = upcomingSunday(now);
    var group = this.modelFor('group');

    var defaultBulletin = this.store.createRecord('bulletin', {
      publishedAt: publishedAt.toDate(),
      name: 'Sunday Worship Service',
      description: publishedAt.format('MMMM Do YYYY, h:mm a'),
      serviceOrder: 'Default service order',
      group: group
    });

    // defaultBulletin.get('announcements').then(function(announcements) {
    //   announcements.pushObject(this.store.createRecord('announcement', {
    //     description: 'welcome to mcac',
    //     position: 1
    //   }));
    // });

    return defaultBulletin;
  }
});
