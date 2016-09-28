import Ember from 'ember';
import Pagination from 'ember-cli-jsonapi-pagination/mixins/controllers/jsonapi-pagination';

export default Ember.Controller.extend(Pagination, {
  totalPages: Ember.computed('size', 'number', 'model.posts.[]', function() {
    const pageParam =
      getParameterByName("page[number]", this.get("posts.links.last"));
    return parseInt(pageParam || 0);
  })
});

function getParameterByName(name, url) {
  name = encodeURIComponent(name);
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  const results = regex.exec(url);

  if (results && results[2]) {
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
}
