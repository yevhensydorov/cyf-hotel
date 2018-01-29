const SERVER_PORT = process.env.PORT || 8080;

const express = require("express");
const exphbs = require("express-handlebars");
const bodyparser = require("body-parser");
const fetch = require('node-fetch');

const apiRouter = require("./api");

const app = express();
const router = express.Router();

app.engine(
  "hbs",
  exphbs({
    defaultLayout: "main",
    extname: "hbs"
  })
);
app.set("view engine", "hbs");

app.use(express.static("public"));
app.use(express.static("assets"));

app.use("/api", apiRouter);

// handle HTTP POST requests
app.use(bodyparser.json());

app.get("/", function(req, res, next) {
  res.render("home");
});

app.get("/reservations/:id?", function(req, res, next) {
	const resJson = "http://localhost:8080/api/reservations";

  fetch(resJson)
    .then(function(res) {
        return res.json();
    }).then(function(body) {
    	if(req.params.id){
  			res.render("reservations", { reservations: body.reservations.filter(reservation => reservation.id === parseInt(req.params.id)) });
    	} else {
  			res.render("reservations", { reservations: body.reservations });
  		}
    }).catch(function(err) {
        console.log(err);
    });
});

app.listen(SERVER_PORT, () => {
  console.info(`Server started at http://localhost:${SERVER_PORT}`);
});
