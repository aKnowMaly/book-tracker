import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Library from './pages/Library';
import AddBook from './pages/AddBook';
import BookDetail from './pages/BookDetail';
import Goals from './pages/Goals';
import sampleBooks from './data/sampleBooks';
import './App.css';

function App() {
  useEffect(() => {
    // Initialize sample books on first load if localStorage is empty
    const saved = localStorage.getItem('books');
    if (!saved || JSON.parse(saved).length === 0) {
      localStorage.setItem('books', JSON.stringify(sampleBooks));
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

            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
