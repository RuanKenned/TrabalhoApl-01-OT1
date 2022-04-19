const { request, response } = require("express");
var cors = require('cors');
var yasmij = require("yasmij");
const express = require("express");
const app = express();

var bodyParser = require('body-parser');

app.use(express.json());
app.use(cors());


// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.post("/calcular", (request, response) => {    
    const body = request.body; 
    console.log(body);
    var output = yasmij.solve(body);
    console.log(output);
    return response.json(output, null, 2);
});

app.listen(1706, () => console.log("Servidor rodando na porta 1706"))