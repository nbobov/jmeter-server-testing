const sqlite3 = require('sqlite3');
const path = require('path');

const DB_PATH = path.resolve(__dirname, '../data/db.sqlite');

const getDb = () => {
    const db = new sqlite3.Database(DB_PATH);

    db.serialize(() => {
        db.run('PRAGMA foreign_keys = ON');
    });

    return db;
}

module.exports = {getDb, DB_PATH};