const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');
const pergunta = require('./database/Pergunta');
const Pergunta = require('./database/Pergunta');
const Resposta = require('./database/Resposta');

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
    pergunta.findAll({raw: true, order: [
        ['id', 'DESC'] // order by id (asc || desc)
    ]}).then(perguntas => {
        res.render('index', {
            perguntas: perguntas
        });
    });
});

app.get("/perguntar", (req, res) => {
    res.render('perguntar');
});

app.post("/salvarpergunta", (req, res) => {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect('/');
    })
});

app.get("/pergunta/:id", (req, res) => {
    var id = req.params.id;
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if (pergunta != undefined) {
            Resposta.findAll({
                where: {
                    perguntaId: pergunta.id
                },
                order: [
                    ['id', 'DESC']
                ]
            }).then(respostas => {
                res.render('pergunta', {
                    pergunta: pergunta, 
                    respostas: respostas
                });
            })
        } else {
            res.redirect('/');
        }
    });
});

app.post("/responder", (req, res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    Resposta.create({
        corpo: corpo, 
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/" + perguntaId);
    });
});


//port
app.listen(8080, () => {
    console.log("App rodando");
});