'use strict';

let _ = require('lodash');
let Promise = require('bluebird');
let r = require('../../../config').rethinkdb;

class RethinkDbManager {

  constructor(tableName) {
    this.r = r;
    this.table = this.r.table(tableName);
  }

  all() {
    return this.table.run();
  }

  filter(predicate) {
    return this.table.filter(predicate).run();
  }

  byId(id) {
    return this.table.get(id).run();
  }

  create(entity) {
    return this.table.insert(entity).run().then((result) => {
      let key = _.first(result.generated_keys);
      return this.byId(key);
    });
  }

  update(id, entity) {
    return this.table.get(id).update(entity).run();
  }

  remove(id) {
    return this.table.get(id).delete().run();
  }

  removeByFilter(predicate) {
    return this.table.filter(predicate).delete().run();
  }

}

module.exports = RethinkDbManager;