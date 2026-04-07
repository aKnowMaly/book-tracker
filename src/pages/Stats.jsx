import React, { useState, useEffect } from 'react';
import { genreColors } from '../data/sampleBooks';
import styles from './Stats.module.css';

const Stats = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('books');
    if (saved) {
      setBooks(JSON.parse(saved));
    }
  }, []);

  // Total pages read
  const totalPagesRead = books.reduce((sum, b) => sum + b.currentPage, 0);

  // Completed books
  const completedBooks = books.filter(b => b.status === 'completed');

  // Books read per month (last 12 months)
  const getMonthlyData = () => {
    const months = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      const count = completedBooks.filter(b => {
        if (!b.dateCompleted) return false;
        const bd = new Date(b.dateCompleted);
        return bd.getFullYear() === d.getFullYear() && bd.getMonth() === d.getMonth();
      }).length;
      months.push({ key: monthKey, label, count });
    }
    return months;
  };

  const monthlyData = getMonthlyData();
  const maxMonthly = Math.max(...monthlyData.map(m => m.count), 1);

  // Genre breakdown
  const genreBreakdown = books.reduce((acc, b) => {
    acc[b.genre] = (acc[b.genre] || 0) + 1;
    return acc;
  }, {});
  const sortedGenres = Object.entries(genreBreakdown).sort((a, b) => b[1] - a[1]);

  // Average reading speed from reading logs
  const getReadingSpeed = () => {
    let totalPages = 0;
    let totalDays = 0;

    books.forEach(book => {
      const log = book.readingLog || [];
      if (log.length > 0) {
        totalPages += log.reduce((sum, entry) => sum + entry.pagesRead, 0);
        const uniqueDays = new Set(log.map(e => e.date)).size;
        totalDays += uniqueDays;
      }
    });

    if (totalDays === 0) return null;
    return Math.round(totalPages / totalDays);
  };

  const readingSpeed = getReadingSpeed();

  // Total reading sessions
  const totalSessions = books.reduce((sum, b) => sum + (b.readingLog || []).length, 0);

  // Average rating
  const ratedBooks = books.filter(b => b.rating > 0);
  const avgRating = ratedBooks.length > 0
    ? (ratedBooks.reduce((sum, b) => sum + b.rating, 0) / ratedBooks.length).toFixed(1)
    : null;

  return (
    <div className={styles.stats}>
      <h1 className={styles.pageTitle}>
        <span>📊</span> Stats & Analytics
      </h1>
      <p className={styles.subtitle}>
        Discover insights about your reading habits and progress.
      </p>

      {/* Overview Cards */}
      <div className={styles.overviewGrid}>
        <div className={styles.overviewCard}>
          <span className={styles.overviewIcon}>📄</span>
          <div className={styles.overviewContent}>
            <span className={styles.overviewValue}>{totalPagesRead.toLocaleString()}</span>
            <span className={styles.overviewLabel}>Total Pages Read</span>
          </div>
        </div>
        <div className={styles.overviewCard}>
          <span className={styles.overviewIcon}>📚</span>
          <div className={styles.overviewContent}>
            <span className={styles.overviewValue}>{completedBooks.length}</span>
            <span className={styles.overviewLabel}>Books Completed</span>
          </div>
        </div>
        <div className={styles.overviewCard}>
          <span className={styles.overviewIcon}>⚡</span>
          <div className={styles.overviewContent}>
            <span className={styles.overviewValue}>
              {readingSpeed ? `${readingSpeed}` : '—'}
            </span>
            <span className={styles.overviewLabel}>
              {readingSpeed ? 'Pages / Day (Avg)' : 'Log sessions to track'}
            </span>
          </div>
        </div>
        <div className={styles.overviewCard}>
          <span className={styles.overviewIcon}>⭐</span>
          <div className={styles.overviewContent}>
            <span className={styles.overviewValue}>{avgRating || '—'}</span>
            <span className={styles.overviewLabel}>Average Rating</span>
          </div>
        </div>
      </div>

      {/* Monthly Bar Chart */}
      <div className={styles.chartSection}>
        <h2 className={styles.sectionTitle}>
          <span>📈</span> Books Completed Per Month
        </h2>
        <div className={styles.barChart}>
          {monthlyData.map(month => (
            <div key={month.key} className={styles.barCol}>
              <div className={styles.barWrapper}>
                <div
                  className={styles.bar}
                  style={{
                    height: `${month.count > 0 ? Math.max((month.count / maxMonthly) * 100, 8) : 0}%`,
                    background: month.count > 0
                      ? 'linear-gradient(180deg, #f0c27f, #e8b86d)'
                      : 'transparent'
                  }}
                >
                  {month.count > 0 && (
                    <span className={styles.barValue}>{month.count}</span>
                  )}
                </div>
              </div>
              <span className={styles.barLabel}>{month.label}</span>
            </div>
          ))}
        </div>
        {completedBooks.length === 0 && (
          <p className={styles.chartEmpty}>Complete some books to see your monthly reading chart!</p>
        )}
      </div>

      {/* Genre Breakdown */}
      <div className={styles.genreSection}>
        <h2 className={styles.sectionTitle}>
          <span>🏷️</span> Genre Breakdown
        </h2>
        {sortedGenres.length > 0 ? (
          <div className={styles.genreGrid}>
            {sortedGenres.map(([genre, count]) => (
              <div key={genre} className={styles.genreItem}>
                <span
                  className={styles.genrePill}
                  style={{
                    backgroundColor: `${genreColors[genre] || genreColors['Other']}20`,
                    color: genreColors[genre] || genreColors['Other'],
                    borderColor: `${genreColors[genre] || genreColors['Other']}40`
                  }}
                >
                  {genre}
                </span>
                <div className={styles.genreBar}>
                  <div
                    className={styles.genreFill}
                    style={{
                      width: `${(count / books.length) * 100}%`,
                      backgroundColor: genreColors[genre] || genreColors['Other']
                    }}
                  ></div>
                </div>
                <span className={styles.genreCount}>
                  {count} book{count !== 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.emptyText}>Add books to see your genre preferences.</p>
        )}
      </div>

      {/* Reading Activity */}
      <div className={styles.activitySection}>
        <h2 className={styles.sectionTitle}>
          <span>📝</span> Reading Activity
        </h2>
        <div className={styles.activityGrid}>
          <div className={styles.activityCard}>
            <span className={styles.activityValue}>{totalSessions}</span>
            <span className={styles.activityLabel}>Total Sessions Logged</span>
          </div>
          <div className={styles.activityCard}>
            <span className={styles.activityValue}>{books.filter(b => b.status === 'reading').length}</span>
            <span className={styles.activityLabel}>Currently Reading</span>
          </div>
          <div className={styles.activityCard}>
            <span className={styles.activityValue}>{books.filter(b => b.favourite).length}</span>
            <span className={styles.activityLabel}>Favourites</span>
          </div>
          <div className={styles.activityCard}>
            <span className={styles.activityValue}>
              {books.length > 0 ? Math.round(totalPagesRead / books.length) : 0}
            </span>
            <span className={styles.activityLabel}>Avg Pages / Book</span>
          </div>
        </div>
      </div>

      {/* Top Rated */}
      {ratedBooks.length > 0 && (
        <div className={styles.topRatedSection}>
          <h2 className={styles.sectionTitle}>
            <span>🏆</span> Top Rated Books
          </h2>
          <div className={styles.topList}>
            {[...ratedBooks]
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 5)
              .map((book, index) => (
                <div key={book.id} className={styles.topItem}>
                  <span className={styles.topRank}>#{index + 1}</span>
                  <div className={styles.topInfo}>
                    <span className={styles.topTitle}>{book.title}</span>
                    <span className={styles.topAuthor}>{book.author}</span>
                  </div>
                  <div className={styles.topStars}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <span
                        key={star}
                        className={star <= book.rating ? styles.starFilled : styles.starEmpty}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats;
