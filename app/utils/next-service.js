/* global moment:false */

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

export default function nextService() {
  var now = arguments[0] || new Date();
  return upcomingSunday(now);
}
