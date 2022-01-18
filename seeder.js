const { MongoClient } = require("mongodb");
require("dotenv").config();
const fs = require("fs").promises;
const path = require("path");
const loading = require("loading-cli");
const { MONGODB_URI, MONGODB_PRODUCTION_URI } = process.env;


/**
 * constants
 */
const client = new MongoClient(
  process.env.NODE_ENV === "production" ? MONGODB_PRODUCTION_URI : MONGODB_URI);

async function main() {
  try {
    await client.connect();
    const db = client.db();
    const results = await db.collection("cocktails").find({}).count();


    if (results) {
      console.info("deleting collection");
      await db.collection("cocktails").drop();
      await db.collection("bartenders").drop();
    }

    const load = loading("importing your cocktail recipies 🍷!!").start();



    const data = await fs.readFile(path.join(__dirname, "cocktail-dataset.json"), "utf8");
    await db.collection("cocktails").insertMany(JSON.parse(data));



    const cocktailBartenderRef = await db.collection("cocktails").aggregate([
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
    ]);



    const cocktailBartender = await cocktailBartenderRef.toArray();
    await db.collection("bartenders").insertMany(cocktailBartender);
    cocktailBartender.forEach(async ({ _id, name }) => {

      await db
        .collection("bartenders")
        .updateMany({Location: "" }, [
          { $set: {Location: null } },
        ]);
      await db
        .collection("bartenders")
        .updateMany({Bar_Company: "" }, [
          { $set: {Bar_Company: null } },
        ]);


    });



    const updatedcocktailBartenderRef = db.collection("bartenders").find({});
    const updatedcocktailBartender = await updatedcocktailBartenderRef.toArray();
    updatedcocktailBartender.forEach(async ({ _id, name }) => {
      await db
        .collection("cocktails")
        .updateMany({ Bartender: name }, [
          { $set: { Bartender_id: _id} },
        ]);

      await db
        .collection("cocktails")
        .updateMany({Bartender: "" }, [
          { $set: {Bartender: null } },
        ]);

      await db
        .collection("cocktails")
        .updateMany({Bar_Company: "" }, [
          { $set: {Bar_Company: null } },
        ]);

      await db
        .collection("cocktails")
        .updateMany({Location: "" }, [
          { $set: {Location: null } },
        ]);

      await db
        .collection("cocktails")
        .updateMany({Garnish: "" }, [
          { $set: {Garnish: null } },
        ]);

      await db.collection("cocktails").aggregate([
          { $group: { _id: "$Glassware" } },
          { $project: { name: "$_id", "_id": 0 } },
          { $out: "glasswares" }
      ]).toArray()

      await db
        .collection("cocktails")
        .updateMany({Notes: "" }, [
          { $set: {Notes: null } },
        ]);

      load.stop();
      console.info(
        `Cocktail collection set up! 🍷🍷🍷🍷🍷🍷🍷`
      );
      process.exit();
    });
  } catch (error) {
    console.error("error:", error);
    process.exit();
  }
}

main();
