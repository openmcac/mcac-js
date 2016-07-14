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
  notes() {
    return faker.lorem.sentence();
  },
  speaker() {
    return faker.name.findName();
  },
  series() {
    return faker.company.companyName();
  },
  "audio-url"() {
    return `${faker.internet.url()}/audio.mp3`;
  },
  "banner-url"() {
    return null;
  }
});

