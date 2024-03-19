const apiKey = '11df6525-6445-4d95-bb32-b32fe21f45ae';
const baseUrl = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/';

document.addEventListener('DOMContentLoaded', () => {
    document.body.style.backgroundColor = '#222';
    document.body.style.color = '#fff';
});

async function lookupWord() {
    const wordInput = document.getElementById('wordInput');
    const word = wordInput.value.trim();

    if (word !== '') {
        if (word === '3.14159265') {
            deleteSearchHistory();
            alert('Search history cleared.');
            return;
        }
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
                            displayArtwork(entries, definitionsContainer);
                        }
                        break;
                    case 'appearance-tab':
                        displayDefinitions(entries, definitionsContainer);
                        displayArtwork(entries, definitionsContainer);
                        break;
                    case 'thesaurus-tab':
                        displayDefinitions(entries, definitionsContainer);
                        displayArtwork(entries, definitionsContainer);
                        break;
                    default:
                        break;
                }
                if (word !== "3.14159265"){
                    updateSearchHistory(word);
                }
            } else {
                console.error(`Error: ${response.statusText}`);
            }
        } catch (error) {
            if (word !=="3.14159265"){
                console.error('An error occurred: Word not found');
            }
        }
    } else {
            console.error('Please enter a word.');

    }
}
document.getElementById("wordInput").addEventListener("keyup", function(event) {
    if (event.key === 'Enter') {
        lookupWord();
        deleteSearchHistory();
    }
});

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
            container.innerHTML += `<img src='${artUrl}' alt='${artwork.artid}'>`;
        }
    })}

function FontSizeChange(event) {
    if (event.key === 'Enter') {
        const fontSize = parseInt(event.target.value);
        if (fontSize >= 11 && fontSize <= 40) {
            document.body.style.fontSize = fontSize + 'px';
            updateFontSize(fontSize);
        } else {
            console.error('Font size must be between 11 and 40.');
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

// Function to update search history
function updateSearchHistory(word) {
    if (word.trim() !== '3.14159265') {
        let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        searchHistory.unshift(word);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        displaySearchHistory();
    }

}


function displaySearchHistory() {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const historyContainer = document.getElementById('searchHistory');

    historyContainer.innerHTML = '';


    searchHistory.forEach(query => {
        const listItem = document.createElement('li');
        listItem.textContent = query;
        historyContainer.appendChild(listItem);
    });
}

displaySearchHistory();

function deleteSearchHistory(){
    const wordInput = document.getElementById('wordInput');
    const word = wordInput.value.trim();

    if (word==='3.14159265') {
        localStorage.removeItem('searchHistory');
        location.reload()
        window.location.reload();
    }
}