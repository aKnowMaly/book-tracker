import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className={`${styles.navbar} ${darkMode ? styles.dark : ''}`}>
      <div className={styles.container}>
        <NavLink to="/" className={styles.logo}>
          <span className={styles.logoIcon}>📚</span>
          <span className={styles.logoText}>BookTracker</span>
        </NavLink>

        <ul className={styles.navLinks}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
              end
            >
              <span className={styles.navIcon}>🏠</span>
              <span>Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/library"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.navIcon}>📖</span>
              <span>Library</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/add"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.navIcon}>➕</span>
              <span>Add Book</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/goals"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.navIcon}>🎯</span>
              <span>Goals</span>
            </NavLink>
          </li>

        </ul>

        <button
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          id="theme-toggle-btn"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
