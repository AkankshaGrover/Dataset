const csv = require('csvtojson');
const express = require('express');
const fs = require('fs');
app = express();
let map = {};
let result;
let arr = [];
let economy = [];
var names = [];

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});


////////////Q1
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
            result = Object.keys(map).map(function (key) {
                return (Number(key), map[key]);
            });
        }
        res.json(map);
        console.log(map);
        map = {};
    });

});

// app.get('/matchesWon', function(req, res){
//     res.header("Content-Type", "application/json");
//     fs.readFile('./matches.json', 'utf-8', function readFileCallback(err, data) {
//         if (err) 
//         {
//             console.log(err);
//         }
//         else {
//            // debugger;
//             let content = JSON.parse(data);
//             let Obj= {};
//           content.forEach(a=>{
//                 if (Obj[a.season] != undefined)
//                    { 
//                     let temp = Obj[a.season];
//                        if(temp[a.winner]!=undefined)
//                         {
//                             temp[a.winner] += 1;
//                         }
//                      else
//                        {
//                             temp[a.winner] = 1;
//                        }
//                    }
//                 else
//                     Obj[a.season] = {};
//             });  
//             console.log(Obj);   
//             res.json(Obj); 

//         //    console.log(seriesInput);
//         }
//     })
// })

///////////Q3- Extra Runs conceeded in year 2016
app.get('/extraRuns', function (req, res) {
    res.header("Content-Type", "application/json");

    fs.readFile('./matches.json', 'utf-8', function readFileCallback(err, data) {

        let content = JSON.parse(data);
        content.forEach(a => {
            if (a.season == 2016) {
                arr.push(a.id);
            }
        })
    })

    fs.readFile('./deliveries.json', 'utf-8', function readFileCallback(err, data) {

        let content = JSON.parse(data);
        content.forEach(a => {
            for (let i = 0; i < arr.length; i++) {
                if (a.match_id == arr[i]) {
                    if (map[a.bowling_team] != undefined)
                        map[a.bowling_team] += parseInt(a.extra_runs);
                    else
                        map[a.bowling_team] = 0;
                }
            }
        });
        result = Object.keys(map).map(function (key) {
            return (Number(key), map[key]);
        });
        res.json(map);
        map = {};
        arr = [];
    });
});


//////////Q4-top economical bowlers of 2015
app.get('/topBowlers', function (req, res) {
    res.header("Content-Type", "application/json");

    fs.readFile('./matches.json', 'utf-8', function readFileCallback(err, data) {

        let content = JSON.parse(data);
        content.forEach(a => {
            if (a.season == 2015) {
                arr.push(a.id);
            }
            // console.log(arr);
        })
    })

    fs.readFile('./deliveries.json', 'utf-8', function readFileCallback(err, data) {

        let content = JSON.parse(data);
        let over = 0;
        content.forEach(a => {
            for (let i = 0; i < arr.length; i++) {
                if (a.match_id == arr[i]) {
                    if (map[a.bowler] != undefined) {
                        if (map[a.bowler]["overs"] != undefined && map[a.bowler]["runs"] != undefined) {
                            map[a.bowler]["runs"] += JSON.parse(a.total_runs);
                            if (a.ball == 1) {
                                map[a.bowler]["overs"] += 1;
                            }
                        }
                        else {
                            map[a.bowler]["overs"] = 1;
                            map[a.bowler]["runs"] = JSON.parse(a.total_runs);
                        }
                    }
                    else {
                        map[a.bowler] = { "overs": "", "runs": "" };
                        map[a.bowler]["runs"] = JSON.parse(a.total_runs);
                        if (a.ball == 1) {
                            map[a.bowler]["overs"] = 1;
                        }
                    }

                }
            }
            for (let j in map) {
                map[j]["economy"] = (map)[j]["runs"] / (map)[j]["overs"];
            }

        });
        let i = 0;
        names = Object.keys(map);
        let dataToBeSent = [];
        for (let j in names) {
            dataToBeSent.push({ name: names[j], economy: Object.values(map)[j].economy })

        }
        dataToBeSent.sort(function (a, b) {
            return (a.economy - b.economy);
        })
        res.json(dataToBeSent);
    });

    dataToBeSent = {}
    map = {};
    arr = [];
})

/////////Q5- wins of kingsXI over the years
app.get('/kingsXI', function (req, res) {
    let dataToBeSent = {};
    res.header("Content-Type", "application/json");

    fs.readFile('./matches.json', 'utf-8', function readFileCallback(err, data) {

        let content = JSON.parse(data);
        content.forEach(a => {
            if (dataToBeSent[a.season] != undefined) {
                if (a.winner == "Kings XI Punjab")
                    dataToBeSent[a.season] += 1;
            }
            else
                dataToBeSent[a.season] = 1;
        })
        // console.log(dataToBeSent);
        res.json(dataToBeSent);
    })

    dataToBeSent = {};
})


app.listen(3000);


