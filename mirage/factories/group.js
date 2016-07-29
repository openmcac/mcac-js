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
  "meet-details"() {
    return faker.lorem.sentence();
  },
  "target-audience"() {
    return faker.lorem.sentence();
  },
  "short-description"() {
    return faker.lorem.sentence();
  },
  "banner-url"() {
    return `${faker.internet.url()}/banner.png`;
  },
  "profile-picture-url"() {
    return `${faker.internet.url()}/profile.png`;
  }
});
