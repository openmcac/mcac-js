import DS from "ember-data";
import DataAdapterMixin from "ember-simple-auth/mixins/data-adapter-mixin";

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
  authorizer: "authorizer:mcac",
  handleResponse(status, headers, payload) {
    let accessToken = headers["access-token"];
    let client = headers.client;

    if (accessToken && client) {
      this.set("session.auth.client", client);
      this.set("session.auth.accessToken", accessToken);
    }

    return this._super(...arguments);
  },
  namespace: "api/v1",
  session: Ember.inject.service("session")
});
