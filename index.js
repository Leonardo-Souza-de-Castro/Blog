var http = require('http');

var express = require('express');

var app = express();

app.use(express.static('./public'));

var server = http.createServer(app);

server.listen(80);
console.log("Servidor rodando...")

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.set('view engine', 'ejs')
app.set('views', './views')

const MongoClient = require("mongodb").MongoClient; //Inicializando a bibilioteca do MongoDb

const uri = "mongodb+srv://leonardo:guilherme85@leonardo.dvsd60e.mongodb.net/?retryWrites=true&w=majority"; //Definindo a URI de acesso do banco

const client = new MongoClient(uri, {useNewUrlParser: true})

app.get('/', async function (request, response) {
    response.render('index', {resposta : await client.db("post_db").collection("posts").find().toArray()})
})

app.post('/', function (request, response) {
    client.db("post_db").collection("posts").insertOne({
        db_titulo: request.body.titulo, db_resumo: request.body.resumo, db_conteudo: request.body.conteudo}, async function (err) {
            if (err) {
                response.render('postar', {resposta: "Erro ao cadastrar Post"})
            }
            else{
                console.log(await client.db("post_db").collection("posts").find().toArray())
                response.render('index', {resposta : await client.db("post_db").collection("posts").find().toArray()})
            }
        }
    )
})