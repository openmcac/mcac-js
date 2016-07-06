import DS from "ember-data";

export default DS.Model.extend({
  audioUrl: DS.attr("string"),
  bannerUrl: DS.attr("string"),
  group: DS.belongsTo("group", { async: true }),
  name: DS.attr("string"),
  notes: DS.attr("string"),
  publishedAt: DS.attr('date'),
  series: DS.attr("string"),
  speaker: DS.attr("string")
});
