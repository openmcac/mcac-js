import Mirage, { faker } from "ember-cli-mirage";

export default Mirage.Factory.extend({
  description() {
    return faker.lorem.sentence();
  },
  position() {
    return faker.random.number();
  },
  url() {
    return faker.internet.url();
  }
});


