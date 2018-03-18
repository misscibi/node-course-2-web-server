const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// For Heroku set this port and put 'start' script at package.json file.
const port = process.env.PORT || 3000;
var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

// We wrote our own middleware here which is a callback function.
app.use((request, response, next) => {
    var now = new Date().toString();
    var log = `${now}: ${request.method} ${request.url}`;

    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log.');
        }
    });
    next();
});

// Maintenance middleware - just comment/uncomment as needed
// app.use((request, response, next) => {
//     response.render('maintenance.hbs');
// });

// Adding middleware
app.use(express.static(__dirname + '/public'));

// Handle info within handlebars templates
hbs.registerHelper('getCurrentYear', () => {
   return new Date().getFullYear();
});
hbs.registerHelper('screamIt', (text) => {
   return text.toUpperCase();
});


// Below is a handler for an HTTP GET request
app.get('/', (request, response) => {
    // response.send('<h1>Hello Express!</h1>');
    // response.send({
    //     name: 'Link',
    //     likes: [
    //         'Rock Roasts',
    //         'Sidon'
    //     ]
    // });
    response.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to the home page!'
    });
});

app.get('/about', (request, response) => {
   // response.send('About Page');
    response.render('about.hbs', {
        pageTitle: 'About Page',
    });
});

// Bad request - send back json object with errorMessage
app.get('/bad', (request, response) => {
    response.send({
        errorMessage: 'Unable to handle request.'
    });
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}.`);
});