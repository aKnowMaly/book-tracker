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

  // Reading log state
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [logPages, setLogPages] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('books');
    if (saved) {
      const books = JSON.parse(saved);
      const found = books.find(b => b.id === id);
      if (found) {
        // Ensure readingLog array exists
        if (!found.readingLog) found.readingLog = [];
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

  // Reading log handlers
  const handleAddLog = () => {
    const pagesRead = parseInt(logPages);
    if (!pagesRead || pagesRead <= 0 || !logDate) return;

    const newEntry = {
      id: Date.now().toString(),
      date: logDate,
      pagesRead: pagesRead
    };

    const updatedLog = [...(book.readingLog || []), newEntry]
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    updateBook({ readingLog: updatedLog });
    setLogPages('');
  };

  const handleDeleteLog = (logId) => {
    const updatedLog = (book.readingLog || []).filter(entry => entry.id !== logId);
    updateBook({ readingLog: updatedLog });
  };

  // Time estimate calculation
  const getTimeEstimate = () => {
    const log = book.readingLog || [];
    if (log.length === 0 || book.status === 'completed') return null;

    const pagesRemaining = book.totalPages - book.currentPage;
    if (pagesRemaining <= 0) return null;

    // Use last 7 log entries to calculate average pace
    const recentLogs = log.slice(0, 7);
    const totalPagesLogged = recentLogs.reduce((sum, entry) => sum + entry.pagesRead, 0);

    // Calculate unique days in recent logs
    const uniqueDays = new Set(recentLogs.map(entry => entry.date)).size;
    if (uniqueDays === 0) return null;

    const avgPagesPerDay = totalPagesLogged / uniqueDays;
    if (avgPagesPerDay <= 0) return null;

    const daysRemaining = Math.ceil(pagesRemaining / avgPagesPerDay);

    return {
      daysRemaining,
      avgPagesPerDay: Math.round(avgPagesPerDay)
    };
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
  const timeEstimate = getTimeEstimate();

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

          {/* Time Estimate */}
          {timeEstimate && (
            <div className={styles.timeEstimate}>
              <span className={styles.timeIcon}>⏱️</span>
              <div className={styles.timeContent}>
                <span className={styles.timeText}>
                  At your pace (~{timeEstimate.avgPagesPerDay} pages/day), you'll finish in
                </span>
                <span className={styles.timeDays}>
                  ~{timeEstimate.daysRemaining} day{timeEstimate.daysRemaining !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}

          {/* Reading Log */}
          <div className={styles.readingLogSection}>
            <h3 className={styles.sectionLabel}>📅 Reading Log</h3>

            {/* Add Log Entry */}
            <div className={styles.logForm}>
              <input
                type="date"
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
                className={styles.logDateInput}
                id="log-date"
              />
              <input
                type="number"
                value={logPages}
                onChange={(e) => setLogPages(e.target.value)}
                placeholder="Pages read"
                min="1"
                className={styles.logPagesInput}
                id="log-pages"
              />
              <button
                className={styles.logAddBtn}
                onClick={handleAddLog}
                id="add-log-entry"
              >
                + Log Session
              </button>
            </div>

            {/* Log Table */}
            {(book.readingLog || []).length > 0 ? (
              <div className={styles.logTableWrapper}>
                <table className={styles.logTable}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Pages Read</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {(book.readingLog || []).map(entry => (
                      <tr key={entry.id}>
                        <td>{new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                        <td>
                          <span className={styles.logPagesValue}>{entry.pagesRead}</span> pages
                        </td>
                        <td>
                          <button
                            className={styles.logDeleteBtn}
                            onClick={() => handleDeleteLog(entry.id)}
                            aria-label="Delete log entry"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className={styles.logSummary}>
                  Total logged: <strong>{(book.readingLog || []).reduce((s, e) => s + e.pagesRead, 0)}</strong> pages across <strong>{(book.readingLog || []).length}</strong> sessions
                </div>
              </div>
            ) : (
              <p className={styles.logEmpty}>No reading sessions logged yet. Start tracking your daily reading!</p>
            )}
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
