import Ember from 'ember';

export default Ember.Component.extend({
  ajax: Ember.inject.service(),
  classNames: ["bulletin-navigator"],
  store: Ember.inject.service(),
  actions: {
    nextBulletin: navigationFn("next"),
    previousBulletin: navigationFn("previous")
  }
});

function navigationFn(direction) {
  return function() {
    handleNavigationAction(direction, this);
  };
}

// direction: "previous" or "next"
function handleNavigationAction(direction, context) {
  const store = context.get("store");
  const router = context.get("router");
  const bulletinId = context.get("bulletin.id");
  const query = {
    bulletinId,
    custom: "navigator",
    direction,
    include: "announcements,sermon"
  };

  return store.
    queryRecord("bulletin", query).
    then(bulletin => transitionToBulletin(bulletin, router));
}

function transitionToBulletin(bulletin, router) {
  bulletin.
    get("group").
    then(g => router.transitionTo("bulletin.index", g.get("slug"), bulletin));
}
