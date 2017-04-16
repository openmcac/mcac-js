import Ember from "ember";

export default Ember.Route.extend({
  titleToken(model) {
    return model.get("title");
  },
  model(params) {
    const post = this.modelFor("group.post");
    if (post.get("isPage")) {
      this.transitionTo("group.page.index", post);
    } else if (invalidUrl(post, params)) {
      this.transitionTo("group.post.index", post);
    }

    return post;
  }
});

function invalidUrl(post, params) {
  var publishedAt = post.get("publishedAt");

  return post.get("slug") !== params.slug ||
         parseInt(publishedAt.getUTCFullYear()) !== params.year ||
         parseInt(publishedAt.getUTCMonth() + 1) !== params.month ||
         parseInt(publishedAt.getUTCDate()) !== params.day;
}
