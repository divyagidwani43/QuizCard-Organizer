document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modal');
    const flashcardModal = document.getElementById('flashcard-modal');
    const addTopicBtn = document.getElementById('add-topic-btn');
    const closeBtn = document.querySelector('.close-btn');
    const closeFlashcardModalBtn = document.getElementById('close-flashcard-modal');
    const addTopicConfirmBtn = document.getElementById('add-topic-confirm-btn');
    const addFlashcardConfirmBtn = document.getElementById('add-flashcard-confirm-btn');
    const topicNameInput = document.getElementById('topic-name');
    const flashcardQuestionInput = document.getElementById('flashcard-question');
    const flashcardAnswerInput = document.getElementById('flashcard-answer');
    const topicList = document.getElementById('topic-list');

    // Load topics from local storage and display them
    const topicListFromStorage = JSON.parse(localStorage.getItem('topics')) || [];
    topicListFromStorage.forEach(topic => addTopicToDOM(topic));

    // Open the Add Topic modal
    addTopicBtn.addEventListener('click', function() {
        modal.style.display = 'flex';
        topicNameInput.focus();
    });

    // Close the Add Topic modal
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Close the Add Topic modal when clicking outside of the modal
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
        if (event.target === flashcardModal) {
            flashcardModal.style.display = 'none';
        }
    });

    // Add topic when OK button is clicked
    addTopicConfirmBtn.addEventListener('click', function() {
        const topicName = topicNameInput.value.trim();
        if (topicName) {
            // Save the topic to local storage
            const topicListFromStorage = JSON.parse(localStorage.getItem('topics')) || [];
            topicListFromStorage.push(topicName);
            localStorage.setItem('topics', JSON.stringify(topicListFromStorage));

            // Update the topic list in the DOM
            addTopicToDOM(topicName);

            topicNameInput.value = '';
            modal.style.display = 'none';
        }
    });

    // Trigger OK button click on Enter key press
    topicNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTopicConfirmBtn.click();
        }
    });

    // Open the Add Flashcard modal
    topicList.addEventListener('click', function(event) {
        if (event.target.classList.contains('add-fc-btn')) {
            flashcardModal.style.display = 'flex';
        } else if (event.target.classList.contains('review-fc-btn')) {
            const topicText = event.target.closest('li').textContent.trim();
            const topicName = topicText.split('\n')[0].trim();
            
            localStorage.setItem('reviewTopic', topicName);
            window.location.href = 'review.html';
        }
    });

    // Close the Add Flashcard modal
    closeFlashcardModalBtn.addEventListener('click', function() {
        flashcardModal.style.display = 'none';
    });

    // Add flashcard when Add Flashcard button is clicked
    addFlashcardConfirmBtn.addEventListener('click', function() {
        const question = flashcardQuestionInput.value.trim();
        const answer = flashcardAnswerInput.value.trim();
        const topicName = localStorage.getItem('reviewTopic');
        
        if (question && answer && topicName) {
            // Load flashcards from local storage for the selected topic
            const flashcards = JSON.parse(localStorage.getItem(topicName)) || [];
            
            // Add the new flashcard
            flashcards.push({ question, answer });
            
            // Save the updated flashcards to local storage
            localStorage.setItem(topicName, JSON.stringify(flashcards));

            flashcardQuestionInput.value = '';
            flashcardAnswerInput.value = '';
            flashcardModal.style.display = 'none';
        }
    });

    // Adjust opacity of topics on hover
    topicList.addEventListener('mouseover', function(event) {
        if (event.target.tagName === 'LI') {
            const hoveredTopic = event.target;
            const topics = topicList.querySelectorAll('li');
            topics.forEach(topic => {
                if (topic !== hoveredTopic) {
                    topic.style.opacity = '0.5';
                }
            });
            hoveredTopic.style.opacity = '1';
        } else if (event.target.closest('.topic-buttons')) {
            const hoveredTopic = event.target.closest('li');
            const topics = topicList.querySelectorAll('li');
            topics.forEach(topic => {
                if (topic !== hoveredTopic) {
                    topic.style.opacity = '0.5';
                }
            });
        }
    });

    topicList.addEventListener('mouseout', function(event) {
        if (event.target.tagName === 'LI' || event.target.closest('.topic-buttons')) {
            const topics = topicList.querySelectorAll('li');
            topics.forEach(topic => {
                topic.style.opacity = '1';
            });
        }
    });
});

// Function to add a topic to the DOM
function addTopicToDOM(topicName) {
    const topicList = document.getElementById('topic-list');
    const li = document.createElement('li');
    li.textContent = topicName;
    
    // Create the delete button
    const deleteBtn = document.createElement('span');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '<i class="fa">&#xf014;</i>'; // Font Awesome trash bin icon
    deleteBtn.addEventListener('click', function() {
        removeTopicFromDOM(topicName);
    });

    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'topic-buttons';
    buttonsDiv.innerHTML = `
        <button class="btn-secondary add-fc-btn">Add FC</button>
        <button class="btn-secondary review-fc-btn">Review FC</button>
    `;

    li.appendChild(deleteBtn);
    li.appendChild(buttonsDiv);
    topicList.appendChild(li);
}

// Function to remove a topic from the DOM and local storage
function removeTopicFromDOM(topicName) {
    const topicList = document.getElementById('topic-list');
    const items = topicList.querySelectorAll('li');

    items.forEach(item => {
        if (item.textContent.includes(topicName)) {
            topicList.removeChild(item);
            // Remove the topic from local storage
            let topicListFromStorage = JSON.parse(localStorage.getItem('topics')) || [];
            topicListFromStorage = topicListFromStorage.filter(topic => topic !== topicName);
            localStorage.setItem('topics', JSON.stringify(topicListFromStorage));
            
            // Remove flashcards related to the topic
            localStorage.removeItem(topicName);
        }
    });
}
