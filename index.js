const PORT = process.env.PORT;
var express = require("express");
var cors = require("cors");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require ("mongoose");


// Body-parser
app.use(bodyParser.urlencoded({ extended: true}));

// Express
app.use(express.static(__dirname + '/public'));

// CORS
app.use(cors());

// Connect to database
const secret = "";
var uri = "";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function() {
  console.log("Connection Successful!");
});

// Schema for pokemon database   _id: String, {collection: "pokedb"} //Collection
const pokemonSchema = new mongoose.Schema({
     
        name: String,
        jname: String,
        weight: Number,
        pokedex: Number,
        type: Array,
    },
    {collection: "pokedb"} //Collection
);

const pokemon = mongoose.model('pokedb', pokemonSchema);


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});


// Fetch all records
app.get('/api/getAll', function (req, res) {

    pokemon.find({}, function(err, results) {  
        if(err) {
            res.json("An error has occurred", 500);
        }
        else{
            console.log(results);
            res.json(results, 200);
        }
    });
});

// Fetch only 1 record
app.get('/api/get/:id', function (req, res) {

    // Get ID
    var id = req.params.id;

    pokemon.findById(id, function (err, results) {
        if(err) {
            res.json("An error has occurred", 500);

        }else if (results == null) {
            res.json("Cannot find id: " + id + " from the database");
        }
        console.log(results);
        res.json(results);
    })

});

// Add
app.post('/api/add', function (req, res) {

    pokemon.create(req.body, function (err, post) {
        if(err) {
            res.json("Error occured", 500);
        }
        console.log(req.body);
        res.json(post);
    });
});

// Update
app.put('/api/update/:id', function (req, res) {
       
    var id = req.params.id;

    console.log(req.body);

    pokemon.findByIdAndUpdate(id, req.body, function (err, results) {
         if (err) {
            console.log("Error occured");
            console.log(err);
            res.status(500).send("Update aborted due error");
         }else{
            console.log("Entry with id: "+ id + " updated");
            console.log(results);
            res.json(results,200);
         } 
    });
});


// Delete
app.delete('/api/delete/:id', function (req, res) {
    
    //Get ID
    var id = req.params.id;

    pokemon.findByIdAndDelete(id, function (err, results) {
        if(err) {
            console.log(err);

        }else if(results == null) {
            res.json("No data found");
        }
        else{
            res.json("Deleted pokemon with id: " + id + " " + pokemon.name, 200)
        }
    });
});

app.listen(PORT);
console.log("App running at port:5000")

