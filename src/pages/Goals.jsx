import React, { useState, useEffect } from 'react';
import ProgressBar from '../components/ProgressBar';
import { getCoverColor } from '../data/sampleBooks';
import styles from './Goals.module.css';

const Goals = () => {
  const [books, setBooks] = useState([]);
  const [yearlyGoal, setYearlyGoal] = useState(() => {
    const saved = localStorage.getItem('booktracker-goal');
    return saved ? parseInt(saved) : 12;
  });
  const [inputGoal, setInputGoal] = useState(yearlyGoal);

  useEffect(() => {
    const saved = localStorage.getItem('books');
    if (saved) {
      setBooks(JSON.parse(saved));
    }
  }, []);

  const completedBooks = books.filter(b => b.status === 'completed');
  const currentYear = new Date().getFullYear();
  const completedThisYear = completedBooks.filter(b => {
    if (!b.dateCompleted) return false;
    return new Date(b.dateCompleted).getFullYear() === currentYear;
  });

  const handleGoalUpdate = () => {
    const goal = Math.max(1, parseInt(inputGoal) || 1);
    setYearlyGoal(goal);
    setInputGoal(goal);
    localStorage.setItem('booktracker-goal', String(goal));
  };

  const goalPercentage = yearlyGoal > 0
    ? Math.min(Math.round((completedThisYear.length / yearlyGoal) * 100), 100)
    : 0;

  return (
    <div className={styles.goals}>
      <h1 className={styles.pageTitle}>
        <span>🎯</span> Reading Goals
      </h1>
      <p className={styles.subtitle}>
        Set your yearly reading target and track your progress.
      </p>

      {/* Goal Setting */}
      <div className={styles.goalCard}>
        <div className={styles.goalHeader}>
          <h2 className={styles.goalTitle}>{currentYear} Reading Goal</h2>
          <div className={styles.goalBadge}>
            {completedThisYear.length} / {yearlyGoal} books
          </div>
        </div>

        <div className={styles.goalProgress}>
          <ProgressBar
            current={completedThisYear.length}
            total={yearlyGoal}
            showLabel={false}
            height={20}
            color="#52b788"
          />
          <div className={styles.goalStats}>
            <span className={styles.goalPercent}>{goalPercentage}%</span>
            <span className={styles.goalRemaining}>
              {Math.max(0, yearlyGoal - completedThisYear.length)} books remaining
            </span>
          </div>
        </div>

        <div className={styles.goalInput}>
          <label htmlFor="yearly-goal" className={styles.goalLabel}>
            Set your goal:
          </label>
          <div className={styles.goalInputRow}>
            <input
              type="number"
              id="yearly-goal"
              value={inputGoal}
              onChange={(e) => setInputGoal(e.target.value)}
              className={styles.goalField}
              min="1"
              max="365"
            />
            <span className={styles.goalUnit}>books per year</span>
            <button
              className={styles.goalSaveBtn}
              onClick={handleGoalUpdate}
            >
              Update Goal
            </button>
          </div>
        </div>

        {/* Motivational message */}
        <div className={styles.motivation}>
          {goalPercentage >= 100 ? (
            <span>🎉 Congratulations! You've reached your reading goal!</span>
          ) : goalPercentage >= 75 ? (
            <span>🔥 Almost there! Keep up the amazing pace!</span>
          ) : goalPercentage >= 50 ? (
            <span>📖 Great progress! You're halfway to your goal!</span>
          ) : goalPercentage >= 25 ? (
            <span>💪 Good start! Keep reading to reach your goal!</span>
          ) : (
            <span>📚 Start reading — every page counts!</span>
          )}
        </div>
      </div>

      {/* Completed Books List */}
      <div className={styles.completedSection}>
        <h2 className={styles.sectionTitle}>
          <span>✅</span> Completed Books
          <span className={styles.completedCount}>{completedBooks.length}</span>
        </h2>

        {completedBooks.length > 0 ? (
          <div className={styles.completedList}>
            {completedBooks
              .sort((a, b) => new Date(b.dateCompleted || b.dateAdded) - new Date(a.dateCompleted || a.dateAdded))
              .map(book => (
                <div key={book.id} className={styles.completedItem}>
                  <div
                    className={styles.completedCover}
                    style={{ backgroundColor: getCoverColor(book.title) }}
                  >
                    <span className={styles.completedInitial}>
                      {book.title.charAt(0)}
                    </span>
                  </div>
                  <div className={styles.completedInfo}>
                    <span className={styles.completedTitle}>{book.title}</span>
                    <span className={styles.completedAuthor}>by {book.author}</span>
                  </div>
                  <div className={styles.completedMeta}>
                    <div className={styles.completedStars}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <span
                          key={star}
                          className={star <= book.rating ? styles.starFilled : styles.starEmpty}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    {book.dateCompleted && (
                      <span className={styles.completedDate}>
                        {new Date(book.dateCompleted).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>📚</span>
            <p>No completed books yet. Start reading!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;
