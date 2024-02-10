// Replace 'YOUR_API_KEY' with your actual Merriam-Webster API key
const apiKey = '11df6525-6445-4d95-bb32-b32fe21f45ae';
const baseUrl = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/';

// Function to fetch word definitions, artwork, and display them based on the active tab
async function lookupWord() {
    // Get the input value
    const wordInput = document.getElementById('wordInput');
    const word = wordInput.value.trim();

    // Check if the input is not empty
    if (word !== '') {
        try {
            // Construct the API URL
            const apiUrl = `${baseUrl}${word}?key=${apiKey}`;

            // Make the API request
            const response = await fetch(apiUrl);

            // Check if the request was successful (status code 200)
            if (response.ok) {
                // Parse the JSON response
                const entries = await response.json();

                // Display the definitions and artwork based on the active tab
                const activeTabId = $('.nav-tabs .active').attr('id');
                const definitionsContainer = document.getElementById('definitions');
                definitionsContainer.innerHTML = '';

                switch (activeTabId) {
                    case 'general-tab':
                        // Display general definitions or content
                        displayDefinitions(entries, definitionsContainer);
                        break;
                    case 'appearance-tab':
                        // Display appearance definitions or content
                        displayDefinitions(entries, definitionsContainer);
                        displayArtwork(entries, definitionsContainer);
                        break;
                    case 'Thesaurus-tab':
                        // Display thesaurus definitions or content
                        displayDefinitions(entries, definitionsContainer);
                        displayArtwork(entries, definitionsContainer);
                        break;
                    default:
                        // Handle other tabs if needed
                        break;
                }

            } else {
                // Handle the error if the request was not successful
                alert(`Error: ${response.statusText}`);
            }
        } catch (error) {
            // Handle any unexpected errors
            alert('An error occurred:', error);
        }
    } else {
        alert('Please enter a word.');
    }
}

// Helper function to display definitions
function displayDefinitions(entries, container) {
    container.innerHTML += '<h2>Definitions:</h2>';
    entries.forEach((entry, index) => {
        container.innerHTML += `<p>${index + 1}. ${entry.shortdef.join(', ')}</p>`;
    });
}

// Helper function to display artwork
function displayArtwork(entries, container) {
    container.innerHTML += '<h2>Artwork:</h2>';
    entries.forEach((entry) => {
        if (entry.art) {
            const artwork = entry.art;
            const artUrl = `https://www.merriam-webster.com/assets/mw/static/art/dict/${artwork.artid}.gif`;
            const caption = artwork.capt;

            container.innerHTML += `<img src="${artUrl}" alt="${artwork.artid}">
                                     <p>Illustration of ${word}: ${caption}</p>`;
        }
    });
}

// Add event listener to trigger lookup on Enter key press
document.getElementById('wordInput').addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        lookupWord();
    }
});
