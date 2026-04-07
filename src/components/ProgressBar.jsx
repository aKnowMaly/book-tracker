import React from 'react';
import PropTypes from 'prop-types';
import styles from './ProgressBar.module.css';

const ProgressBar = ({ current, total, showLabel = true, height = 10, color }) => {
  const percentage = total > 0 ? Math.min(Math.round((current / total) * 100), 100) : 0;

  const barColor = color || (
    percentage >= 100 ? '#2D6A4F' :
    percentage >= 50 ? '#E07A5F' :
    '#f0c27f'
  );

  return (
    <div className={styles.progressContainer}>
      <div
        className={styles.progressTrack}
        style={{ height: `${height}px` }}
      >
        <div
          className={styles.progressFill}
          style={{
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${barColor}, ${barColor}dd)`,
            height: `${height}px`
          }}
        >
          {percentage > 15 && height >= 10 && (
            <span className={styles.progressInner}>{percentage}%</span>
          )}
        </div>
      </div>
      {showLabel && (
        <div className={styles.progressLabel}>
          <span>{current} / {total} pages</span>
          <span className={styles.percentText}>{percentage}%</span>
        </div>
      )}
    </div>
  );
};

ProgressBar.propTypes = {
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  showLabel: PropTypes.bool,
  height: PropTypes.number,
  color: PropTypes.string
};

export default ProgressBar;
