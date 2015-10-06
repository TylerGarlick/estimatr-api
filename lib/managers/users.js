'use strict';

let _ = require('lodash');
let Promise = require('bluebird');
let Bcrypt = Promise.promisifyAll(require('bcryptjs'));
let RethinkDbManager = require('./infrastructure/rethinkdb');
let Moment = require('moment');
let Hat = require('hat');
let Schemas = require('../schemas');
let UserSchema = Schemas.schemas.user;
let Validator = Schemas.validator;


const SALT_WORK_FACTOR = 10;
const hash = Symbol('hash');

class UsersManager extends RethinkDbManager {

  constructor() {
    super('users');
  }

  authenticate(email, password) {
    return this.byEmail(email).then((user) => {
      if (user) {
        if (Bcrypt.compareSync(password, user.password)) {
          return Promise.resolve(user);
        }
      }
      return Promise.reject(new Error(`Wrong email or password`));
    });
  }

  changePassword(id, password) {
    return this[hash](password)
      .then((hashedPassword) => {
        return this.table.get(id).update({ password: hashedPassword }).run();
      });
  }

  byEmail(email) {
    return this.table.filter({ email }).run()
      .then((results) => {
        return _.first(results);
      });
  }

  byToken(token) {
    return this.table.filter({ token }).run()
      .then((results) => {
        return _.first(results);
      });
  }

  createUser(user) {
    return Validator.validate(user, UserSchema.User)
      .then((user) => {
        return this.byEmail(user.email)
          .then((existingUser) => {
            if (!existingUser) {
              return this[hash](user.password).then((password) => {
                delete user.password;
                user.password = password;
                return this.create(user);
              });
            }
            return Promise.reject(new Error(`User with email ${user.email} already exists`));
          });
      });
  }

  update(id, user) {
    user = _.omit(user, 'createdAt', 'token', 'password');
    user.updatedAt = Moment().utc().toDate();
    return super.update(id, user);
  }

  [hash](password) {
    return Bcrypt.genSaltAsync(SALT_WORK_FACTOR)
      .then(function (salt) {
        return Bcrypt.hashAsync(password, salt);
      });
  }

}

module.exports = UsersManager;