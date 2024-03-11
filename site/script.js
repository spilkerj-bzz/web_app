const apiKey = '11df6525-6445-4d95-bb32-b32fe21f45ae';
const baseUrl = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/';
document. addEventListener('DOMContentLoaded', () => {
    document.body.style.backgroundColor = '#222';
    document.body.style.color = '#fff';
})


async function lookupWord() {
    const wordInput = document.getElementById('wordInput');
    const word = wordInput.value.trim();

    if (word !== '') {
        try {
            const apiUrl = `${baseUrl}${word}?key=${apiKey}`;

            const response = await fetch(apiUrl);

            if (response.ok) {
                const entries = await response.json();

                const activeTabId = $('.nav-tabs .active').attr('id');
                const definitionsContainer = document.getElementById('definitions');
                definitionsContainer.innerHTML = '';

                switch (activeTabId) {
                    case 'general-tab':
                        const showDefinitions = document.getElementById('showDefinitionsCheckbox').checked;
                        const showArtwork = document.getElementById('showArtworkCheckbox').checked;
                        if (showDefinitions) {
                            displayDefinitions(entries, definitionsContainer);
                        }
                        if (showArtwork) {
                            displayArtwork(entries, definitionsContainer, word);
                        }
                        break;
                    case 'appearance-tab':
                        displayDefinitions(entries, definitionsContainer);
                        displayArtwork(entries, definitionsContainer, word);
                        break;
                    case 'thesaurus-tab':
                        displayDefinitions(entries, definitionsContainer);
                        displayArtwork(entries, definitionsContainer, word);
                        break;
                    default:
                        break;
                }
                updateSearchHistory(word);

            } else {
                alert(`Error: ${response.statusText}`);
            }
        } catch (error) {
            alert('An error occurred: Word not found');
        }
    } else {
        alert('Please enter a word.');
    }
}
function displayDefinitions(entries, container) {
    container.innerHTML += '<h2>Definitions:</h2>';
    entries.forEach((entry, index) => {
        container.innerHTML += `<p>${index + 1}. ${entry.shortdef.join(', ')}</p>`;
    });
}
function displayArtwork(entries, container) {
    container.innerHTML += '<h2>Artwork:</h2>';
    entries.forEach((entry) => {
        if (entry.art) {
            const artwork = entry.art;
            const artUrl = `https://www.merriam-webster.com/assets/mw/static/art/dict/${artwork.artid}.gif`;

            container.innerHTML += `<img src="${artUrl}" alt="${artwork.artid}">`;
        }
    });
}

function FontSizeChange(event) {
    if (event.key === 'Enter') {
        const fontSize = parseInt(event.target.value);
        if (fontSize >= 11 && fontSize <= 40) {
            document.body.style.fontSize = fontSize + 'px';
            updateFontSize(fontSize);
        } else {
            alert('Font size must be between 11 and 40.');
        }
    }
}
document.getElementById('size-input').addEventListener('keyup', FontSizeChange);

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

document.getElementById('DarkMode').addEventListener('change', DarkModeChange);

// Function to save search query to local storage
function saveToSearchHistory(query) {
    let history = localStorage.getItem('searchHistory');
    if (!history) {
        history = [];
    } else {
        history = JSON.parse(history);
    }
    history.push(query);
    localStorage.setItem('searchHistory', JSON.stringify(history));
}



// Function to update search history
function updateSearchHistory(word) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistory.unshift(word); // Add the new search query to the beginning of the array
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    displaySearchHistory(); // Update the displayed search history
}

// Function to display search history
function displaySearchHistory() {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const historyContainer = document.getElementById('searchHistory');

    // Clear existing history
    historyContainer.innerHTML = '';

    // Render search history
    searchHistory.forEach(query => {
        const listItem = document.createElement('li');
        listItem.textContent = query;
        historyContainer.appendChild(listItem);
    });
}

// Call displaySearchHistory on page load to populate the search history
displaySearchHistory();


