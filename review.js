document.addEventListener('DOMContentLoaded', function() {
    const reviewTopicName = document.getElementById('review-topic-name');
    const flashcardContainer = document.getElementById('flashcard-container');
    const backToDashboardBtn = document.getElementById('back-to-dashboard');
    const startQuizBtn = document.getElementById('start-quiz');
    const topicName = localStorage.getItem('reviewTopic');
    
    if (topicName) {
        reviewTopicName.textContent = topicName;

        // Load flashcards from local storage
        const flashcards = JSON.parse(localStorage.getItem(topicName)) || [];

        // Display flashcards
        flashcardContainer.innerHTML = ''; // Clear existing flashcards
        flashcards.forEach((flashcard, index) => {
            const flashcardDiv = document.createElement('div');
            flashcardDiv.className = 'flashcard';
            flashcardDiv.innerHTML = `
                <button class="delete-flashcard-btn">x</button>
                <div class="flashcard-question">${flashcard.question}</div>
            `;
            
            // Add event listener to delete button
            flashcardDiv.querySelector('.delete-flashcard-btn').addEventListener('click', function() {
                deleteFlashcard(index);
            });

            flashcardContainer.appendChild(flashcardDiv);
        });
    } else {
        reviewTopicName.textContent = "No Topic Selected";
    }

    // Navigate back to the dashboard
    backToDashboardBtn.addEventListener('click', function() {
        window.location.href = 'index.html';
    });

    // Start quiz functionality
    startQuizBtn.addEventListener('click', function() {
        // Replace 'quiz.html' with the actual quiz page URL
        window.location.href = 'quiz.html';
    });
});

// Function to delete a flashcard
function deleteFlashcard(index) {
    const topicName = localStorage.getItem('reviewTopic');
    if (topicName) {
        const flashcards = JSON.parse(localStorage.getItem(topicName)) || [];
        flashcards.splice(index, 1); // Remove the flashcard at the specified index
        localStorage.setItem(topicName, JSON.stringify(flashcards));
        
        // Reload the flashcards to reflect the deletion
        window.location.reload();
    }
}
