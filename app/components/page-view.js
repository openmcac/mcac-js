/* global moment:false */

import Ember from 'ember';

const TIMEZONE = "America/Montreal";
const DATE_FORMAT = "MMMM D [at] h:mma";

export default Ember.Component.extend({
  classNames: ["page-view"],
  displayPublishedAt: Ember.computed("page.publishedAt", function() {
    const publishedAt = this.get("page.publishedAt");
    if (!publishedAt) { return ""; }

    return moment(publishedAt).tz(TIMEZONE).format(DATE_FORMAT);
  })
});
