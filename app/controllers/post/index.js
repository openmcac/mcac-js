import Ember from "ember";

const TIMEZONE = "America/Montreal";
const DATE_FORMAT = "MMMM D YYYY, h:mm a";

export default Ember.Controller.extend({
  displayPublishedAt: function() {
    let publishedAt = this.get("model.publishedAt");
    if (!publishedAt) { return ""; }

    return moment(publishedAt).tz(TIMEZONE).format(DATE_FORMAT);
  }.property("model.publishedAt")
});
