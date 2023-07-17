require('dotenv').config();

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const router = require('./routes');
const { connect } = require('./models/connection');



const app = express();
app.use(express.static('statics'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cors())

connect()

app.use('/', router)

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`app running on port ${port}`);
})
