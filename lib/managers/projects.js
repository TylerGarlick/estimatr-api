'use strict';

let _ = require('lodash');
let Promise = require('bluebird');
let Moment = require('moment');
let RethinkDbManager = require('./infrastructure/rethinkdb');

class ProjectsManager extends RethinkDbManager {

  constructor() {
    super('projects');
  }

  allByUser(user) {
    return this.table.filter(r.row('users').contains(user.id).or(r.row('owner').eql(user.id))).run();
  }

  byId(id) {
    return this.table.get(id).run();
  }

  create(owner, project) {
    project.createdAt = Moment().utc().toDate();
    project.users = [];
    project.owner = owner.id;
    project._state = {
      cards: { visible: false },
      users: {},
      stories: {}
    };
    project.isActive = true;
    return super.create(project);
  }

  update(id, project) {
    project = _.omit(project, 'createdAt', 'owner');
    project.updatedAt = Moment().utc().toDate();
    return super.update(id, project);
  }
}

module.exports = ProjectsManager;