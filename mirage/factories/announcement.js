import Mirage, { faker } from "ember-cli-mirage";

export default Mirage.Factory.extend({
  url() {
    return `${faker.internet.url()}`;
  },
  description() {
    return faker.lorem.sentences(faker.random.number(4) + 1);
  },
  position(i) {
    return i;
  }
});


