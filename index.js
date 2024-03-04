const express = require('express'),
    bodyParser = require('body-parser'),
    uuid = require('uuid'),
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path');

const app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' })

app.use(express.static('public'));
app.use(bodyParser.json());

// app.use(morgan('common'));
app.use(morgan('combined', { stream: accessLogStream }));


let users = [
    {
        id: 1,
        name: "Pascal",
        favoriteMovies: []
    },

    {
        id: 2,
        name: "Caroline",
        favoriteMovies: ["Interstellar"]
    }
]


let movies = [
    { id: 1, Title: 'Law abiding citizen', Director: 'F. Gary Gray' },
    { id: 2, Title: 'Limitless', Director: 'Neil Burger' },
    { id: 3, Title: 'The Pursuit of Happyness', Director: 'Gabriele Muccino' },
    { id: 4, Title: 'Get Out', Director: 'Jordan Peele' },
    { id: 5, Title: 'Split', Director: 'M. Night Shyamalan' },
    { id: 6, Title: 'Spirited Away', Director: 'Hayao Miyazaki' },
    { id: 7, Title: 'The Intouchables', Director: 'Olivier Nakache,' },
    { id: 8, Title: 'Joker', Director: 'Todd Phillips' },
    { id: 9, Title: 'Venom', Director: 'Ruben Fleischer' },
    { id: 10, Title: 'Interstellar', Director: 'Christopher Nolan' },
];


// CREATE
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser);
    } else {
        res.status(400).send('Users need names')
    }
});

// UPDATE
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find(user => user.id == id);

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('User not found');
    }
});

// CREATE
app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;


    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteMovies.push(movieTitle)
        res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
    } else {
        res.status(400).send('User not found');
    }
});

// DELETE 
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
    } else {
        res.status(400).send('User not found');
    }
});

// DELETE 
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        users = users.filter(user => user.id != id);
        res.status(200).send(`User ${id} has been deleted`);
    } else {
        res.status(400).send('User not found');
    }
});

// Gets the list of data about ALL movies
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});

// Gets a single movie by movie name
app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find(movie => movie.Title === title);

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('no such movie')
    }
});

// Gets a Director by Name
app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find(movie => movie.Director === directorName).Director;

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('no such director')
    }
});

/// Error handler function

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});