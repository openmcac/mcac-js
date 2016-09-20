import { faker, Factory } from "ember-cli-mirage";

export default Factory.extend({
  name() {
    return faker.company.companyName();
  },
  publishedAt() {
    const publishedAt = faker.date.past();
    publishedAt.setMilliseconds(0);
    publishedAt.setSeconds(0);

    return publishedAt.toISOString();
  },
  notes() {
    return faker.lorem.sentences(faker.random.number(4) + 1).replace(/\n/g, ' ');
  },
  speaker() {
    return faker.name.findName();
  },
  series() {
    return faker.company.companyName();
  },
  audioUrl() {
    return `${faker.internet.url()}/audio.mp3`;
  },
  bannerUrl() {
    return null;
  },
  tags() {
    return "test1,test2";
  }
});

