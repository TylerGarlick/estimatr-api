'use strict';

let NConf = require('nconf');
let RethinkDb = require('rethinkdbdash');

NConf.env().argv();

NConf.defaults({
  rethinkdb_host: 'localhost',
  rethinkdb_port: 28015,
  rethinkdb_pool: false,
  rethinkdb_db: 'estimatr_testing'
});

let r = RethinkDb({
  db: NConf.get('rethinkdb_db'),
  //pool: NConf.get('rethinkdb_pool'),
  discovery: true
  //servers: [
  //  { host: NConf.get('rethinkdb_host'), port: NConf.get('rethinkdb_port') }
  //]
});

module.exports.rethinkdb = r;
