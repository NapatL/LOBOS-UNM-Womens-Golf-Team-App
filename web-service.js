let { MongoClient } = require("mongodb")
let uri = "mongodb://localhost:27017"
let client = new MongoClient(uri)

let express = require("express")
let path    = require("path")

let app  = express()
let port = 7777

app.use(express.static("www"))
app.use(express.json())

app.listen(port, function() {
    console.log(`Full-stack app is listening on port ${port}`)
})

app.get("/helloworld", function (req, res) {
    res.send("Hello World: Napat Lertsadwattana!")
})

app.get("/retrieve", function (req, res) {
    async function run() {
        try {
          await client.connect()
          database = client.db('lobosgolfteamdb')
          table = database.collection('teamstatsinfo')
          query = {}
          rows = await table.find(query)
          res.send(JSON.stringify(await rows.toArray()))
        } finally {
          await client.close()
        }
      }
      run()
})

app.get("/retrieve-one/:playerid", function(req, res) {
    async function run() {
        try {
          await client.connect()
          database = client.db('lobosgolfteamdb')
          table = database.collection('teamstatsinfo')
          query = {playerid:parseInt(req.params.playerid)}  
          row = await table.findOne(query)
          res.send(JSON.stringify(row))
        } finally {
          await client.close()
        }
      }
      run()
})

app.post("/create", function (req, res) {
    async function run() {
        try {
            await client.connect()
            database = client.db("lobosgolfteamdb")
            table = database.collection("teamstatsinfo")
        
            //console.log ("Number Of Rows="+numberOfRows)
            record   = {
                playerid                : parseInt(req.body.playerid),
                playername              : req.body.playername,
                playerage               : parseInt(req.body.playerage),
                playernationality       : req.body.playernationality,
                playerworldranking      : parseInt(req.body.playerworldranking),
                playerrounds            : parseInt(req.body.playerrounds),
                playerstrokes           : parseInt(req.body.playerstrokes),
                playerparrounds         : parseInt(req.body.playerparrounds),
                playerevents            : parseInt(req.body.playerevents),
                playertop5              : parseInt(req.body.playertop5),
                playertop10             : parseInt(req.body.playertop10),
                playerdate              : new Date()
            }
            result = await table.insertOne(record)
//            res.send(JSON.stringify(req.body)) // echo body
        } finally {
            await client.close()
        }
    }
    run()
})

app.delete("/delete/:playerid", function(req, res) {
    async function run() {
        try {
            await client.connect()
            database = client.db("lobosgolfteamdb")
            table    = database.collection("teamstatsinfo")
            query    = { playerid: parseInt(req.params.playerid) }
            result   = await table.deleteOne(query)
        } finally {
            await client.close()
        }
    }
    run()
})

app.put("/update", function(req, res) {
    async function run() {
        try {
            await client.connect()
            database  = client.db("lobosgolfteamdb")
            table     = database.collection("teamstatsinfo")
            where     = {playerid: parseInt(req.body.playerid)}
            changes   = {$set:{
                playerid              : parseInt(req.body.playerid),
                playername            : req.body.playername,
                playerage             : parseInt(req.body.playerage),
                playernationality     : req.body.playernationality,
                playerworldranking    : parseInt(req.body.playerworldranking),
                playerrounds          : parseInt(req.body.playerrounds),
                playerstrokes         : parseInt(req.body.playerstrokes),
                playerparrounds       : parseInt(req.body.playerparrounds),        
                playerevents          : parseInt(req.body.playerevents),
                playertop5            : parseInt(req.body.playertop5),
                playertop10    : parseInt(req.body.playertop10)}}
            result    = await table.updateOne(where, changes)
        } finally {
            await client.close()
        }
    }
    run()
})