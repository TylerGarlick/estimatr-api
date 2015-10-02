'use strict';

let Promise = require('bluebird');
let Joi = require('joi');

class Validator {
  static validate(value, schema) {
    return new Promise((resolve, reject) => {
      return Joi.validate(value, schema, {}, (err, value) => {
        if (err) return reject(err);
        return resolve(value);
      });
    });
  }
}

module.exports = Validator;