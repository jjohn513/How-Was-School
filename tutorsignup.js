//Setting up the login App//
const express = require('express')
const ejs = require('ejs')
const app = express()


app.use(express.static("public"))
app.set('view engine', 'ejs')



//Get Requests
app.get("/", (req, res) => {
    res.render("signup.ejs")
})

app.get("/signup", (req, res) => {
    res.render("fillout.js")
})

app.listen(3000, () => console.log("New Server On Port 3000"))