/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import { module, test } from 'qunit';
import validate from 'ember-validators/exclusion';
import context from '../../helpers/validator-context';
import cloneOptions from '../../helpers/clone-options';

let options, message;

module('Unit | Validator | exclusion');

test('no options', function(assert) {
  assert.expect(1);

  try {
    message = validate(context, undefined, {});
  } catch (e) {
    assert.ok(true);
  }
});

test('allow blank', function(assert) {
  assert.expect(2);

  options = {
    allowBlank: true,
    "in": ["foo", "bar", "baz"]
  };

  message = validate(context, '', cloneOptions(options));
  assert.equal(message, true);

  message = validate(context, 'foo', cloneOptions(options));
  assert.equal(message, 'This field is reserved');
});

test('not in array', function(assert) {
  assert.expect(4);

  options = {
    "in": ["foo", "bar", "baz"]
  };

  message = validate(context, 'foo', cloneOptions(options));
  assert.equal(message, 'This field is reserved');

  message = validate(context, 'bar', cloneOptions(options));
  assert.equal(message, 'This field is reserved');

  message = validate(context, 'baz', cloneOptions(options));
  assert.equal(message, 'This field is reserved');

  message = validate(context, 'test', cloneOptions(options));
  assert.equal(message, true);
});

test('not in range', function(assert) {
  assert.expect(5);

  options = {
    range: [1, 10]
  };

  message = validate(context, 1, cloneOptions(options));
  assert.equal(message, "This field is reserved");

  message = validate(context, 5, cloneOptions(options));
  assert.equal(message, "This field is reserved");

  message = validate(context, 10, cloneOptions(options));
  assert.equal(message, "This field is reserved");

  message = validate(context, 0, cloneOptions(options));
  assert.equal(message, true);

  message = validate(context, 100, cloneOptions(options));
  assert.equal(message, true);
});

test('range type check - number', function(assert) {
  assert.expect(4);

  options = {
    range: [1, 10]
  };

  message = validate(context, 1, cloneOptions(options));
  assert.equal(message, "This field is reserved");

  message = validate(context, 5, cloneOptions(options));
  assert.equal(message, "This field is reserved");

  message = validate(context, '1', cloneOptions(options));
  assert.equal(message, true);

  message = validate(context, '5', cloneOptions(options));
  assert.equal(message, true);
});

test('range type check - string', function(assert) {
  assert.expect(4);

  options = {
    range: ['a', 'z']
  };

  message = validate(context, 'a', cloneOptions(options));
  assert.equal(message, "This field is reserved");

  message = validate(context, 'z', cloneOptions(options));
  assert.equal(message, "This field is reserved");

  message = validate(context, 97, cloneOptions(options));
  assert.equal(message, true);

  message = validate(context, 'zzz', cloneOptions(options));
  assert.equal(message, true);
});
