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
     const  results = await db.collection("cocktails").aggregate( [
      { $match: { Bartender: { $ne: null } } },
      {
        $group: {
          _id: "$Bartender",
          total_recipies: { $sum: 1 },
          Location: { $first: "$Location" },
          Bar_Company: { $first: "$Bar_Company" },
        },
      },
      {
        $project: {
          recipies: "$total_recipies",
          Location: "$Location",
          Bar_Company: "$Bar_Company"
        },
      },
      { $set: { name: "$_id", _id: "$total_recipies" } },
    ]).toArray();
    console.log("here are the results");
    console.log(results);
  } catch (error) {
    console.log(error);
  }
}
main();
