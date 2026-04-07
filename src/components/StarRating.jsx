import React, { useState } from 'react';
import styles from './StarRating.module.css';

const StarRating = ({ rating = 0, onRate, readonly = false, size = 24 }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className={styles.starRating}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`${styles.star} ${
            (hovered || rating) >= star ? styles.filled : styles.empty
          } ${readonly ? styles.readonly : ''}`}
          onClick={() => !readonly && onRate && onRate(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          style={{ fontSize: `${size}px` }}
          role="button"
          aria-label={`Rate ${star} stars`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
