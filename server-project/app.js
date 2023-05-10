const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors')
const { API_VERSION } = require('./constants')

const app = express();
/* work with the extension client rest */
app.use(bodyParser.json())
/** void cors problems */
app.use(cors())
/** request with postman */
app.use(bodyParser.urlencoded({ extended: true }))

const authRoutes = require('./src/routes/auth');
//const userRoutes = require('./src/routes/user');

app.use(`/api/${API_VERSION}/auth`, authRoutes)
// app.use(`api/${API_VERSION}`, userRoutes)

module.exports = app
