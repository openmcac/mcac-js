import Ember from "ember";

export default Ember.Route.extend({
  serialize(model) {
    var publishedAt = model.get("publishedAt");

    return {
      day: pad(publishedAt.getUTCDate(), 2),
      month: pad(publishedAt.getUTCMonth() + 1, 2),
      post_id: model.get("id"),
      slug: model.get("slug"),
      year: publishedAt.getUTCFullYear()
    };
  },
});

function pad(n, width, z) {
  z = z || "0";
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

