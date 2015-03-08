import JsonApiAdapter from 'ember-json-api/json-api-adapter';

export default JsonApiAdapter.extend({
  namespace: 'api/v1',
  headers: {
    'Accept': 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json',
    'X-User-Email': 'test@example.com',
    'X-User-Token': 'cb4c2535050a6b6ca4f8155ea2882ef3'
  }
});
