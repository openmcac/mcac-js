import Ember from "ember";

export default Ember.Route.extend({
  model(params, transition) {
    const KIND_PAGE = 1;
    const filter = {
      slug: params.slug,
      group_id: transition.resolvedModels.group.id,
      kind: 1
    };
    return this.store.query("post", { filter: filter }).then((pages) => {
      return pages.get("firstObject");
    });
  }
});
