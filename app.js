const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const connectDB = require('./config/db')


//load config
dotenv.config({ path: './config/config.env' })

//passport config
require('./config/passport')(passport)

connectDB()

const app = express()

//bodyparser
app.use(express.urlencoded({extended:false}))
app.use(express.json())


//method override
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  }))

//logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

//HAndlebars helpers
const { formatDate,stripTags, truncate,editIcon,select } = require('./helpers/hbs')

//handlebars
app.engine('.hbs',exphbs({helpers:{
    formatDate,
    stripTags,
    truncate,
    editIcon,
    select,
    },
    defaultLayout: 'main', extname: '.hbs'}))
    app.set('view engine','.hbs')

//session 
app.use(session({
    secret: 'Rosan',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}))

//passport midddlewares
app.use(passport.initialize())
app.use(passport.session())

// Set global variable 
app.use(function (req, res, next) {
    res.locals.user = req.user || null
    next()
  })
  

//static folder
app.use(express.static(path.join(__dirname,'public')))

//routes
app.use('/',require('./routes/index'))
app.use('/auth',require('./routes/auth'))
app.use('/stories',require('./routes/stories'))

const PORT = process.env.PORT || 8080;

app.listen(PORT, ()=>{
    console.log(`Server Started On PORT ${PORT} and running in ${process.env.NODE_ENV}`);
})