import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Library from './pages/Library';
import AddBook from './pages/AddBook';
import BookDetail from './pages/BookDetail';
import Goals from './pages/Goals';
import Stats from './pages/Stats';
import sampleBooks from './data/sampleBooks';
import './App.css';

function App() {
  useEffect(() => {
    // Initialize sample books on first load if localStorage is empty
    const saved = localStorage.getItem('books');
    if (!saved || JSON.parse(saved).length === 0) {
      localStorage.setItem('books', JSON.stringify(sampleBooks));
    } else {
      // Ensure existing books have readingLog array
      const books = JSON.parse(saved);
      let needsUpdate = false;
      const updated = books.map(b => {
        if (!b.readingLog) {
          needsUpdate = true;
          // Check if this is a sample book that should have logs
          const sample = sampleBooks.find(s => s.id === b.id);
          return { ...b, readingLog: (sample && sample.readingLog) || [] };
        }
        return b;
      });
      if (needsUpdate) {
        localStorage.setItem('books', JSON.stringify(updated));
      }
    }
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/library" element={<Library />} />
              <Route path="/add" element={<AddBook />} />
              <Route path="/book/:id" element={<BookDetail />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/stats" element={<Stats />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
