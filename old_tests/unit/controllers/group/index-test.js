import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:group/index', 'Unit | Controller | group/index', {
  needs: ['service:metrics', 'service:router-scroll']
});

test('totalPages: Fetches the total pages from metadata', function(assert) {
  const model = {
    posts: {
      links: { last: "https://mcac.church/api/v1/posts?page%5Bnumber%5D=4" }
    }
  };

  const controller = this.subject(model);

  assert.equal(controller.get("totalPages"), 4);
});

test('totalPages: Returns 0 when URL has no page number', function(assert) {
  const model = {
    posts: {
      links: { last: "https://mcac.church/api/v1/posts" }
    }
  };

  const controller = this.subject(model);

  assert.equal(controller.get("totalPages"), 0);
});
