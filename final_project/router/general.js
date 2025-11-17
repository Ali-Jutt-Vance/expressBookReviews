const express = require('express');
let books = require("./booksdb.js");
const public_users = express.Router();

// ---------------------------
// Task 1–5: Synchronous routes
// ---------------------------

// Task 1: Get all books
public_users.get('/', function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 2: Get book by ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    return res.status(200).send(JSON.stringify(books[isbn], null, 4));
});

// Task 3: Get books by author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    let result = Object.keys(books)
        .map(key => books[key])
        .filter(book => book.author === author);
    return res.status(200).send(JSON.stringify(result, null, 4));
});

// Task 4: Get books by title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    let result = Object.keys(books)
        .map(key => books[key])
        .filter(book => book.title === title);
    return res.status(200).send(JSON.stringify(result, null, 4));
});

// Task 5: Get book reviews
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
});

// ---------------------------
// Task 10–13: Async / Promise routes
// ---------------------------

// Simulate async fetching
const getBooksAsync = () => {
    return new Promise((resolve, reject) => {
        if (books) resolve(books);
        else reject("No books available");
    });
};

// Task 10: Get all books (async)
public_users.get('/async-books', async (req, res) => {
    try {
        const allBooks = await getBooksAsync();
        res.status(200).send(JSON.stringify(allBooks, null, 4));
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

// Task 11: Get book by ISBN (Promise)
public_users.get('/promise-isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    getBooksAsync()
        .then(allBooks => {
            if (allBooks[isbn]) res.status(200).send(JSON.stringify(allBooks[isbn], null, 4));
            else res.status(404).json({ message: "Book not found" });
        })
        .catch(err => res.status(500).json({ message: err }));
});

// Task 12: Get books by author (async)
public_users.get('/async-author/:author', async (req, res) => {
    try {
        const author = req.params.author;
        const allBooks = await getBooksAsync();
        const result = Object.keys(allBooks)
            .map(key => allBooks[key])
            .filter(book => book.author === author);
        res.status(200).send(JSON.stringify(result, null, 4));
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

// Task 13: Get books by title (async)
public_users.get('/async-title/:title', async (req, res) => {
    try {
        const title = req.params.title;
        const allBooks = await getBooksAsync();
        const result = Object.keys(allBooks)
            .map(key => allBooks[key])
            .filter(book => book.title === title);
        res.status(200).send(JSON.stringify(result, null, 4));
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

module.exports.general = public_users;
