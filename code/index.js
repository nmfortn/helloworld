const express = require('express');
const mysql = require('mysql');
const config = require('./config');

// create express app
const app = express();

//get database connection
var connection = mysql.createConnection({

  //from config
  host : config.host,
  user : config.user,
  password : config.password,
  database : config.database

});

connection.connect(function(error) {
  if (!!error){
    console.log('error connecting to db');
  } else {
    console.log('successfully connected to db');
  }
});

//Get content from DB : promise version
//print table content when requested
app.get('/', (req, res) => {

  var promise = new Promise(function(resolve, reject) {
    if (!connection || connection.state == 'disconnected') {
      //error case as connection is not established
      console.log("connection object not found");
      resolve("connection object not found");
    } else {
      connection.query(config.query, function(error, results, fields) {
        if (!!error) {
          //error case
          console.log(error);
          reject(Error("error in query"));
        } else {
          //success case
          resolve(results);
        }
      });
    }
  });
  
  promise.then(function(result) {
    var jsonoutput = JSON.stringify(result);
    console.log(jsonoutput); // "Stuff worked!"
    res.status(200).send("Output from DB (output as json) ::==-->> " + jsonoutput);
  }, function(err) {
    console.log(err); // Error: "It broke"
  });

});

app.get('/healthcheck', (req, res) => {
  res.status(200).send('ok');
});

// listen for requests
var port = 9000;
app.listen(port, () => {
  console.log("Server is listening on port :", port);
});
