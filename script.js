async function fetchContributors() {
    try {
        // Fetch the list of contributors from the GitHub API
        const repoUrl = 'https://api.github.com/repos/Jobin-S/contributors-showcase/contents/data';
        const response = await fetch(repoUrl);
        const files = await response.json();
        
        // Filter for JSON files and fetch each contributor's data
        const jsonFiles = files.filter(file => file.name.endsWith('.json'));
        const contributorsData = await Promise.all(
            jsonFiles.map(async file => {
                try {
                    const response = await fetch(file.download_url);
                    return response.json();
                } catch (error) {
                    console.error(`Error loading ${file.name}:`, error);
                    return null;
                }
            })
        );

        // Filter out any failed loads and display the contributors
        displayContributors(contributorsData.filter(data => data !== null));
    } catch (error) {
        console.error('Error fetching contributors:', error);
        document.getElementById('contributorsContainer').innerHTML = 
            '<p>Error loading contributors data. Please try again later.</p>';
    }
}

function displayContributors(contributors) {
    const container = document.getElementById('contributorsContainer');
    
    contributors.forEach(contributor => {
        const card = createContributorCard(contributor);
        container.appendChild(card);
    });
}

function createContributorCard(contributor) {
    const card = document.createElement('div');
    card.className = 'contributor-card';
    
    // Generate GitHub avatar URL from username
    const avatarUrl = `https://github.com/${contributor.github}.png`;
    
    card.innerHTML = `
        <div class="contributor-info">
            <img src="${avatarUrl}" alt="${contributor.name}" 
                 onerror="this.src='https://github.com/identicons/${contributor.github}'">
            <h2>${contributor.name}</h2>
            <p><b>${contributor.role || 'Contributor'}</b></p>
            <p>${contributor.description || ''}</p>
            <div class="social-links">
                ${contributor.github ? `<a href="https://github.com/${contributor.github}" target="_blank">GitHub</a>` : ''}
                ${contributor.twitter ? `<a href="https://twitter.com/${contributor.twitter}" target="_blank">Twitter</a>` : ''}
            </div>
        </div>
    `;
    
    return card;
}

// Load contributors when the page loads
document.addEventListener('DOMContentLoaded', fetchContributors); 