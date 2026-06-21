const { readDB } = require('./src/lib/db.js');
console.log("Reading DB...");
const db = readDB();
console.log("DB Read Success!", Object.keys(db));
