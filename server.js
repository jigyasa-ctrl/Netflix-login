8/*if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

const initializePassport = require('./passport-config')
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id) 
)
const users = []
app.set('view-engine', 'ejs')

app.use(express.urlencoded({ extended : false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET, //keeps our information encrypted
    resave: false, //because we dont want to resave if nothng is changed
saveUninitialized: false //not save empty value
}))


app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))




app.get('/',(req, res) => {
    res.render('main.ejs');
})


app.get('/index'),checkAuthenticated, (req, res) => {
    res.render('index.ejs');
}


app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs');
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local',{
    successRedirect:'/index',
    failureRedirect: '/login',
    failaureFlash: true
}))

app.get('/register',checkNotAuthenticated, (req,res) =>{
    res.render('register.ejs');
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
    try{
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      users.push({
          id: Date.now().toString(),
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword
      })
      req.redirect('/login')
    }
    catch{
        res.redirect('/register')

    }
})

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

function checkAuthenticated(req, res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
        res.redirect('/index')
    }
    next()
}
app.listen(8000); */




if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}


const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const initializePassport = require('./passport-config')
initializePassport(
    passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
    )

const users = []

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended : false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET, //keeps our information encrypted
    resave: false, //because we dont want to resave if nothng is changed
saveUninitialized: false //not save empty value
}))

/*step 1*/
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    res.render('main.ejs')
})
app.get('/main', checkAuthenticated, (req, res) => {
    res.render('index.ejs', {name: req.user.name})
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs');
})
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/main',
    failureRedirect: '/login',
    failureFlash: true //displays the failure
}))
app.get('/register',checkNotAuthenticated, (req, res) => {
    res.render('register.ejs');
})

app.post('/register',checkNotAuthenticated, async (req, res) => {
try{
const hashedPassword = await bcrypt.hash(req.body.password, 10)
users.push({
    id: Date.now().toString(),
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
})
res.redirect('/login')
}catch{
    res.redirect('/register')

}
})
app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
})

function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}

//function whivh doesnt redirect after logged in
function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        res.redirect('/main')
    }
    next()
}


app.listen(8000);