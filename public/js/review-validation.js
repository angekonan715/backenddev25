// Review Form Validation
document.addEventListener('DOMContentLoaded', function() {
    const addReviewForm = document.getElementById('addReviewForm');
    const editReviewForm = document.getElementById('editReviewForm');

    // Add Review Form Validation
    if (addReviewForm) {
        addReviewForm.addEventListener('submit', function(e) {
            const reviewText = document.getElementById('review_text').value.trim();
            
            if (!reviewText) {
                e.preventDefault();
                alert('Please enter a review.');
                return false;
            }
            
            if (reviewText.length < 10) {
                e.preventDefault();
                alert('Review must be at least 10 characters long.');
                return false;
            }
        });
    }

    // Edit Review Form Validation
    if (editReviewForm) {
        editReviewForm.addEventListener('submit', function(e) {
            const reviewText = document.getElementById('review_text').value.trim();
            
            if (!reviewText) {
                e.preventDefault();
                alert('Please enter a review.');
                return false;
            }
            
            if (reviewText.length < 10) {
                e.preventDefault();
                alert('Review must be at least 10 characters long.');
                return false;
            }
        });
    }

    // Real-time character count for review textareas
    const reviewTextareas = document.querySelectorAll('#review_text');
    reviewTextareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            const length = this.value.length;
            const minLength = 10;
            
            if (length < minLength) {
                this.style.borderColor = '#dc3545';
            } else {
                this.style.borderColor = '#28a745';
            }
        });
    });
}); 