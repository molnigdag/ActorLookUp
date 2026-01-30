// Actor Lookup App
class ActorLookup {
    constructor() {
        this.searchType = 'film';
        this.searchInput = document.getElementById('search-input');
        this.searchBtn = document.getElementById('search-btn');
        this.resultsContainer = document.getElementById('results-container');
        this.tabButtons = document.querySelectorAll('.tab-btn');

        this.init();
    }

    init() {
        // Tab button event listeners
        this.tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleTabChange(e));
        });

        // Search button event listener
        this.searchBtn.addEventListener('click', () => this.performSearch());

        // Enter key event listener
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });
    }

    handleTabChange(e) {
        // Remove active class from all tabs
        this.tabButtons.forEach(btn => btn.classList.remove('active'));

        // Add active class to clicked tab
        e.target.classList.add('active');

        // Update search type
        this.searchType = e.target.dataset.searchType;

        // Update placeholder text
        this.updatePlaceholder();

        // Clear and focus input
        this.searchInput.value = '';
        this.searchInput.focus();
    }

    updatePlaceholder() {
        const placeholders = {
            'film': 'Enter film name...',
            'character': 'Enter character name...',
            'actor': 'Enter actor name...'
        };
        this.searchInput.placeholder = placeholders[this.searchType];
    }

    performSearch() {
        const query = this.searchInput.value.trim().toLowerCase();

        if (!query) {
            this.showMessage('Please enter a search term');
            return;
        }

        let results = [];

        switch (this.searchType) {
            case 'film':
                results = this.searchByFilm(query);
                break;
            case 'character':
                results = this.searchByCharacter(query);
                break;
            case 'actor':
                results = this.searchByActorName(query);
                break;
        }

        this.displayResults(results, query);
    }

    searchByFilm(query) {
        const results = [];

        actorsDatabase.forEach(actor => {
            const matchingRoles = actor.roles.filter(role =>
                role.film.toLowerCase().includes(query)
            );

            if (matchingRoles.length > 0) {
                results.push({
                    ...actor,
                    matchedRoles: matchingRoles,
                    matchType: 'film'
                });
            }
        });

        return results;
    }

    searchByCharacter(query) {
        const results = [];

        actorsDatabase.forEach(actor => {
            const matchingRoles = actor.roles.filter(role =>
                role.character.toLowerCase().includes(query)
            );

            if (matchingRoles.length > 0) {
                results.push({
                    ...actor,
                    matchedRoles: matchingRoles,
                    matchType: 'character'
                });
            }
        });

        return results;
    }

    searchByActorName(query) {
        const results = [];

        actorsDatabase.forEach(actor => {
            if (actor.name.toLowerCase().includes(query)) {
                results.push({
                    ...actor,
                    matchedRoles: actor.roles,
                    matchType: 'actor'
                });
            }
        });

        return results;
    }

    displayResults(results, query) {
        if (results.length === 0) {
            this.resultsContainer.innerHTML = `
                <div class="no-results">
                    <h3>No results found</h3>
                    <p>No actors found matching "${query}"</p>
                    <p>Try a different search term or category</p>
                </div>
            `;
            return;
        }

        const resultsHTML = results.map(actor => this.createActorCard(actor)).join('');
        this.resultsContainer.innerHTML = resultsHTML;
    }

    createActorCard(actor) {
        const age = this.calculateAge(actor.birthYear);

        let rolesHTML = '';
        if (actor.matchType === 'actor') {
            // Show all roles when searching by actor name
            rolesHTML = actor.roles.map(role =>
                `<span class="film-tag">${role.film} <span class="character">as ${role.character}</span> (${role.year})</span>`
            ).join('');
        } else {
            // Show matched roles with highlight for film/character search
            rolesHTML = actor.matchedRoles.map(role =>
                `<span class="film-tag">${role.film} <span class="character">as ${role.character}</span> (${role.year})</span>`
            ).join('');
        }

        return `
            <div class="actor-card">
                <h3 class="actor-name">${actor.name}</h3>
                <p class="actor-birthday">
                    <span>Birthday:</span> ${actor.birthday} (Age: ${age})
                </p>
                <div class="filmography">
                    <h4>${actor.matchType === 'actor' ? 'Filmography' : 'Matching Roles'}</h4>
                    <div class="film-list">
                        ${rolesHTML}
                    </div>
                </div>
            </div>
        `;
    }

    calculateAge(birthYear) {
        const currentYear = new Date().getFullYear();
        return currentYear - birthYear;
    }

    showMessage(message) {
        this.resultsContainer.innerHTML = `
            <p class="placeholder-text">${message}</p>
        `;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ActorLookup();
});
