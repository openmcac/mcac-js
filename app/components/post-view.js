/* global moment:false */

import Ember from 'ember';

const TIMEZONE = "America/Montreal";
const DATE_FORMAT = "MMMM D [at] h:mma";

export default Ember.Component.extend({
  classNames: ["post-view"],
  displayPublishedAt: Ember.computed("post.publishedAt", function() {
    const publishedAt = this.get("post.publishedAt");
    if (!publishedAt) { return ""; }

    return moment(publishedAt).tz(TIMEZONE).format(DATE_FORMAT);
  })
});
