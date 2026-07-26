const Datastore = require('nedb-promises');
const path = require('path');

const usersDB = Datastore.create(path.join(__dirname, 'data/users.db'));
const moodsDB = Datastore.create(path.join(__dirname, 'data/moods.db'));

module.exports = { usersDB, moodsDB };
