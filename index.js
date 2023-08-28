const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});