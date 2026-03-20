const stars = document.querySelectorAll('.star');
let rating = 0;

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