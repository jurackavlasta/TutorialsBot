let tutorials = [];
let currentIndex = 0;
const tutorialsPerPage = 100;

// Funkce pro načítání souboru tutorials.txt
async function loadTutorials() {
    try {
        // const response = await fetch('tutorials.txt');
        const response = await fetch('https://www.tutorial-expert.com/tutorials.txt');
        if (!response.ok) throw new Error('Failed to fetch tutorials file');

        const data = await response.text();
        tutorials = data.split('\n').map(line => {
            try {
                return JSON.parse(line);
            } catch (e) {
                return null;
            }
        }).filter(tutorial => tutorial !== null);

        displayTutorials();
    } catch (error) {
        console.error('Error loading tutorials:', error);
    }
}

// Funkce pro zobrazení aktuální dávky tutoriálů
function displayTutorials() {
    const tutorialList = document.getElementById('tutorial-list');

    const currentBatch = tutorials.slice(currentIndex, currentIndex + tutorialsPerPage);
    currentBatch.forEach(tutorial => {
        const item = document.createElement('span');
        item.classList.add('tutorial-item');
        item.innerHTML = `<a href="/${tutorial.file}">${tutorial.title}</a>`;
        tutorialList.appendChild(item);
    });

    currentIndex += tutorialsPerPage;

    // Hide load more button if no more tutorials
    if (currentIndex >= tutorials.length) {
        document.getElementById('load-more-btn').style.display = 'none';
    }
}

// Initial load of tutorials
window.onload = loadTutorials;

// Load more tutorials on button click
document.getElementById('load-more-btn').onclick = function () {
    displayTutorials();
};