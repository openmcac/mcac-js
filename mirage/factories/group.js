import { Factory, faker } from "ember-cli-mirage";

export default Factory.extend({
  name() {
    return faker.company.companyName();
  },
  slug() {
    return faker.helpers.slugify(this.name()).toLowerCase();
  },
  about() {
    return faker.lorem.paragraphs(2);
  },
  "meetDetails"() {
    return faker.lorem.sentence();
  },
  "targetAudience"() {
    return faker.lorem.sentence();
  },
  "shortDescription"() {
    return faker.lorem.sentence();
  },
  "bannerUrl"() {
    return `${faker.internet.url()}/banner.png`;
  },
  "profilePictureUrl"() {
    return `${faker.internet.url()}/profile.png`;
  }
});
