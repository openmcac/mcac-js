import DS from "ember-data";
import config from '../config/environment';
import ApplicationAdapter from "./application";

export default ApplicationAdapter.extend({
  urlForQueryRecord(query) {
    if (query.custom) {
      const customQuery = query.custom;
      if (customQuery === "sunday") {
        return `${this.urlPrefix()}/sunday`;
      }
    }

    return this._super(...arguments);
  }
});
