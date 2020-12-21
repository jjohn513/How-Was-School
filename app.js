const express = require("express");

//express app
const app = express();

// register view engine

app.set("view engine", "ejs");
// app.set('views','myviews')

// listen for requsts
app.listen(3200);

// middleware and static files
app.use(express.static("public"));

app.get("/", (req, res) => {
  // 2nd way.ejs view engine.
  res.render("index", { title: "Home" });
});

app.get("/tutor", (req, res) => {
  // 2nd way.ejs view engine.
  res.render("tutor", { title: "Tutor", });
});


app.get("/calendar", (req, res) => {
  res.render("calendar", { title: "Calendar" });
});

app.get("/donate", (req, res) => {
  res.render("donate", { title: "Donate" });
});

//404 page  needs to go to the bottom. must use status(404).
app.use((req, res) => {
  // first way
  // res.status(404).sendFilesendFile('./views/404.html', { root: __dirname})
  res.status(404).render("404", { title: "404" });
});
