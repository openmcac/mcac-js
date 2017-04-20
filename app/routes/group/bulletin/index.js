import Ember from 'ember';
import headTags from "mcac/utils/head-tags/group/bulletin/index";

export default Ember.Route.extend({
  headTags() {
    const bulletin = this.modelFor(this.routeName);
    const group = this.modelFor("group");
    return headTags(group, bulletin);
  }
});
