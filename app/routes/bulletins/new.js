import Ember from 'ember';

function getMontrealMoment(now) {
  var nowMoment = moment(now);
  return nowMoment.zone(nowMoment.isDST() ? '-04:00' : '-05:00');
}

function upcomingSunday(now) {
  var montrealMoment = getMontrealMoment(now);

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
    var now = arguments[0] || new Date();
    var publishedAt = upcomingSunday(now);
    var englishService = this.store.find('group', 1);

    return this.store.createRecord('bulletin', {
      publishedAt: publishedAt.toDate(),
      name: 'Sunday Worship Service',
      description: publishedAt.format('MMMM Do YYYY, h:mm a'),
      serviceOrder: 'Default service order',
      group: englishService
    });
  }
});
