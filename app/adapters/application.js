import JsonApiAdapter from 'ember-json-api/json-api-adapter';

export default JsonApiAdapter.extend({
  namespace: 'api/v1',
  headers: {
    'Accept': 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json'
  }
});
