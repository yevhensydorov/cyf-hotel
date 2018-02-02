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


app.get("/", (req, res, next) => {
  res.render("home");
});

app.get("/form", (req, res, next) => {
	res.render("newReservations")
	
})

app.post("/new-reservation" , (req, res, next) => {
	res.redirect("/form");
})

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

app.post("/reservations", (req, res) => {
	let newReservation = {
		id: req.body.id,
		custId: req.body.custId,
		roomId: req.body.roomId,
		checkInDate: req.body.checkInDate,
		checkOutDate: req.body.checkOutDate,
		roomPrice: req.body.roomPrice,
		note: req.body.note
	};

	fs.readFile(filePath, (error, file) => {
    const parsedFile = JSON.parse(file.toString());
    parsedFile.splice(0, 0, newReservation);

    fs.writeFile(filePath, JSON.stringify(parsedFile, null, 2), error => {});
    res.redirect("/reservations");
  });
});

app.listen(SERVER_PORT, () => {
  console.info(`Server started at http://localhost:${SERVER_PORT}`);
});
