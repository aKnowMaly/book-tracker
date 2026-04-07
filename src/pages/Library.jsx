import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BookCard from '../components/BookCard';
import styles from './Library.module.css';

const Library = () => {
  const [books, setBooks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('dateAdded');

  useEffect(() => {
    const saved = localStorage.getItem('books');
    if (saved) {
      setBooks(JSON.parse(saved));
    }
  }, []);

  const filteredBooks = books
    .filter(book => {
      if (filter === 'all') return true;
      return book.status === filter;
    })
    .filter(book => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'rating':
          return b.rating - a.rating;
        case 'dateAdded':
        default:
          return new Date(b.dateAdded) - new Date(a.dateAdded);
      }
    });

  const filterOptions = [
    { key: 'all', label: 'All', icon: '📚' },
    { key: 'reading', label: 'Reading', icon: '📖' },
    { key: 'completed', label: 'Completed', icon: '✅' },
    { key: 'want-to-read', label: 'Want to Read', icon: '🔖' }
  ];

  return (
    <div className={styles.library}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>
            <span>📖</span> My Library
          </h1>
          <span className={styles.bookCount}>{filteredBooks.length} books</span>
        </div>
        <Link to="/add" className={styles.addBtn}>
          <span>+</span> Add Book
        </Link>
      </div>

      {/* Search and Sort */}
      <div className={styles.controls}>
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
            id="library-search"
          />
          {search && (
            <button
              className={styles.clearSearch}
              onClick={() => setSearch('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={styles.sortSelect}
          id="library-sort"
        >
          <option value="dateAdded">Date Added</option>
          <option value="title">Title</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      {/* Filter */}
      <div className={styles.filters}>
        {filterOptions.map(opt => (
          <button
            key={opt.key}
            className={`${styles.filterBtn} ${filter === opt.key ? styles.activeFilter : ''}`}
            onClick={() => setFilter(opt.key)}
            id={`filter-${opt.key}`}
          >
            <span className={styles.filterIcon}>{opt.icon}</span>
            {opt.label}
            <span className={styles.filterCount}>
              {opt.key === 'all'
                ? books.length
                : books.filter(b => b.status === opt.key).length}
            </span>
          </button>
        ))}
      </div>

      {/* Books Grid */}
      {filteredBooks.length > 0 ? (
        <div className={styles.booksGrid}>
          {filteredBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>📚</span>
          <h3>No books found</h3>
          <p>
            {search
              ? `No books matching "${search}"`
              : filter !== 'all'
              ? `No books with status "${filter}"`
              : 'Your library is empty. Add your first book!'}
          </p>
          <Link to="/add" className={styles.emptyAction}>
            Add a Book →
          </Link>
        </div>
      )}
    </div>
  );
};

export default Library;
