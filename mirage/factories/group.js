import { Factory, faker } from "ember-cli-mirage";

export default Factory.extend({
  name() {
    return faker.company.companyName();
  },
  slug() {
    return faker.helpers.slugify(this.name).toLowerCase();
  },
  about() {
    return faker.lorem.sentences(faker.random.number(4) + 1).replace(/\n/g, ' ');
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
