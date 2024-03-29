const express = require('express');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('hbs');

const sassMiddleware = require('node-sass-middleware');

const app = express();

const setupDatabaseConnection = function () {
    const mongoose = require('mongoose');
    
    mongoose.connect('mongodb://localhost/projectManagement');
    mongoose.Promise = global.Promise;
};

const setupExpress = function () {
    // View engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'hbs');

    hbs.registerPartials(__dirname + '/views/partials');

    app.use(logger('dev'));

    app.use(express.json());
    
    app.use(express.urlencoded({ extended: false }));
    
    app.use(cookieParser());

    // Setup scss middleware
    app.use(sassMiddleware({
        src: path.join(__dirname, 'scss'),
        dest: path.join(__dirname, 'public/stylesheets'),
        debug: true,
        outputStyle: 'compressed',
        prefix: '/stylesheets'
    }));
    
    app.use(express.static(path.join(__dirname, 'public')));
};

const setupHandlebarHelpers = function () {
    require('./lib/handlebarsHelpers');
};

const setupSession = function () {
    const uuid = require('uuidv4');
    const session = require('express-session');

    app.use(session({
        genid: (req) => {
            return uuid();
        },
        secret: '1234567890',
        resave: false,
        saveUninitialized: true
    }));
};

const setupRoutes = function () {
    const isLoggedIn = require('./middlewares/isLoggedIn');
    
    // Always check if the user is logged in
    app.use(isLoggedIn);
    
    app.use('/', require('./routes/indexRoutes'));
    app.use('/users', require('./routes/usersRoutes'));
    app.use('/projects', require('./routes/projectsRoutes'));
};

const setupErrorHandler = function () {
    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        next(createError(404));
    });
    
    // error handler
    app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);

        const pageOptions = {
            layoutOptions: {
                headTitle: 'Stran ni bila najdena',
                backgroundClass: 'background',
                navBar: {
                    show: false,
                    breadcrumbs: null,
                    buttons: null
                },
                sideMenu: {
                    show: false,
                    items: null
                }
            }
        };

        res.render('error', pageOptions);
        
        console.log(err);
    });
};

const createAdminIfNotSet = function () {
    require('./lib/createAdmin')();
};

setupDatabaseConnection();

setupExpress();

setupHandlebarHelpers();

setupSession();

setupRoutes();

setupErrorHandler();

createAdminIfNotSet();

module.exports = app;
