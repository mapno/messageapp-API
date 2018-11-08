const express = require("express");

const bodyParser = require("body-parser");
const {
  Validator,
  ValidationError
} = require("express-json-validator-middleware");

const getMessages = require("./controllers/getMessages");
const updateCredit = require("./controllers/updateCredit");
const getMessageByID = require('./controllers/getMessageByID');
const { handleRequest } = require('./queue');


const app = express();

const validator = new Validator({ allErrors: true });
const { validate } = validator;

const messageSchema = {
  type: "object",
  required: ["destination", "body"],
  properties: {
    destination: {
      type: "string"
    },
    body: {
      type: "string"
    },
    location: {
      name: {
        type: "string"
      },
      cost: {
        type: "number"
      }
    }
  }
};

const creditSchema = {
  type: "object",
  required: ["amount"],
  properties: {
    location: {
      type: "string"
    },
    amount: {
      type: "number"
    }
  }
};

app.post(
  "/messages",
  bodyParser.json(),
  validate({ body: messageSchema }),
  handleRequest
);

app.post(
  "/credit",
  bodyParser.json(),
  validate({ body: creditSchema }),
  updateCredit
);


app.get("/messages", getMessages);

app.get(
  '/messages/:messageID/status',
  getMessageByID
);

app.use(function(err, req, res, next) {
  console.log(res.body);
  if (err instanceof ValidationError) {
    res.sendStatus(400);
  } else {
    res.sendStatus(500);
  }
});

app.listen(9005, function() {
  console.log("App started on PORT 9005");
});