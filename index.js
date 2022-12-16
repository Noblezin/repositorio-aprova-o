const express = require('express')
const session = require('express-session')
const expressLayouts = require('express-ejs-layouts')
const db = require('./models/db.js')
const Usuario = require('./models/Usuario.js')
const bcrypt = require('bcrypt')
const port = 3000
var path = require ('path')
const app = express()
const bodyParser = require('body-parser')


app.use(session({
    secret:'slahalgumacoisasecreta',
    saveUninitialized: true,
    cookie: { maxAge: (1000 * 60 * 60 * 24) }, //1000ms * 60s * 60m * 24h = um dia
    resave: false
}))

app.use(expressLayouts)
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')
app.set('layout', 'layout/layoutPadrao')
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use((req, res, next) => {
    res.locals.usuarioLogado = req.session.login
    next()
}) 

app.get('/',(req,res)=>{
    if(req.session.login) {
        res.render('logado', {titulo: "Logado"})
        //console.log ('O meu usuário logado é: ' + req.session.login)
    }else{
        res.render('login', {titulo: "Página Inicial"})
    }
})


app.get('/cadastrando', (req, res)=>{
    res.render('cadastrando', {titulo: "Cadastro"})
})


app.get('/neto',(req,res)=>{
    res.render('usuarios/neto', {titulo: "Página do Neto"})
})

app.get('/usuario/:usr',(req,res)=>{
    let usr = req.params.usr
    console.log(req)
    res.render('usuarios/usuarios', {titulo: `Página do ${usr}`, usuario: usr})
})


app.post('/register', async (req, res) => {
    try{        
        const login = req.body.login;
        const password = req.body.password;
        const passwordReply = req.body.passwordReply;
        if (password === passwordReply) {
            const hash = await bcrypt.hash(password, 10)
            await Usuario.create({nome: login, senha: hash})
            //sucesso no cadastro
            res.redirect("/");
        } else {
            apresentaErro(res, 'Senhas não conferem')
            //res.status(200).send('Senhas não conferem')
        }
        
    }catch(e){
        //console.log(e)
        apresentaErro(res, 'Senhas não conferem' + e)
    }

})

app.get('/logout', (req, res) =>{
    req.session.login = ''
    res.redirect('/')
})

app.post('/login', async (req, res) =>{
    try{
        let {login, password} = req.body
        const user = await Usuario.findOne({where: {nome: login}})
        if(user){
            const validPass = await bcrypt.compare(password, user.senha)
            if(validPass){
                req.session.login = login
                res.redirect('/')
            } else {
                apresentaErro(res, 'Usuário/senha inválido')
            }
        }else{
            apresentaErro(res, 'Usuário/senha inválido')
        }
    } catch(e){
        //console.log(e)
        apresentaErro(res, 'Codigo quebrado!' + e)
    }
})

function apresentaErro(res, mensagem) {
    res.render('errors/errGenerico', {titulo: 'Erro', mensagemErro: mensagem})
}


app.listen(port,()=>{
    console.log('servidor rodando http://localhost:' + port)
})
