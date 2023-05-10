const mongoose = require('mongoose')
const app = require('./app')
require('dotenv').config();

const {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    API_VERSION, 
    IP_SERVER
} = require('./constants')

const PORT = process.env.PORT || 3977
console.log(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`)
mongoose
    .connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Successfull conection to the data base')

        app.listen(PORT, () => {
            console.log('####################')
            console.log('##### API REST #######')
            console.log('######################')

            console.log(`http://${IP_SERVER}:${PORT}/api/${API_VERSION}`)
        })
    })
    .catch((error) => {
        console.error('Error connecting to the data base\n' + error.message)
    })