const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');

//database
connection
    .authenticate()
    .then(() => {
        console.log("Conexao feito com o DB");
    })
    .catch((err) => {
        console.log(err);
    });

//view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

//bodyparser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//routes
app.get("/", (req, res) => {
    res.render('index');
});

app.get("/perguntar", (req, res) => {
    res.render('perguntar');
});

app.post("/salvarpergunta", (req, res) => {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    res.send("Título: " + titulo + " e descricao: " + descricao);
});


//port
app.listen(8080, () => {
    console.log("App rodando");
});