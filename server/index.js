const csv = require('csvtojson');
const express = require('express');
const fs = require('fs');
app = express();
let map = {};
/*csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
       //console.log(jsonObj[1]);
        let content = JSON.stringify(jsonObj);

      /*  fs.writeFile("./matches.json", content, 'utf8', function (err) {
            if (err) {
                //  return console.log(err);        
            }
            console.log("done");
        }); 
    })*/

let result;

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

app.get('/', function (req, res) {
    
    res.header("Content-Type", "application/json");
    fs.readFile('./matches.json', 'utf-8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        }
        else {
            let content = JSON.parse(data);
            content.forEach(a => {
                if (map[a.season] != undefined)
                    map[a.season] += 1;
                else
                    map[a.season] = 1;
            });
            //console.log(map);
                result = Object.keys(map).map(function (key) {
                return (Number(key), map[key]);
            });
        }
       // console.log(result)
        res.json(result);
        map = {};
    });
  
});

app.listen(3000);


 