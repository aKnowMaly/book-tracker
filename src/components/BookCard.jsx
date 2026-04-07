import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating';
import ProgressBar from './ProgressBar';
import { genreColors, getCoverColor } from '../data/sampleBooks';
import styles from './BookCard.module.css';

const statusLabels = {
  'reading': 'Reading',
  'completed': 'Completed',
  'want-to-read': 'Want to Read'
};

const BookCard = ({ book }) => {
  const navigate = useNavigate();
  const coverColor = getCoverColor(book.title);

  return (
    <div
      className={styles.bookCard}
      onClick={() => navigate(`/book/${book.id}`)}
      id={`book-card-${book.id}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/book/${book.id}`)}
    >
      {/* Book Cover */}
      <div
        className={styles.cover}
        style={{ backgroundColor: coverColor }}
      >
        <div className={styles.coverPattern}></div>
        <div className={styles.coverContent}>
          <span className={styles.coverTitle}>{book.title}</span>
          <span className={styles.coverAuthor}>{book.author}</span>
        </div>
        {book.favourite && (
          <span className={styles.favourite}>❤️</span>
        )}
      </div>

      {/* Card Body */}
      <div className={styles.body}>
        <h3 className={styles.title}>{book.title}</h3>
        <p className={styles.author}>by {book.author}</p>

        <div className={styles.meta}>
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
          <span className={`${styles.status} ${styles[book.status]}`}>
            {statusLabels[book.status]}
          </span>
        </div>

        {book.rating > 0 && (
          <div className={styles.rating}>
            <StarRating rating={book.rating} readonly size={14} />
          </div>
        )}

        {book.status === 'reading' && (
          <div className={styles.progress}>
            <ProgressBar
              current={book.currentPage}
              total={book.totalPages}
              showLabel={false}
              height={6}
            />
            <span className={styles.progressText}>
              {Math.round((book.currentPage / book.totalPages) * 100)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

BookCard.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    genre: PropTypes.string.isRequired,
    totalPages: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    status: PropTypes.oneOf(['reading', 'completed', 'want-to-read']).isRequired,
    rating: PropTypes.number,
    favourite: PropTypes.bool,
    notes: PropTypes.string
  }).isRequired
};

export default BookCard;
