const express = require("express");
const nunjucks = require("nunjucks");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const {
  getProducts,
  getOneProduct,
  setProducts,
  updateOneProduct,
} = require("./share");

const server = express();

nunjucks.configure("views", {
  autoescape: true,
  express: server,
  noCache: true,
  watch: true,
});

server.use(bodyParser.urlencoded());

server.use(methodOverride());

server.set("views", "./views");

server.set("view engine", "njk");

server.get("/", (req, res) => {
  getProducts().then((products) => {
    res.render("index.njk", { products });
  });
});

server.put("/form/:id", (req, res) => {
  const {
    params: { id },
    body: { name, price } = {},
  } = req;
  console.log("123");
  updateOneProduct(id, { name, price }).then((product) => {
    console.log(product);
    res.redirect("/");
  });
});

server.post("/form", (req, res) => {
  const { body: { name, price } = {} } = req;
  setProducts(name, price).then((product) => {
    res.redirect("/");
  });
});

server.get("/form/:id?", (req, res) => {
  const {
    params: { id = false },
  } = req;

  if (!id) {
    return res.render("form.njk", { id, name: "", price: 0 });
  }

  getOneProduct(id).then((product) => {
    res.render("form.njk", product);
  });
});

server.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

server.listen(3333, () => {
  console.log("Running in http://localhost:3333");
});
