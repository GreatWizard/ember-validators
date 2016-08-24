/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import requireModule from 'ember-validators/utils/require-module';

const moment = requireModule('moment');

if (!moment) {
  throw new Error('MomentJS is required to use the Date validator. The easiest way to install moment.js is to install ember-moment.\n' +
    'Installation instructions and documentation can be found at https://github.com/stefanpenner/ember-moment');
}

const {
  getWithDefault,
  getProperties,
  isNone,
  isEmpty,
  set
} = Ember;

/**
 *  @class Date
 *  @module Validators
 *  @extends Base
 */

function _parseDate(date, format, useStrict = false) {
  if (date === 'now' || isEmpty(date)) {
    return moment();
  }

  return isNone(format) ? moment(new Date(date)) : moment(date, format, useStrict);
}

export default function validateDate(context, value, options) {
  const errorFormat = getWithDefault(options, 'errorFormat', 'MMM Do, YYYY');
  const { format, precision, allowBlank } = getProperties(options, ['format', 'precision', 'allowBlank']);
  let { before, onOrBefore, after, onOrAfter } = getProperties(options, ['before', 'onOrBefore', 'after', 'onOrAfter']);
  let date;

  if (allowBlank && isEmpty(value)) {
    return true;
  }

  if (format) {
    date = _parseDate(value, format, true);
    if (!date.isValid()) {
      return context.createErrorMessage('wrongDateFormat', value, options);
    }
  } else {
    date = _parseDate(value);
    if (!date.isValid()) {
      return context.createErrorMessage('date', value, options);
    }
  }

  if (before) {
    before = _parseDate(before, format);
    if (!date.isBefore(before, precision)) {
      set(options, 'before', before.format(errorFormat));
      return context.createErrorMessage('before', value, options);
    }
  }

  if (onOrBefore) {
    onOrBefore = _parseDate(onOrBefore, format);
    if (!date.isSameOrBefore(onOrBefore, precision))  {
      set(options, 'onOrBefore', onOrBefore.format(errorFormat));
      return context.createErrorMessage('onOrBefore', value, options);
    }
  }

  if (after) {
    after = _parseDate(after, format);
    if (!date.isAfter(after, precision)) {
      set(options, 'after', after.format(errorFormat));
      return context.createErrorMessage('after', value, options);
    }
  }

  if (onOrAfter) {
    onOrAfter = _parseDate(onOrAfter, format);
    if (!date.isSameOrAfter(onOrAfter, precision)) {
      set(options, 'onOrAfter', onOrAfter.format(errorFormat));
      return context.createErrorMessage('onOrAfter', value, options);
    }
  }

  return true;
}
