import Ember from 'ember';
import request from "ic-ajax";

export default Ember.Component.extend({
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
  let store = context.get("store");
  let router = context.get("router");
  let bulletinId = context.get("bulletin.id");
  return request(`/api/v1/bulletins/${bulletinId}/${direction}`).
    then(transitionToBulletinFn(store, router));
}

function transitionToBulletinFn(store, router) {
  return function(data) {
    transitionToBulletinFromResponse(store, router, data);
  };
}

function transitionToBulletinFromResponse(store, router, data) {
  store.pushPayload("bulletin", data);
  let bulletin = store.peekRecord('bulletin', data.data.id);
  bulletin.get("group").then((group) => {
    router.transitionTo("bulletin.index", group.get("slug"), bulletin);
  });
}
