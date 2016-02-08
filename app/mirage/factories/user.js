import Mirage, { faker } from "ember-cli-mirage";

export default Mirage.Factory.extend({
  name() {
    return `${faker.name.firstName} ${faker.name.lastName}`;
  },
  email() {
    return faker.interet.email;
  }
});
