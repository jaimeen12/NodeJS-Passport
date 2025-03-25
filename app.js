import express from 'express';
import expressEjsLayouts from 'express-ejs-layouts';
import passport from 'passport';
import flash from 'connect-flash'
import session from 'express-session';
import mysql from 'mysql2'
import sqlStore from 'express-mysql-session'

const mysqlStore = sqlStore(session)

import router from './routes/index.js'
import routerUser from './routes/user.js'

import dotenv from 'dotenv';
dotenv.config()

const app = express();

//DB Config
const pool = mysql.createPool({
    connectionLimit: 10,
    password: process.env.MYSQL_USER_PASSWORD,
    user: process.env.MYSQL_USER_USER,
    database: process.env.MYSQL_USER_DATABASE,
    host: process.env.MYSQL_HOST,
    //createDatabaseTable: true
})

//EJS
app.use(expressEjsLayouts);
app.set('view engine', 'ejs');

//BodyParser
app.use(express.urlencoded({ extended: false }));


const IN_PROD = process.env.NODE_ENV === 'production'
const TWO_HOURS = 1000 * 60 * 60 * 2
 
const options ={
    connectionLimit: 10,
    password: process.env.DB_PASS,
    user: process.env.DB_USER,
    database: process.env.MYSQL_DB,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    //createDatabaseTable: true
     
 
 
}
const pool2 = mysql.createPool(options);
 
  
const  sessionStore = new mysqlStore(options, pool2);


  // Passport middleware
  app.use(session({
    name: process.env.SESS_NAME,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    secret: process.env.SESS_SECRET,
    cookie: {
        maxAge: TWO_HOURS,
        sameSite: true,
        secure: IN_PROD
    }
}))




  // Passport Config
  import { PassportFunc } from './config/passport.js';
  PassportFunc(passport);

  // Passport middleware

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//Routes
app.use('/', router)
app.use('/user', routerUser)

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on  ${PORT}`));