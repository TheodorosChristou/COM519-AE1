/**
 * You can use this to quickly run queries where you don't have access to
 * the mongoDB shell (e.g, at university)
 */
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGODB_URI } = process.env;
console.log(MONGODB_URI);
const client = new MongoClient(MONGODB_URI);
console.log("running");
async function main() {
  try {
    await client.connect();
    const db = client.db("cocktailDatabase");
    const collection = db.collection("cocktails");
    // type in your query down here
     const  results = await db.collection("cocktails").aggregate([
      {$group: {_id: "$Glassware"}},
      {$project: {name: "$_id", "_id" : 0}},
    ]).toArray();
    console.log("here are the results");
    console.log(results);
  } catch (error) {
    console.log(error);
  }
}
main();
