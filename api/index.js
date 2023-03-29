const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 8000;

const db = require('./config/postgres');
const client = require('./config/mqtt');

app.use(bodyParser.urlencoded({extended:false}));
app.use('/', require('./routes'));

app.listen(port, function(err){
    if(err){
        console.log(`Server can not run: ${err}`);
    }

    console.log(`Server is up and running on port: ${port}`);
});