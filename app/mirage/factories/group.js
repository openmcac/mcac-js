import Mirage, { faker } from "ember-cli-mirage";

export default Mirage.Factory.extend({
  name() {
    return faker.company.companyName();
  },
  slug() {
    return faker.helpers.slugify(this.name()).toLowerCase();
  },
  about() {
    return faker.lorem.paragraphs(2);
  },
  "banner-url"() {
    return `${faker.internet.url()}/banner.png`;
  }
});
