const SERVER_PORT = process.env.PORT || 8080;

const express = require("express");
const exphbs = require("express-handlebars");
const bodyparser = require("body-parser");
const fs = require("fs");

const apiRouter = require("./api");

const app = express();
const router = express.Router();

const filePath = `${__dirname}/public/data/reservations.json`;

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

app.get("/reservations/:id?", (req, res, next) => {
	fs.readFile(filePath, (error, file) => {
		const parsedFile = JSON.parse(file);
		if(req.params.id){
			res.render("reservations", { reservations: parsedFile.filter(reservation => reservation.id === parseInt(req.params.id)) });
	  } else {
			res.render("reservations", { reservations: parsedFile });
		}
	});
});

app.listen(SERVER_PORT, () => {
  console.info(`Server started at http://localhost:${SERVER_PORT}`);
});
