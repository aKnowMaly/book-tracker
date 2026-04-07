import React from 'react';
import PropTypes from 'prop-types';
import styles from './StatCard.module.css';

const StatCard = ({ icon, label, value, color, subtitle }) => {
  return (
    <div
      className={styles.statCard}
      style={{ '--accent-color': color }}
    >
      <div className={styles.iconWrapper} style={{ background: `${color}18` }}>
        <span className={styles.icon}>{icon}</span>
      </div>
      <div className={styles.content}>
        <span className={styles.value}>{value}</span>
        <span className={styles.label}>{label}</span>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </div>
      <div className={styles.accent} style={{ background: color }}></div>
    </div>
  );
};

StatCard.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.string,
  subtitle: PropTypes.string
};

StatCard.defaultProps = {
  color: '#f0c27f'
};

export default StatCard;
