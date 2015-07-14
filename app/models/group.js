import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr("string"),
  slug: DS.attr("string"),
  about: DS.attr("string"),
  bannerUrl: DS.attr("string")
});
