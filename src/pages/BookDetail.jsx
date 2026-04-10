import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import StarRating from '../components/StarRating';
import { genreColors, getCoverColor } from '../data/sampleBooks';
import styles from './BookDetail.module.css';

const statusLabels = {
  'reading': 'Currently Reading',
  'completed': 'Completed',
  'want-to-read': 'Want to Read'
};

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('books');
    if (saved) {
      const books = JSON.parse(saved);
      const found = books.find(b => b.id === id);
      if (found) {
        setBook(found);
        setCurrentPage(found.currentPage);
      }
    }
  }, [id]);

  const updateBook = (updates) => {
    const saved = localStorage.getItem('books');
    if (saved) {
      const books = JSON.parse(saved);
      const updated = books.map(b => {
        if (b.id === id) {
          return { ...b, ...updates };
        }
        return b;
      });
      localStorage.setItem('books', JSON.stringify(updated));
      setBook(prev => ({ ...prev, ...updates }));
    }
  };

  const handlePageUpdate = (e) => {
    const val = Math.max(0, Math.min(parseInt(e.target.value) || 0, book.totalPages));
    setCurrentPage(val);
    const newStatus = val >= book.totalPages ? 'completed' : val > 0 ? 'reading' : book.status;
    updateBook({
      currentPage: val,
      status: newStatus,
      dateCompleted: val >= book.totalPages ? new Date().toISOString() : book.dateCompleted
    });
  };

  const handleMarkComplete = () => {
    updateBook({
      currentPage: book.totalPages,
      status: 'completed',
      dateCompleted: new Date().toISOString()
    });
    setCurrentPage(book.totalPages);
  };

  const handleDelete = () => {
    const saved = localStorage.getItem('books');
    if (saved) {
      const books = JSON.parse(saved).filter(b => b.id !== id);
      localStorage.setItem('books', JSON.stringify(books));
    }
    navigate('/library');
  };

  const toggleFavourite = () => {
    updateBook({ favourite: !book.favourite });
  };



  if (!book) {
    return (
      <div className={styles.notFound}>
        <span className={styles.notFoundIcon}>📚</span>
        <h2>Book not found</h2>
        <Link to="/library" className={styles.backLink}>← Back to Library</Link>
      </div>
    );
  }

  const coverColor = getCoverColor(book.title);


  return (
    <div className={styles.bookDetail}>
      {/* Back Button */}
      <Link to="/library" className={styles.backBtn}>
        ← Back to Library
      </Link>

      <div className={styles.detailCard}>
        {/* Cover Section */}
        <div className={styles.coverSection}>
          <div
            className={styles.cover}
            style={{ backgroundColor: coverColor }}
          >
            <div className={styles.coverPattern}></div>
            <div className={styles.coverContent}>
              <span className={styles.coverTitle}>{book.title}</span>
              <span className={styles.coverAuthor}>{book.author}</span>
            </div>
          </div>
          <button
            className={`${styles.favBtn} ${book.favourite ? styles.favActive : ''}`}
            onClick={toggleFavourite}
            id="toggle-favourite"
          >
            {book.favourite ? '❤️ Favourited' : '🤍 Add to Favourites'}
          </button>
        </div>

        {/* Info Section */}
        <div className={styles.infoSection}>
          <div className={styles.titleRow}>
            <h1 className={styles.bookTitle}>{book.title}</h1>
            <span className={`${styles.statusBadge} ${styles[book.status]}`}>
              {statusLabels[book.status]}
            </span>
          </div>

          <p className={styles.author}>by {book.author}</p>

          <div className={styles.metaRow}>
            <span
              className={styles.genre}
              style={{
                backgroundColor: `${genreColors[book.genre] || genreColors['Other']}22`,
                color: genreColors[book.genre] || genreColors['Other'],
                borderColor: `${genreColors[book.genre] || genreColors['Other']}44`
              }}
            >
              {book.genre}
            </span>
            <span className={styles.pages}>
              📄 {book.totalPages} pages
            </span>
            {book.dateAdded && (
              <span className={styles.dateAdded}>
                📅 Added {new Date(book.dateAdded).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* Rating */}
          {book.rating > 0 && (
            <div className={styles.ratingSection}>
              <span className={styles.ratingLabel}>Your Rating</span>
              <StarRating rating={book.rating} readonly size={22} />
            </div>
          )}

          {/* Progress */}
          <div className={styles.progressSection}>
            <h3 className={styles.sectionLabel}>Reading Progress</h3>
            <ProgressBar
              current={currentPage}
              total={book.totalPages}
              height={14}
            />
            <div className={styles.pageInput}>
              <label htmlFor="current-page">Current Page:</label>
              <input
                type="number"
                id="current-page"
                value={currentPage}
                onChange={handlePageUpdate}
                min={0}
                max={book.totalPages}
                className={styles.pageField}
              />
              <span className={styles.pageTotal}>/ {book.totalPages}</span>
            </div>
          </div>



          {/* Notes */}
          {book.notes && (
            <div className={styles.notesSection}>
              <h3 className={styles.sectionLabel}>📝 Notes</h3>
              <p className={styles.notes}>{book.notes}</p>
            </div>
          )}

          {/* Completed date */}
          {book.dateCompleted && (
            <div className={styles.completedDate}>
              ✅ Completed on {new Date(book.dateCompleted).toLocaleDateString()}
            </div>
          )}

          {/* Actions */}
          <div className={styles.actions}>
            {book.status !== 'completed' && (
              <button
                className={styles.completeBtn}
                onClick={handleMarkComplete}
                id="mark-complete"
              >
                ✅ Mark as Complete
              </button>
            )}
            <Link
              to={`/add?edit=${book.id}`}
              className={styles.editBtn}
              id="edit-book"
            >
              ✏️ Edit Book
            </Link>
            <button
              className={styles.deleteBtn}
              onClick={() => setShowDeleteConfirm(true)}
              id="delete-book"
            >
              🗑️ Delete
            </button>
          </div>

          {/* Delete Confirmation */}
          {showDeleteConfirm && (
            <div className={styles.deleteConfirm}>
              <p>Are you sure you want to delete "{book.title}"?</p>
              <div className={styles.confirmActions}>
                <button
                  className={styles.confirmDelete}
                  onClick={handleDelete}
                >
                  Yes, Delete
                </button>
                <button
                  className={styles.confirmCancel}
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
