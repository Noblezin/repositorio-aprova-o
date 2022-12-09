const express = require('express')
const session = require('express-session')
const expressLayouts = require('express-ejs-layouts')
const db = require('./models/db.js')
const Usuario = require('./models/Usuario.js')
//bycript

const port = 3000
var path = require ('path')
const app = express()

var login = "admin"
var password= "123456"

app.use(session({
    secret:'slahalgumacoisasecreta',
    saveUninitialized: true,
    cookie: { maxAge: (1000 * 60 * 60 * 24) }, //1000ms * 60s * 60m * 24h = um dia
    resave: false
}))

app.use(expressLayouts)
app.use(express.urlencoded({extended:true}))
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')
app.set('layout', 'layout/layoutPadrao')
app.use('/public', express.static(path.join(__dirname, 'public')))

app.post('/',(req,res)=>{
    console.log(req.body)
    let nome = req.body.login
    let senha = req.body.password
    //procurar no banco de dados se o usuário existe
    let usr = Usuario.findOne({where: {nome: nome}})
    if (usr) {
        //se existir
        
        let senhaCriptografada = usr.senha
        //TODO: compara a senha passada com a criptografada do banco
        //TODO: se passar sucesso
        //TODO: se não passar erro


    } else {
        //mostrar que o usuario não esta cadastrado
    }
    if(req.body.password == password && req.body.login){
        //Logado com sucesso!
        req.session.login = login
        res.redirect('/')
    
    }else{
        
        res.render('index', {titulo: "Página Inicial"} )

    }
})

app.get('/',(req,res)=>{
    if(req.session.login){
        res.render('logado', {titulo: "Logado"})
        console.log ('O meu usuário logado é: ' + req.session.login)
    }else{
        res.render('index', {titulo: "Página Inicial"})
    }
})

app.get('/neto',(req,res)=>{
    res.render('usuarios/neto', {titulo: "Página do Neto"})
})

app.get('/usuario/:usr',(req,res)=>{
    let usr = req.params.usr
    console.log(req)
    res.render('usuarios/usuarios', {titulo: `Página do ${usr}`, usuario: usr})
})

app.post('/cadastra-usr', cadastraUser)

app.listen(port,()=>{
    console.log('servidor rodando http://localhost:' + port)
})

async function cadastraUser(req, res) {
    let usuario = req.body.login
    let senha = req.body.password
    //TODO: criptografar a senha
    let user;
    try {
        user = await Usuario.create({nome: usuario, senha: senha})
        res.render('usuarios/cadastrado', {titulo: "Usuário Cadastrado", usr: usuario})
    } catch (err) {
        console.log(err)
        res.render('usuarios/erro', {titulo: "Erro ao cadastrar", usr: usuario})
    }
}