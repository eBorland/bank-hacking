var MongoClient = require('mongodb').MongoClient;
var db;
var connected = false;

/**
 * connect() public method
 * It connects to the MongoDB
 *
 * @param url [REQUIRED] {String} MongoDB url with format mongodb://user:password@host:port/dbname
 * @param callback [REQUIRED] {Function} Callback function
 *
 * @yields db
 */
exports.connect = function (url, callback) {
  MongoClient.connect(url, function (err, _db) {
    if (err) {
      throw new Error('Could not connect: ' + err);
    }
    db = _db;
    connected = true;
    return callback(db);
  });
};

/**
 * collection() public method
 * It gets the collection from the MognoDB
 *
 * @param name [REQUIRED] {String} Collection name
 *
 * @returns collection
 */
exports.collection = function (name) {
  if (!connected) {
    throw new Error('Must connect to Mongo before calling "collection"');
  }
  return db.collection(name);
};
