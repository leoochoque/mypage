const express = require("express");
const cors = require("cors");
const app = express();
const db = require("../mongodb/index.js");

app.use(cors());
app.use(express.json());

app.get("/persons", (req, res) => {
  db.getData().then((resDb) => res.json(resDb));
});

app.get("/persons/:id", (req, res, next) => {
  db.getDataById(req.params.id)
    .then((resDb) => res.json(resDb))
    .catch((e) => next(e));
});

app.post("/persons", (req, res, next) => {
  db.addPerson(req.body)
    .then((resDb) => res.status(201).json(resDb))
    .catch((e) => next(e));
});

app.put("/persons/:id", (req, res, next) => {
  db.updatePerson(req.params.id, req.body)
    .then(() => res.status(204).end())
    .catch((e) => next(e));
});

app.delete("/persons/:id", (req, res, next) => {
  db.deletePerson(req.params.id)
    .then(() => res.status(204).end()).catch((e) => next(e));
});

app.use("*", (req, res) => res.status(404).send("Not valid request"));

const errorHandle = (error, req, res) => {
  console.log("error sv: ", error);
  res.status(400).json(error);
};

app.use(errorHandle);

app.listen(3000, () => console.log("Server Running! Port: 3000"));
