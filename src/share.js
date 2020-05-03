const { MongoClient, ObjectID } = require("mongodb");
const assert = require("assert");

// Connection URL
const url = "mongodb://localhost:27017";

// Database Name
const dbName = "admin";

let db;

// Use connect method to connect to the server
MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  db = client.db(dbName);
});

const getProducts = () =>
  new Promise((resolve) => {
    db.collection("products")
      .find({})
      .toArray((err, products) => resolve(products));
  });

const getOneProduct = (id) =>
  new Promise((resolve) => {
    db.collection("products").findOne(
      { _id: ObjectID(id) },
      (err, { name, price }) => resolve({ id, name, price })
    );
  });

const setProducts = (name, price) => {
  return new Promise((resolve) => {
    db.collection("products").insertOne(
      { name, price },
      (err, { ops: [product] }) => resolve(product)
    );
  });
};

const updateOneProduct = (id, { name, price }) =>
  new Promise((resolve) => {
    db.collection("products").updateOne(
      { _id: ObjectID(id) },
      { $set: { name, price } },
      (err, product) => resolve(product)
    );
  });

module.exports = { getProducts, getOneProduct, setProducts, updateOneProduct };
