var express = require('express');
var mysql = require('mysql');
var app = express();
var con = mysql.createConnection({
    host: "localhost",
    user: "dev",
    password: "dev",
    database: "dataset"
});

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
})
con.connect(function (err) {
    if (err) throw err; {
        console.log("Connected!");
    }
})
        ////q1
        app.get('/allWins', function (req, res) {
            var sql = "SELECT season AS year,count(id) AS matches FROM matches GROUP BY season;";
            con.query(sql, function (err, result) {
                if (err) throw err;
                //console.log(result);
                res.json(result);
            });
        })
        ////q2
        app.get('/matchesWon', function (req, res) {
            var a1 = "SELECT season,winner,count(winner) as count from (select * from matches where winner !='')as result group by season,winner order by season;";
            con.query(a1, function (err, result) {
                if (err) throw err;
                // console.log(result);
                res.json(result);
            });
        })
        ////q3
        app.get('/extraRuns', function (req, res) {
            var sql = "SELECT deliveries.bowling_team, sum(deliveries.extra_runs) FROM matches JOIN deliveries ON matches.id = deliveries.match_id WHERE (deliveries.extra_runs>0 AND matches.season=2016)  GROUP BY deliveries.bowling_team";
            con.query(sql, function (err, result) {
                if (err) throw err;
                // console.log(result);
                res.json(result);
            });
        })


        //q4-For the year 2015 plot the top economical bowlers.
        app.get('/topBowlers', function (req, res) {
            var query = "SELECT deliveries.bowler as bowlers, sum(deliveries.total_runs) as runs, (COUNT(deliveries.ball=1)/6) AS overs, sum(deliveries.total_runs)/(count(deliveries.ball=1)/6) as eco from matches JOIN deliveries ON deliveries.match_id=matches.id where matches.season=2015 GROUP BY deliveries.bowler ORDER BY eco;";
            con.query(query, function (err, result) {
                if (err) throw err;
                // console.log(result);
                res.json(result);
            })
        })


        //q5
        app.get('/kingsXI', function (req, res) {
            var sql = "Select season AS year, count(winner='Kings XI Punjab') AS wins from matches GROUP BY season;";
            con.query(sql, function (err, result) {
                if (err) throw err;
                // console.log(result);
                res.json(result);
            });
        })
    

app.listen(3000);