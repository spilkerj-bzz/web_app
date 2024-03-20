const apiKey = '11df6525-6445-4d95-bb32-b32fe21f45ae';
const baseUrl = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/';

// Dark-mode on content loaded
document.addEventListener('DOMContentLoaded', () => {
    // Set background color and text color for the body
    document.body.style.backgroundColor = '#222';
    document.body.style.color = '#fff';
});

// Function for word lookup
async function lookupWord() {
    // Get & trim word input
    const wordInput = document.getElementById('wordInput');
    const word = wordInput.value.trim();

    // Check empty
    if (word !== '') {
        // Clear search history*
        if (word === '3.14159265') {
            deleteSearchHistory();
            alert('Search history cleared.');
            return;
        }
        try {
            // Construct API URL
            const apiUrl = `${baseUrl}${word}?key=${apiKey}`;
            const response = await fetch(apiUrl);

            // Check response
            if (response.ok) {
                const entries = await response.json();
                // Get the active tab ID
                const activeTabId = $('.nav-tabs .active').attr('id');
                const definitionsContainer = document.getElementById('definitions');
                definitionsContainer.innerHTML = '';

                // Display content
                switch (activeTabId) {
                    case 'general-tab':
                        const showDefinitions = document.getElementById('showDefinitionsCheckbox').checked;
                        const showArtwork = document.getElementById('showArtworkCheckbox').checked;
                        if (showDefinitions) {
                            displayDefinitions(entries, definitionsContainer);
                        }
                        if (showArtwork) {
                            displayArtwork(entries, definitionsContainer);
                        }
                        break;
                    case 'appearance-tab':
                    case 'thesaurus-tab':
                        displayDefinitions(entries, definitionsContainer);
                        displayArtwork(entries, definitionsContainer);
                        break;
                    default:
                        break;
                }
                if (word !== "3.14159265") {
                    updateSearchHistory(word);
                }
            } else {
                console.error(`Error: ${response.statusText}`);
            }
        } catch (error) {
            // Log error
            if (word !== "3.14159265") {
                console.error('An error occurred: Word not found');
            }
        }
    } else {
        console.error('Please enter a word.');
    }
}

// Event listener for Enter key press
document.getElementById("wordInput").addEventListener("keyup", function (event) {
    if (event.key === 'Enter') {
        lookupWord().then(() => {}).catch((error) => {
            console.error(`Something ain't right: `, error);
        });
        deleteSearchHistory();
    }
});

// Function to display definitions
function displayDefinitions(entries, container) {
    container.innerHTML += '<h2>Definitions:</h2>';
    entries.forEach((entry, index) => {
        if (entry.shortdef) {
            container.innerHTML += `<p>${index + 1}. ${entry.shortdef.join(', ')}</p>`;
        }
    });
}

// Function to display artwork
function displayArtwork(entries, container) {
    container.innerHTML += '<h2>Artwork:</h2>';
    entries.forEach((entry) => {
        if (entry.hasOwnProperty('art')) {
            const artwork = entry.art;
            if (artwork.hasOwnProperty('artid')) {
                const artUrl = `https://www.merriam-webster.com/assets/mw/static/art/dict/${artwork.artid}.gif`;
                const imgElement = document.createElement('img');
                imgElement.src = artUrl;
                imgElement.alt = artwork.artid;
                container.appendChild(imgElement);
            }
        }
    });
}


// Function to handle dark mode change
function DarkModeChange(event) {
    const darkModeEnabled = event.target.checked;
    if (darkModeEnabled) {
        document.body.style.backgroundColor = '#222';
        document.body.style.color = '#fff';
    } else {
        document.body.style.backgroundColor = '#f9ffff';
        document.body.style.color = '#000';
    }
}

// Event listener for dark mode toggle
document.getElementById('DarkMode').addEventListener('change', DarkModeChange);

// Function to update search history
function updateSearchHistory(word) {
    if (word.trim() !== '3.14159265') {
        let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        searchHistory.unshift(word);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        displaySearchHistory();
    }
}

// Function to display search history
function displaySearchHistory() {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const historyContainer = document.getElementById('searchHistory');
    historyContainer.innerHTML = '';

    searchHistory.forEach(query => {
        const listItem = document.createElement('li');
        listItem.textContent = query;
        listItem.addEventListener('click', searchHistoryLookup);
        historyContainer.appendChild(listItem);
    });
}

displaySearchHistory();

// Function to delete search history
function deleteSearchHistory() {
    const wordInput = document.getElementById('wordInput');
    const word = wordInput.value.trim();

    if (word === '3.14159265') {
        localStorage.removeItem('searchHistory');
        location.reload();
        window.location.reload();
    }
}

// Function for search history lookup
function searchHistoryLookup(event) {
    if (event.target.tagName === 'LI') {
        document.getElementById('wordInput').value = event.target.textContent;
        lookupWord().then(() => {}).catch((error) => {
            console.error(`Something ain't right: `, error);
        });
    }
}
