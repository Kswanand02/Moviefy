import React, { useState, useEffect, useCallback } from "react";
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

  
  const fetchMovies = useCallback(async (page = 1) => {
    try {
      const response = await axios.get(`${BASE_URL}/search/movie`, {
        params: {
          api_key: API_KEY,
          query: searchTerm || "a", 
          page,
          include_adult: false, 
        },
      });

     
      const maxPages = 10; 
      setMovies(response.data.results);
      setTotalPages(Math.min(response.data.total_pages, maxPages));
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  }, [searchTerm]); 


  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };


  useEffect(() => {
    fetchMovies(currentPage);
  }, [fetchMovies, currentPage]);


  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getVisiblePages = () => {
    const totalPageNumbersToShow = 5;
    const halfRange = Math.floor(totalPageNumbersToShow / 2);

    let startPage = Math.max(1, currentPage - halfRange);
    let endPage = Math.min(totalPages, currentPage + halfRange);

 
    if (currentPage <= halfRange) {
      endPage = Math.min(totalPages, totalPageNumbersToShow);
    } else if (currentPage + halfRange > totalPages) {
      startPage = Math.max(1, totalPages - totalPageNumbersToShow + 1);
    }


    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
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
                  {/* Previous Button */}
                  {currentPage > 1 && (
                    <span onClick={() => handlePageChange(currentPage - 1)}>Previous</span>
                  )}
                  
                  {/* Page Numbers */}
                  {getVisiblePages().map((page) => (
                    <span
                      key={page}
                      className={currentPage === page ? "active" : ""}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </span>
                  ))}

                  {/* Next Button */}
                  {currentPage < totalPages && (
                    <span onClick={() => handlePageChange(currentPage + 1)}>Next</span>
                  )}
                </div>
              </>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
