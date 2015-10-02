'use strict';

let Joi = require('joi');
let Hat = require('hat');
let Moment = require('moment');

let BasicUser = Joi.object({
  firstName: Joi.string().required().min(2).trim().description(`First Name`),
  lastName: Joi.string().required().min(2).trim().description(`Last Name`),
  email: Joi.string().email().lowercase().required().trim().description(`Email Address`),
  password: Joi.string().required().min(7).trim().description('Password')
});

let User = BasicUser.concat(Joi.object({
  isActive: Joi.bool().default(true).description('Is Active'),
  token: Joi.string().default(Hat()).description('Api Token'),
  createdAt: Joi.date().description('Created At').default(Moment().utc().toDate()),
  updatedAt: Joi.date().description('Updated At')
}));

module.exports = { BasicUser, User };