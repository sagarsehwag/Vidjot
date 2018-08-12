// Module's Intialisation
const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const passport = require('passport');


// Express Initialisation
const app = express();


// Static Folder
app.use(express.static(path.join(__dirname, 'public')));


// Load Routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');


// Connect Flash Middleware
app.use(flash());


// Body Parser Middleware
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


// Express Session Middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));


// Passport Middlewares
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);


// DB Configuration
const dbs = require('./config/database')

// Mongoose Middleware
mongoose.connect(dbs.mongoURI, {
    useNewUrlParser: true,
});
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('MongoDB Connected...'));


// Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});


// Method Override Middleware
app.use(methodOverride('_method'));


// Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


// Routing
app.get('/', (req, res) => {
    res.render('index');
});


// About Page
app.get('/about', (req, res) => {
    res.render('about', {
    });
});


// Use Routes
app.use('/ideas', ideas);
app.use('/users', users);


// Server Intialisation
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server Started on port ${port}`)
});