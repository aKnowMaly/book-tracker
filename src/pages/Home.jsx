import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import QuoteBox from '../components/QuoteBox';
import StarRating from '../components/StarRating';
import { getCoverColor } from '../data/sampleBooks';
import styles from './Home.module.css';

const Home = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('books');
    if (saved) {
      setBooks(JSON.parse(saved));
    }
  }, []);

  const totalBooks = books.length;
  const currentlyReading = books.filter(b => b.status === 'reading');
  const completed = books.filter(b => b.status === 'completed');
  const wantToRead = books.filter(b => b.status === 'want-to-read');

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroIcon}>📚</span>
            Your Reading Dashboard
          </h1>
          <p className={styles.heroSubtitle}>
            Track your books, set goals, and discover your reading journey.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <StatCard
          icon="📚"
          label="Total Books"
          value={totalBooks}
          color="#f0c27f"
        />
        <StatCard
          icon="📖"
          label="Currently Reading"
          value={currentlyReading.length}
          color="#E07A5F"
        />
        <StatCard
          icon="✅"
          label="Completed"
          value={completed.length}
          color="#52b788"
        />
        <StatCard
          icon="🔖"
          label="Want to Read"
          value={wantToRead.length}
          color="#2E86AB"
        />
      </div>

      {/* Currently Reading Section */}
      {currentlyReading.length > 0 && (
        <div className={styles.currentSection}>
          <h2 className={styles.sectionTitle}>
            <span>📖</span> Currently Reading
          </h2>
          <div className={styles.currentList}>
            {currentlyReading.map(book => (
              <div className={styles.currentCard} key={book.id}>
                <div
                  className={styles.currentCover}
                  style={{ backgroundColor: getCoverColor(book.title) }}
                >
                  <div className={styles.currentCoverContent}>
                    <span className={styles.currentCoverTitle}>{book.title}</span>
                    <span className={styles.currentCoverAuthor}>{book.author}</span>
                  </div>
                </div>
                <div className={styles.currentInfo}>
                  <h3 className={styles.currentTitle}>{book.title}</h3>
                  <p className={styles.currentAuthor}>by {book.author}</p>
                  {book.rating > 0 && (
                    <StarRating rating={book.rating} readonly size={18} />
                  )}
                  <div className={styles.currentProgress}>
                    <ProgressBar
                      current={book.currentPage}
                      total={book.totalPages}
                      height={12}
                    />
                  </div>
                  <Link to={`/book/${book.id}`} className={styles.continueBtn}>
                    Continue Reading →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quote Section */}
      <div className={styles.quoteSection}>
        <QuoteBox />
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <h2 className={styles.sectionTitle}>
          <span>⚡</span> Quick Actions
        </h2>
        <div className={styles.actionGrid}>
          <Link to="/add" className={styles.actionCard}>
            <span className={styles.actionIcon}>➕</span>
            <span className={styles.actionLabel}>Add New Book</span>
          </Link>
          <Link to="/library" className={styles.actionCard}>
            <span className={styles.actionIcon}>📖</span>
            <span className={styles.actionLabel}>Browse Library</span>
          </Link>
          <Link to="/goals" className={styles.actionCard}>
            <span className={styles.actionIcon}>🎯</span>
            <span className={styles.actionLabel}>Reading Goals</span>
          </Link>
        </div>
      </div>

      {/* Recently Added */}
      {books.length > 0 && (
        <div className={styles.recentSection}>
          <h2 className={styles.sectionTitle}>
            <span>🕐</span> Recently Added
          </h2>
          <div className={styles.recentList}>
            {[...books]
              .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
              .slice(0, 4)
              .map(book => (
                <Link
                  to={`/book/${book.id}`}
                  key={book.id}
                  className={styles.recentItem}
                >
                  <div
                    className={styles.recentCover}
                    style={{ backgroundColor: getCoverColor(book.title) }}
                  >
                    <span className={styles.recentInitial}>
                      {book.title.charAt(0)}
                    </span>
                  </div>
                  <div className={styles.recentInfo}>
                    <span className={styles.recentTitle}>{book.title}</span>
                    <span className={styles.recentAuthor}>{book.author}</span>
                  </div>
                  <span className={`${styles.recentStatus} ${styles[book.status]}`}>
                    {book.status === 'reading' ? '📖' : book.status === 'completed' ? '✅' : '🔖'}
                  </span>
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
