import React, { useState, useEffect, } from "react";
import axios from "axios";
import About from "./Components/About";
import Contact from "./Components/Contact";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const API_KEY = "38171229de3ee3a438b9c4036781e4ca"; 
  const BASE_URL = "https://api.themoviedb.org/3";

  // Fetch movies from the API
  const fetchMovies = async (page = 1) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/search/movie`,
        {
          params: {
            api_key: API_KEY,
            query: searchTerm || "a", // Default query to avoid empty search
            page,
          },
        }
      );
      setMovies(response.data.results);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Search when term or page changes
  useEffect(() => {
    fetchMovies(currentPage);
  }, [searchTerm, currentPage]);

  // Handle page change
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <Router>
      <div className="app">
        {/* Navbar */}
        <nav className="navbar">
          <div className="navbar-brand">Moviefy</div>
          <ul className="navbar-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>

        {/* Main Content */}
        <Routes>
          <Route 
            path="/" 
            element={
              <>
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Search for movies..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
                <div className="movie-list">
                  {movies.map((movie) => (
                    <div className="movie-card" key={movie.id}>
                      <img
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                            : "https://via.placeholder.com/200"
                        }
                        alt={movie.title}
                      />
                      <h3>{movie.title}</h3>
                    </div>
                  ))}
                </div>
                <div className="pagination">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <span
                      key={index}
                      className={currentPage === index + 1 ? "active" : ""}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </span>
                  ))}
                </div>
              </>
            } 
          />
          <Route path="/" element={<App />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
