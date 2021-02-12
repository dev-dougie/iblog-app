const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const express = require('express')
const server = express()
const path = require('path')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const admin = require('./routes/admin')
const user = require('./routes/user')
const mongoose = require('mongoose')
const dbConnection = require('./database/dbConnection')
require('./models/Category')
require('./models/Post')
const Category = mongoose.model('categories')
const Post = mongoose.model('posts')
const session = require('express-session')
const flash = require('connect-flash');
const passport = require('passport');
require('./config/auth')(passport)

dbConnection

server.use(express.static(path.join(__dirname, 'public')))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'handlebars',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
});
server.engine('handlebars', hbs.engine)
server.set('view engine', 'handlebars')
server.set('views', 'views')

server.use(session({
    secret: '1bl0g4pp',
    resave: true,
    saveUninitialized: true
}))
    .use(passport.initialize())
    .use(passport.session())
    .use(flash())
    .use((req, res, next) => {
        res.locals.success_msg = req.flash('success_msg')
        res.locals.error_msg = req.flash('error_msg')
        res.locals.error = req.flash('error')
        res.locals.user = req.user || null
        next()
    })


server.get('/', (req, res) => {
    
    Post.find()
        .populate('category')
        .sort({ date: 'desc' })
        .then(posts => {
            res.render('index', {
                style: 'index.css',
                script: 'index.js',
                posts: posts.map(post => post.toJSON())
            })
        }).catch(err => {
            req.flash('error_msg', 'Erro interno.')
            res.redirect('/404')
        })
})


server.get('/categorias', (req, res) => {
    Category.find().then(categories => {
        res.render('categories',
            { categories: categories.map(category => category.toJSON()) })
    })
})

server.use('/admin', admin)
server.use('/usuario', user)

const PORT = process.env.PORT 
server.listen(PORT, () => console.log('Running at http://localhost:8800'))