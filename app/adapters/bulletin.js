import DS from "ember-data";
import config from '../config/environment';
import ApplicationAdapter from "./application";

export default ApplicationAdapter.extend({
  urlForQueryRecord(query) {
    if (query.custom) {
      const customQuery = query.custom;
      if (customQuery === "sunday") {
        return sundayUrl(this.urlPrefix());
      }

      if (customQuery === "navigator") {
        return navigatorUrl(this.urlPrefix(), query.bulletinId, query.direction);
      }
    }

    return this._super(...arguments);
  }
});

function sundayUrl(prefix) {
  return `/${prefix}/sunday`;
}

function navigatorUrl(prefix, bulletinId, direction) {
  return `/${prefix}/bulletins/${bulletinId}/${direction}`;
}
