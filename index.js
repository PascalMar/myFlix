const express = require('express'),
morgan = require('morgan'),
fs = require('fs'), 
path = require('path');

const app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

app.use(express.static('public'));

// app.use(morgan('common'));
app.use(morgan('combined', {stream: accessLogStream}));


let topMovies = [
    {
        title: 'Interstellar',
    },
    {
        title: 'Law abiding citizen',
    },
    {
        title: 'Limitless',
    },
    {
        title: 'The Pursuit of Happyness',
    },
    {
        title: 'Get Out',
    },
    {
        title: 'Split',
    },
    {
        title: 'Spirited Away',
    },
    {
        title: 'The Intouchables',
    },
    {
        title: 'Joker',
    },
    {
        title: 'Venom',
    },
];

app.get('/', (req, res) => {
    res.send('Welcome to my app!');
});

app.get('/movies', (req, res) => {
    res.json(topMovies);
});



/// Error handler function

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });