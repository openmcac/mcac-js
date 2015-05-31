import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    var _this = this;
    return _this.store.find('post', params.post_id).then(function(post) {
      if (invalidUrl(post, params)) {
        _this.transitionTo('post', post);
      }

      return post;
    });
  },
  serialize: function(model) {
    var publishedAt = model.get("publishedAt");

    return {
      day: pad(publishedAt.getUTCDate(), 2),
      month: pad(publishedAt.getUTCMonth() + 1, 2),
      post_id: model.get('id'),
      slug: model.get('slug'),
      year: publishedAt.getUTCFullYear()
    };
  }
});

function invalidUrl(post, params) {
  var publishedAt = post.get("publishedAt");

  return post.get("slug") !== params.slug ||
         parseInt(publishedAt.getUTCFullYear()) !== params.year ||
         parseInt(publishedAt.getUTCMonth() + 1) !== params.month ||
         parseInt(publishedAt.getUTCDate()) !== params.day;
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
