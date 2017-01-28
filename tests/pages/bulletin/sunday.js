import { create, visitable } from 'ember-cli-page-object';
import cover from "mcac/tests/pages/components/bulletin-cover";

export default create({
  visit: visitable('/sunday'),
  bulletin: {
    cover
  }
});
