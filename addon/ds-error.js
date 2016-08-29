/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import requireModule from 'ember-validators/utils/require-module';

const DS = requireModule('ember-data');

if (!DS) {
  throw new Error('Ember-Data is required to use the DS Error validator.');
}

const {
  get,
  isNone
} = Ember;

/**
 *  @class DS Error
 *  @module Validators
 */
export default function validateDsError(value, options, model, attribute) {
  let { path, key } = getPathAndKey(attribute);

  const errors = get(model, path);

  if (!isNone(errors) && errors instanceof DS.Errors && errors.has(key)) {
    return get(errors.errorsFor(key), 'lastObject.message');
  }

  return true;
}

export function getPathAndKey(attribute) {
  let path = attribute.split('.');
  let key = path.pop();

  path.push('errors');

  return { path: path.join('.'), key };
}
