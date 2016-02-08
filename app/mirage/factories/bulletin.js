import Mirage, { faker } from "ember-cli-mirage";

export default Mirage.Factory.extend({
  name() {
    return faker.company.companyName();
  },
  "published-at"() {
    const publishedAt = faker.date.past();
    publishedAt.setMilliseconds(0);
    publishedAt.setSeconds(0);

    return publishedAt.toISOString();
  },
  "sermon-notes"() {
    return faker.lorem.sentence();
  },
  "service-order"() {
    return faker.lorem.sentence();
  },
  description() {
    return faker.lorem.sentence();
  },
  "audio-url"() {
    return null;
  },
  "banner-url"() {
    return null;
  }
});

