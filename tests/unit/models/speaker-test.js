import { moduleForModel, test } from 'ember-qunit';

moduleForModel('speaker', 'Unit | Model | speaker', {
  // Specify the other units that are required for this test.
  needs: ["model:user", "model:sermon"]
});

test('displayLabel: when it does not have an id', function(assert) {
  const model = this.subject({ name: "My Name" });
  assert.equal(
    model.get("displayLabel"),
    "My Name (new)",
    "it indicates that it is new"
  );
});

test('displayLabel: when it has an id', function(assert) {
  const model = this.subject({ id: 222, name: "My Name" });
  assert.equal(
    model.get("displayLabel"),
    "My Name (id: 222)",
    "it indicates that it is new"
  );
});
