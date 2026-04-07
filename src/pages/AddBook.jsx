import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import StarRating from '../components/StarRating';
import styles from './AddBook.module.css';

const genres = [
  'Classic', 'Sci-Fi', 'Fantasy', 'Dystopian', 'Non-Fiction',
  'Self-Help', 'Mystery', 'Romance', 'Horror', 'Biography',
  'History', 'Poetry', 'Thriller', 'Other'
];

// Wrapper component to pass hooks to class component
function AddBookWithRouter(props) {
  const params = new URLSearchParams(window.location.search);
  const editId = params.get('edit');
  return <AddBook {...props} editId={editId} />;
}

class AddBook extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      author: '',
      genre: 'Classic',
      totalPages: '',
      currentPage: '0',
      status: 'want-to-read',
      rating: 0,
      notes: '',
      errors: {},
      redirect: false,
      isEditing: false,
      editBookId: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRating = this.handleRating.bind(this);
    this.validate = this.validate.bind(this);
  }

  componentDidMount() {
    const { editId } = this.props;
    if (editId) {
      const saved = localStorage.getItem('books');
      if (saved) {
        const books = JSON.parse(saved);
        const book = books.find(b => b.id === editId);
        if (book) {
          this.setState({
            title: book.title,
            author: book.author,
            genre: book.genre,
            totalPages: String(book.totalPages),
            currentPage: String(book.currentPage),
            status: book.status,
            rating: book.rating,
            notes: book.notes || '',
            isEditing: true,
            editBookId: editId
          });
        }
      }
    }
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value }, () => {
      if (this.state.errors[name]) {
        const { errors } = this.state;
        delete errors[name];
        this.setState({ errors });
      }
    });
  }

  handleRating(rating) {
    this.setState({ rating });
  }

  validate() {
    const { title, author, totalPages, currentPage } = this.state;
    const errors = {};

    if (!title.trim()) errors.title = 'Title is required';
    if (!author.trim()) errors.author = 'Author is required';
    if (!totalPages || parseInt(totalPages) <= 0) errors.totalPages = 'Enter valid total pages';
    if (currentPage === '' || parseInt(currentPage) < 0) errors.currentPage = 'Enter valid current page';
    if (parseInt(currentPage) > parseInt(totalPages)) errors.currentPage = 'Current page cannot exceed total pages';

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  }

  handleSubmit(e) {
    e.preventDefault();

    if (!this.validate()) return;

    const { title, author, genre, totalPages, currentPage, status, rating, notes, isEditing, editBookId } = this.state;

    const bookData = {
      id: isEditing ? editBookId : String(Date.now()),
      title: title.trim(),
      author: author.trim(),
      genre,
      totalPages: parseInt(totalPages),
      currentPage: parseInt(currentPage),
      status,
      rating,
      notes: notes.trim(),
      favourite: false,
      dateAdded: isEditing ? undefined : new Date().toISOString(),
      dateCompleted: status === 'completed' ? new Date().toISOString() : null
    };

    const saved = localStorage.getItem('books');
    let books = saved ? JSON.parse(saved) : [];

    if (isEditing) {
      books = books.map(b => {
        if (b.id === editBookId) {
          return { ...b, ...bookData, dateAdded: b.dateAdded, favourite: b.favourite };
        }
        return b;
      });
    } else {
      books.push(bookData);
    }

    localStorage.setItem('books', JSON.stringify(books));
    this.setState({ redirect: true });
  }

  render() {
    const { title, author, genre, totalPages, currentPage, status, rating, notes, errors, redirect, isEditing } = this.state;

    if (redirect) {
      return <Navigate to="/library" replace />;
    }

    return (
      <div className={styles.addBook}>
        <div className={styles.formContainer}>
          <h1 className={styles.pageTitle}>
            <span>{isEditing ? '✏️' : '➕'}</span>
            {isEditing ? 'Edit Book' : 'Add New Book'}
          </h1>
          <p className={styles.subtitle}>
            {isEditing ? 'Update your book details below.' : 'Fill in the details to add a book to your library.'}
          </p>

          <form onSubmit={this.handleSubmit} className={styles.form} id="book-form">
            {/* Title */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={this.handleChange}
                className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
                placeholder="Enter book title..."
              />
              {errors.title && <span className={styles.error}>{errors.title}</span>}
            </div>

            {/* Author */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="author">Author *</label>
              <input
                type="text"
                id="author"
                name="author"
                value={author}
                onChange={this.handleChange}
                className={`${styles.input} ${errors.author ? styles.inputError : ''}`}
                placeholder="Enter author name..."
              />
              {errors.author && <span className={styles.error}>{errors.author}</span>}
            </div>

            {/* Genre & Status Row */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="genre">Genre</label>
                <select
                  id="genre"
                  name="genre"
                  value={genre}
                  onChange={this.handleChange}
                  className={styles.select}
                >
                  {genres.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={status}
                  onChange={this.handleChange}
                  className={styles.select}
                >
                  <option value="want-to-read">Want to Read</option>
                  <option value="reading">Currently Reading</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Pages Row */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="totalPages">Total Pages *</label>
                <input
                  type="number"
                  id="totalPages"
                  name="totalPages"
                  value={totalPages}
                  onChange={this.handleChange}
                  className={`${styles.input} ${errors.totalPages ? styles.inputError : ''}`}
                  placeholder="e.g. 350"
                  min="1"
                />
                {errors.totalPages && <span className={styles.error}>{errors.totalPages}</span>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="currentPage">Current Page</label>
                <input
                  type="number"
                  id="currentPage"
                  name="currentPage"
                  value={currentPage}
                  onChange={this.handleChange}
                  className={`${styles.input} ${errors.currentPage ? styles.inputError : ''}`}
                  placeholder="e.g. 120"
                  min="0"
                />
                {errors.currentPage && <span className={styles.error}>{errors.currentPage}</span>}
              </div>
            </div>

            {/* Rating */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Rating</label>
              <div className={styles.ratingWrapper}>
                <StarRating rating={rating} onRate={this.handleRating} size={28} />
                {rating > 0 && (
                  <button
                    type="button"
                    className={styles.clearRating}
                    onClick={() => this.handleRating(0)}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={notes}
                onChange={this.handleChange}
                className={styles.textarea}
                placeholder="Your thoughts about this book..."
                rows={4}
              />
            </div>

            {/* Actions */}
            <div className={styles.formActions}>
              <button type="submit" className={styles.submitBtn} id="submit-book">
                {isEditing ? '💾 Save Changes' : '📚 Add to Library'}
              </button>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => this.setState({ redirect: true })}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default AddBookWithRouter;
