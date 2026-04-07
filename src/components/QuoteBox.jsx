import React, { useState, useEffect } from 'react';
import { readingQuotes } from '../data/sampleBooks';
import styles from './QuoteBox.module.css';

const QuoteBox = () => {
  const [quote, setQuote] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * readingQuotes.length);
    setQuote(readingQuotes[randomIndex]);
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  if (!quote) return null;

  return (
    <div className={`${styles.quoteBox} ${fadeIn ? styles.visible : ''}`}>
      <span className={styles.quoteIcon}>❝</span>
      <p className={styles.quoteText}>{quote.text}</p>
      <span className={styles.quoteAuthor}>— {quote.author}</span>
    </div>
  );
};

export default QuoteBox;
