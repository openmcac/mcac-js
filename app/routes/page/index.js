import Ember from "ember";

export default Ember.Route.extend({
  model(params, transition) {
    const KIND_PAGE = 1;
    const filter = {
      slug: transition.resolvedModels.page.slug,
      group_id: transition.resolvedModels.group.id,
      kind: KIND_PAGE
    };
    return this.store.query("post", { filter: filter }).then((pages) => {
      return pages.get("firstObject");
    });
  }
});
