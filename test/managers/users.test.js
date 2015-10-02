'use strict';

let UsersManager = require('../../lib/managers/users');


describe('UsersManager', () => {

  let usersManager;
  before(() => {
    usersManager = new UsersManager();
    expect(usersManager).to.be.ok;
  });

  describe('#findByEmail(email)', () => {

    beforeEach((done) => {
      r.table('users').delete().run()
        .then(() => {
          done();
        })
        .catch(done);
    });

    it(`shouldn't find a user that hasn't been created yet`, (done) => {
      const email = 'tjgarlick@gmail.com';
      usersManager.byEmail(email)
        .then((user) => {
          expect(user).to.not.be.ok;
          done();
        })
        .catch(done);
    });

    it(`should find a user after the user has been created`, (done) => {
      let user = { firstName: 'Tyler', lastName: 'Garlick', password: 'Hello World' };
      usersManager.create(user)
        .then((saved) => {
          return usersManager.byEmail(user.email).then((found) => {
            expect(saved).to.be.eql(found);
            expect(found.email).to.be.eql(user.email);
            done();
          });

        })
        .catch(done);
    });

  });
});