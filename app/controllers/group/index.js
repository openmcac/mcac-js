import Ember from 'ember';
import Pagination from 'ember-cli-jsonapi-pagination/mixins/controllers/jsonapi-pagination';

export default Ember.Controller.extend(Pagination, {
  totalPages: Ember.computed('size', 'number', 'model.posts.[]', function() {
    return parseInt(getParameterByName("page[number]", this.get("posts.links.last")));
  })
});

function getParameterByName(name, url) {
  name = encodeURIComponent(name);
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  const results = regex.exec(url);

  if (!results) return null;
  if (!results[2]) return "";

  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
