import Ember from 'ember';
import request from "ic-ajax";

export default Ember.Component.extend({
  classNames: ["bulletin-navigator"],
  store: Ember.inject.service(),
  actions: {
    nextBulletin() {
      let store = this.get("store");
      let router = this.get("router");
      let nextBulletinUrl = `/api/v1/bulletins/${this.get("bulletin.id")}/next`

      return request(nextBulletinUrl).
        then(transitionToBulletinFn(store, router));
    },
    previousBulletin() {
      let store = this.get("store");
      let router = this.get("router");
      let previousBulletinUrl =
        `/api/v1/bulletins/${this.get("bulletin.id")}/previous`

      return request(previousBulletinUrl).
        then(transitionToBulletinFn(store, router));
    }
  }
});

function transitionToBulletinFn(store, router) {
  return function(data) {
    transitionToBulletinFromResponse(store, router, data);
  };
}

function transitionToBulletinFromResponse(store, router, data) {
  store.pushPayload("bulletin", data);
  let bulletin = store.peekRecord('bulletin', data.data.id);
  router.transitionTo("bulletin.index", bulletin);
}
