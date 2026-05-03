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
    
    // Get movies from localStorage
    let movies = [];
    const stored = localStorage.getItem('movies');
    if (stored) {
      movies = JSON.parse(stored);
    }
    
    // Check if movie with same title already exists (case-insensitive)
    const existingMovieIndex = movies.findIndex(m => m.title.toLowerCase() === title.toLowerCase());
    
    if (existingMovieIndex !== -1) {
      // Movie exists - update it with averaged rating
      const existingMovie = movies[existingMovieIndex];
      const newRating = (existingMovie.rating + rating) / 2;
      
      movies[existingMovieIndex] = {
        id: existingMovie.id,
        title: title,
        year: parseInt(year),
        genre: genre,
        rating: newRating
      };
      
      alert(`Movie updated! Old rating: ${existingMovie.rating}/5, New rating: ${rating}/5\nAveraged rating: ${newRating.toFixed(1)}/5`);
    } else {
      // Movie doesn't exist - create new one
      const movie = {
        id: Date.now(),
        title: title,
        year: parseInt(year),
        genre: genre,
        rating: rating
      };
      
      movies.push(movie);
      alert('Movie added successfully!');
    }
    
    // Save back to localStorage
    localStorage.setItem('movies', JSON.stringify(movies));
    
    // Reset form and rating
    form.reset();
    rating = 0;
    stars.forEach(s => s.classList.remove('active'));
    
    // Display updated list
    displayMovies();
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
    const filledStars = '★'.repeat(movie.rating);
    const emptyStars = '☆'.repeat(5 - movie.rating);
    const starDisplay = filledStars + emptyStars;
    
    const movieDiv = document.createElement('div');
    movieDiv.className = 'movie-item';
    movieDiv.innerHTML = `
      <div class="movie-content">
        <h3>${movie.title}</h3>
        <p><strong>Year:</strong> ${movie.year}</p>
        <p><strong>Genre:</strong> ${movie.genre}</p>
        <p class="movie-stars"><span class="filled-stars">${filledStars}</span><span class="empty-stars">${emptyStars}</span> (${movie.rating}/5)</p>
      </div>
      <button class="delete-btn" onclick="deleteMovie(${movie.id})">Delete</button>
    `;
    
    movieList.appendChild(movieDiv);
  });
}

// Delete movie function
function deleteMovie(id) {
  // Confirm deletion
  if (!confirm('Are you sure you want to delete this movie?')) {
    return;
  }
  
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