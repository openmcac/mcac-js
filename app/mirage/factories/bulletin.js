import Mirage, { faker } from "ember-cli-mirage";

export default Mirage.Factory.extend({
  name() {
    return faker.company.companyName();
  },
  "published-at"() {
    return faker.date.past().toISOString();
  },
  "sermon-notes"() {
    return faker.lorem.paragraphs(2);
  },
  "service-order"() {
    return faker.lorem.paragraphs(2);
  },
  description() {
    return faker.lorem.paragraphs(2);
  },
  "audio-url"() {
    return `${faker.internet.url()}/audio.mp3`;
  },
  "banner-url"() {
    return `${faker.internet.url()}/banner.png`;
  }
});

