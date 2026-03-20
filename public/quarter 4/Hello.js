const stars = document.querySelectorAll('.star');
let rating = 0;

// Initialize rating stars
stars.forEach((star, idx) => {
  star.addEventListener('click', function() {
    rating = idx + 1;
    updateStars();
  });
});

function updateStars() {
  stars.forEach((star, idx) => {
    if (idx < rating) {
      star.classList.add('active');
    } else {
      star.classList.remove('active');
    }
  });
}

// Handle form submission
document.querySelector('form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  if (rating === 0) {
    alert('Please select a rating!');
    return;
  }
  
  // Get form values
  const title = document.getElementById('title').value;
  const year = document.getElementById('year').value;
  const genre = document.getElementById('genre').value;
  
  // Create movie object
  const movie = {
    id: Date.now(),
    title: title,
    year: year,
    genre: genre,
    rating: rating
  };
  
  // Get existing movies from localStorage
  let movies = JSON.parse(localStorage.getItem('movies')) || [];
  
  // Add new movie
  movies.push(movie);
  
  // Save to localStorage
  localStorage.setItem('movies', JSON.stringify(movies));
  
  // Reset form
  document.querySelector('form').reset();
  rating = 0;
  updateStars();
  
  // Refresh movie list
  displayMovies();
  
  alert('Movie added successfully!');
});

// Display movies from localStorage
function displayMovies() {
  const movieList = document.getElementById('movie-list');
  const movies = JSON.parse(localStorage.getItem('movies')) || [];
  
  movieList.innerHTML = '';
  
  if (movies.length === 0) {
    movieList.innerHTML = '<p>No movies added yet.</p>';
    return;
  }
  
  movies.forEach((movie) => {
    const movieItem = document.createElement('div');
    movieItem.className = 'movie-item';
    
    const stars = '★'.repeat(movie.rating) + '☆'.repeat(5 - movie.rating);
    
    movieItem.innerHTML = `
      <div class="movie-content">
        <h3>${movie.title}</h3>
        <p><strong>Year:</strong> ${movie.year}</p>
        <p><strong>Genre:</strong> ${movie.genre}</p>
        <p><strong>Rating:</strong> <span class="movie-stars">${stars}</span> (${movie.rating}/5)</p>
      </div>
      <button class="delete-btn" onclick="deleteMovie(${movie.id})">Delete</button>
    `;
    
    movieList.appendChild(movieItem);
  });
}

// Delete movie from localStorage
function deleteMovie(id) {
  let movies = JSON.parse(localStorage.getItem('movies')) || [];
  movies = movies.filter(movie => movie.id !== id);
  localStorage.setItem('movies', JSON.stringify(movies));
  displayMovies();
}

// Load movies when page loads
window.addEventListener('load', displayMovies);