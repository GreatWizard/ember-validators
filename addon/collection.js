/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';

const {
  get,
  isArray
} = Ember;

/**
 *  @class Collection
 *  @module Validators
 *  @extends Base
 */
export default function validateCollection(value, options) {
  const isCollection = get(options, 'collection');

  if (isCollection === true && !isArray(value)) {
    return this.createErrorMessage('collection', value, options);
  }

  if (isCollection === false && isArray(value)) {
    return this.createErrorMessage('singular', value, options);
  }

  return true;
}
