'use strict';

let Schemas = require('../../lib/schemas');
let Validator = Schemas.validator;
let UserSchema = Schemas.schemas.user;
let _ = require('lodash');

const user = { firstName: 'Tyler', lastName: 'Garlick', email: 'tjgarlick@gmail.com', password: 'test123' };
describe('User Schema', () => {

  describe('BasicUser', () => {

    it('should be valid', (done) => {
      Validator.validate(user, UserSchema.BasicUser)
        .then((user) => {
          expect(user).to.be.ok;
          done();
        })
        .catch(done);
    });

    it('should fail on password', (done) => {
      let invalidUser = { firstName: 'Tyler', lastName: 'Garlick', email: 'tjgarlick@gmail.com', password: '123' };
      Validator.validate(invalidUser, UserSchema.BasicUser)
        .then(() => {
          done(new Error(`Should fail on password`));
        })
        .catch((err) => {
          expect(err.details).to.be.lengthOf(1);

          let error = _.first(err.details);
          expect(error.message).to.contain('password');
          done();
        });
    });

  });

  describe('User', () => {

    it(`should provide sensible defaults`, (done) => {
      Validator.validate(user, UserSchema.User)
        .then((result)=> {
          expect(result.isActive).to.be.ok;
          expect(result.token).to.be.ok;
          expect(result.createdAt).to.be.ok;
          done();
        })
        .catch(done);
    });

  });

});