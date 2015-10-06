'use strict';

let UsersManager = require('../../lib/managers/users');
let r = require('../../config').rethinkdb;

describe('UsersManager', () => {

  let usersManager;
  before(() => {
    usersManager = new UsersManager();
    expect(usersManager).to.be.ok;
  });

  beforeEach((done) => {
    r.table('users').delete().run()
      .then(() => {
        done();
      })
      .catch(done);
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
      let user = { firstName: 'Tyler', lastName: 'Garlick', password: 'Hello World', email: 'tjgarlick@gmail.com' };
      usersManager.createUser(user)
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

  describe('#authenticate(email, password)', () => {

    beforeEach((done) => {
      var user = { firstName: 'Tyler', lastName: 'Garlick', email: 'tjgarlick@gmail.com', password: '123Password' };
      usersManager.createUser(user)
        .then((u) => {
          done();
        })
        .catch(done);
    });

    afterEach((done) => {
      r.table('users').delete().run().then(() => {
        done();
      }).catch(done);
    });


    it('should authenticate with valid credentials', (done) => {
      const email = 'tjgarlick@gmail.com';
      const password = '123Password';
      usersManager.authenticate(email, password)
        .then((u) => {
          expect(u).to.be.ok;
          done();
        })
        .catch(done);
    });

    it(`should fail with bad credentials`, (done) => {
      const email = 'tjgarlick@gmail.com';
      const badPassword = 'BadPassword';
      usersManager.authenticate(email, badPassword).then(() => {
        done(new Error('Should throw wrong username / password'));
      }).catch((err) => {
        expect(err.message).to.be.eql('Wrong email or password');
        done();
      });
    });

  });

  describe('#create(user)', () => {

    it(`should create a user`, (done) => {
      let user = { firstName: 'Tyler', lastName: 'Garlick', email: 'tjgarlick@gmail.com', password: '5orange5' };
      usersManager.createUser(user)
        .then((savedUser) => {
          expect(user.email).to.be.eql(savedUser.email);
          expect(user.password).to.not.eql(savedUser.password);
          done();
        }).catch(done);

    });

  });

  describe('#update(user)', () => {

    let user;
    beforeEach((done) => {
      user = { firstName: 'Tyler', lastName: 'Garlick', email: 'tjgarlick@gmail.com', password: '123Password' };
      usersManager.createUser(user)
        .then((u) => {
          user = u;
          done();
        })
        .catch(done);
    });

    afterEach((done) => {
      r.table('users').delete().run().then(() => {
        done();
      }).catch(done);
    });

    it(`should allow a user to update their names`, (done) => {
      user.firstName = 'TJ';
      usersManager.update(user.id, user).then((updatedUser) => {
        expect(updatedUser).to.be.ok;
        done();
      }).catch(done);
    });

  });

  describe('#changePassword(id, password)', () => {

    let user;
    beforeEach((done) => {
      user = { firstName: 'Tyler', lastName: 'Garlick', email: 'tjgarlick@gmail.com', password: '123Password' };
      usersManager.createUser(user)
        .then((u) => {
          user = u;
          done();
        })
        .catch(done);
    });

    afterEach((done) => {
      r.table('users').delete().run()
        .then(() => {
          done();
        })
        .catch(done);
    });

    it(`should allow a user to change their password`, (done) => {
      usersManager.changePassword(user.id, '5orange5')
        .then(() => {
          return usersManager.authenticate(user.email, '5orange5')
            .then((user) => {
              expect(user).to.be.ok;
              done();
            });
        })
        .catch(done);
    });

  });

  describe('#byToken(token)', () => {
    let user;
    beforeEach((done) => {
      usersManager.createUser({
          firstName: 'Tyler',
          lastName: 'Garlick',
          email: 'tjgarlick@gmail.com',
          password: '123Password'
        })
        .then((u) => {
          user = u;
          done();
        })
        .catch(done);
    });

    afterEach((done) => {
      r.table('users').delete().run().then(() => {
        done();
      }).catch(done);
    });

    it(`should get a user by their token`, (done) => {
      usersManager.byToken(user.token)
        .then((foundUser) => {
          expect(user.email).to.be.eql(foundUser.email);
          done();
        }).catch(done);
    })
  });

});