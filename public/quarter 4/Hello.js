let rating = 0;

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
  const stars = document.querySelectorAll('.star');
  const form = document.querySelector('form');
  
  // Star click event
  stars.forEach((star, idx) => {
    star.addEventListener('click', function() {
      rating = idx + 1;
      // Update all stars
      stars.forEach((s, i) => {
        if (i < rating) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });
    });
  });
  
  // Form submit event
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Check rating
    if (rating === 0) {
      alert('Please select a rating (1-5 stars)');
      return;
    }
    
    // Get form inputs
    const title = document.getElementById('title').value.trim();
    const year = document.getElementById('year').value;
    const genre = document.getElementById('genre').value;
    
    if (!title || !year || !genre) {
      alert('Please fill in all fields');
      return;
    }
    
    // Create movie object
    const movie = {
      id: Date.now(),
      title: title,
      year: parseInt(year),
      genre: genre,
      rating: rating
    };
    
    // Get movies from localStorage
    let movies = [];
    const stored = localStorage.getItem('movies');
    if (stored) {
      movies = JSON.parse(stored);
    }
    
    // Add new movie
    movies.push(movie);
    
    // Save back to localStorage
    localStorage.setItem('movies', JSON.stringify(movies));
    
    // Reset form and rating
    form.reset();
    rating = 0;
    stars.forEach(s => s.classList.remove('active'));
    
    // Display updated list
    displayMovies();
    
    alert('Movie added successfully!');
  });
  
  // Display movies on page load
  displayMovies();
});

// Display all movies
function displayMovies() {
  const movieList = document.getElementById('movie-list');
  
  if (!movieList) {
    console.error('movie-list element not found');
    return;
  }
  
  movieList.innerHTML = '';
  
  // Get movies from localStorage
  let movies = [];
  const stored = localStorage.getItem('movies');
  if (stored) {
    movies = JSON.parse(stored);
  }
  
  // If no movies
  if (movies.length === 0) {
    movieList.innerHTML = '<p style="text-align: center; color: #999;">No movies added yet. Add your first movie!</p>';
    return;
  }
  
  // Display each movie
  movies.forEach((movie) => {
    const starDisplay = '★'.repeat(movie.rating);
    
    const movieDiv = document.createElement('div');
    movieDiv.className = 'movie-item';
    movieDiv.innerHTML = `
      <div class="movie-content">
        <h3>${movie.title}</h3>
        <p><strong>Year:</strong> ${movie.year}</p>
        <p><strong>Genre:</strong> ${movie.genre}</p>
        <p class="movie-stars"><strong>Rating:</strong> ${starDisplay} (${movie.rating}/5)</p>
      </div>
      <button class="delete-btn" onclick="deleteMovie(${movie.id})">Delete</button>
    `;
    
    movieList.appendChild(movieDiv);
  });
}

// Delete movie function
function deleteMovie(id) {
  // Get movies
  let movies = [];
  const stored = localStorage.getItem('movies');
  if (stored) {
    movies = JSON.parse(stored);
  }
  
  // Remove movie with matching id
  movies = movies.filter(movie => movie.id !== id);
  
  // Save updated list
  localStorage.setItem('movies', JSON.stringify(movies));
  
  // Refresh display
  displayMovies();
}