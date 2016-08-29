import { faker, Factory } from "ember-cli-mirage";

export default Factory.extend({
  name() {
    return faker.name.findName();
  }
});

