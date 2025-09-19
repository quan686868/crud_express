require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// EJS view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Environment variables
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/test_mongodb';

// MongoDB connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schema + Model
const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  year: Number,
});
const Book = mongoose.model('Book', BookSchema);

// CREATE
app.get('/books/new', (req, res) => {
  res.render('new');
});

app.post('/books', async (req, res) => {
  const book = new Book(req.body);
  await book.save();
  res.redirect('/books');
});

// READ ALL
app.get('/books', async (req, res) => {
  const books = await Book.find();
  res.render('index', { books });
});

// READ ONE
app.get('/books/:id/edit', async (req, res) => {
  const book = await Book.findById(req.params.id);
  res.render('edit', { book });
});

// UPDATE
app.put('/books/:id', async (req, res) => {
  await Book.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/books');
});

// DELETE
app.delete('/books/:id', async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.redirect('/books');
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
