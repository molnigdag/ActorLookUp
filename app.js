// Actor Lookup App with TMDB Integration
class ActorLookup {
    constructor() {
        this.apiKey = 'babe4b59612088a3d16e17093bd27ec4';
        this.baseUrl = 'https://api.themoviedb.org/3';
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

    async performSearch() {
        const query = this.searchInput.value.trim();

        if (!query) {
            this.showMessage('Please enter a search term');
            return;
        }

        this.showLoading();

        try {
            let results = [];

            switch (this.searchType) {
                case 'film':
                    results = await this.searchByFilm(query);
                    break;
                case 'character':
                    results = await this.searchByCharacter(query);
                    break;
                case 'actor':
                    results = await this.searchByActorName(query);
                    break;
            }

            this.displayResults(results, query);
        } catch (error) {
            console.error('Search error:', error);
            this.showMessage('An error occurred while searching. Please try again.');
        }
    }

    async searchByFilm(query) {
        // Search for movies
        const movieResponse = await fetch(
            `${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(query)}`
        );
        const movieData = await movieResponse.json();

        if (!movieData.results || movieData.results.length === 0) {
            return [];
        }

        // Get cast for the top movies (limit to 5 to avoid too many requests)
        const movies = movieData.results.slice(0, 5);
        const actorMap = new Map();

        for (const movie of movies) {
            const creditsResponse = await fetch(
                `${this.baseUrl}/movie/${movie.id}/credits?api_key=${this.apiKey}`
            );
            const creditsData = await creditsResponse.json();

            if (creditsData.cast) {
                // Get top 10 cast members per movie
                for (const castMember of creditsData.cast.slice(0, 10)) {
                    if (!actorMap.has(castMember.id)) {
                        // Fetch actor details for birthday and deathday
                        const actorDetails = await this.getActorDetails(castMember.id);
                        actorMap.set(castMember.id, {
                            id: castMember.id,
                            name: castMember.name,
                            birthday: actorDetails.birthday,
                            deathday: actorDetails.deathday,
                            profilePath: castMember.profile_path,
                            matchedRoles: [],
                            matchType: 'film'
                        });
                    }
                    actorMap.get(castMember.id).matchedRoles.push({
                        film: movie.title,
                        character: castMember.character,
                        year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A'
                    });
                }
            }
        }

        return Array.from(actorMap.values());
    }

    async searchByCharacter(query) {
        // Search for actors first, then filter by character names
        const personResponse = await fetch(
            `${this.baseUrl}/search/person?api_key=${this.apiKey}&query=${encodeURIComponent(query)}`
        );
        const personData = await personResponse.json();

        const results = [];
        const queryLower = query.toLowerCase();

        // Also search through popular actors to find character matches
        // We'll search for movies that might contain this character
        const movieResponse = await fetch(
            `${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(query)}`
        );
        const movieData = await movieResponse.json();

        const actorMap = new Map();

        // Check movie credits for character names
        if (movieData.results) {
            for (const movie of movieData.results.slice(0, 5)) {
                const creditsResponse = await fetch(
                    `${this.baseUrl}/movie/${movie.id}/credits?api_key=${this.apiKey}`
                );
                const creditsData = await creditsResponse.json();

                if (creditsData.cast) {
                    for (const castMember of creditsData.cast) {
                        if (castMember.character && castMember.character.toLowerCase().includes(queryLower)) {
                            if (!actorMap.has(castMember.id)) {
                                const actorDetails = await this.getActorDetails(castMember.id);
                                actorMap.set(castMember.id, {
                                    id: castMember.id,
                                    name: castMember.name,
                                    birthday: actorDetails.birthday,
                                    deathday: actorDetails.deathday,
                                    profilePath: castMember.profile_path,
                                    matchedRoles: [],
                                    matchType: 'character'
                                });
                            }
                            actorMap.get(castMember.id).matchedRoles.push({
                                film: movie.title,
                                character: castMember.character,
                                year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A'
                            });
                        }
                    }
                }
            }
        }

        // Also search known actors and check their filmography for character names
        if (personData.results) {
            for (const person of personData.results.slice(0, 5)) {
                const creditsResponse = await fetch(
                    `${this.baseUrl}/person/${person.id}/movie_credits?api_key=${this.apiKey}`
                );
                const creditsData = await creditsResponse.json();

                if (creditsData.cast) {
                    const matchingRoles = creditsData.cast.filter(role =>
                        role.character && role.character.toLowerCase().includes(queryLower)
                    );

                    if (matchingRoles.length > 0 && !actorMap.has(person.id)) {
                        const actorDetails = await this.getActorDetails(person.id);
                        actorMap.set(person.id, {
                            id: person.id,
                            name: person.name,
                            birthday: actorDetails.birthday,
                            deathday: actorDetails.deathday,
                            profilePath: person.profile_path,
                            matchedRoles: matchingRoles.slice(0, 10).map(role => ({
                                film: role.title,
                                character: role.character,
                                year: role.release_date ? role.release_date.split('-')[0] : 'N/A'
                            })),
                            matchType: 'character'
                        });
                    }
                }
            }
        }

        return Array.from(actorMap.values());
    }

    async searchByActorName(query) {
        const response = await fetch(
            `${this.baseUrl}/search/person?api_key=${this.apiKey}&query=${encodeURIComponent(query)}`
        );
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            return [];
        }

        const results = [];

        for (const person of data.results.slice(0, 10)) {
            // Get full actor details including birthday
            const actorDetails = await this.getActorDetails(person.id);

            // Get movie credits
            const creditsResponse = await fetch(
                `${this.baseUrl}/person/${person.id}/movie_credits?api_key=${this.apiKey}`
            );
            const creditsData = await creditsResponse.json();

            const roles = creditsData.cast
                ? creditsData.cast
                    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
                    .slice(0, 15)
                    .map(role => ({
                        film: role.title,
                        character: role.character || 'Unknown',
                        year: role.release_date ? role.release_date.split('-')[0] : 'N/A'
                    }))
                : [];

            results.push({
                id: person.id,
                name: person.name,
                birthday: actorDetails.birthday,
                deathday: actorDetails.deathday,
                profilePath: person.profile_path,
                roles: roles,
                matchedRoles: roles,
                matchType: 'actor'
            });
        }

        return results;
    }

    async getActorDetails(actorId) {
        const response = await fetch(
            `${this.baseUrl}/person/${actorId}?api_key=${this.apiKey}`
        );
        return await response.json();
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
        const isDeceased = !!actor.deathday;
        const age = actor.birthday
            ? (isDeceased ? this.calculateAgeAtDeath(actor.birthday, actor.deathday) : this.calculateAge(actor.birthday))
            : null;
        const birthdayDisplay = actor.birthday
            ? this.formatBirthday(actor.birthday)
            : 'Unknown';

        let statusDisplay = '';
        if (isDeceased) {
            const deathdayDisplay = this.formatBirthday(actor.deathday);
            statusDisplay = `<p class="actor-status deceased"><span>Status:</span> Deceased (${deathdayDisplay})${age ? ` - Died at age ${age}` : ''}</p>`;
        } else if (actor.birthday) {
            statusDisplay = `<p class="actor-status alive"><span>Status:</span> Alive (Age: ${age})</p>`;
        }

        const imageUrl = actor.profilePath
            ? `https://image.tmdb.org/t/p/w185${actor.profilePath}`
            : null;

        let rolesHTML = '';
        const rolesToShow = actor.matchType === 'actor' ? actor.roles : actor.matchedRoles;

        if (rolesToShow && rolesToShow.length > 0) {
            rolesHTML = rolesToShow.map(role =>
                `<span class="film-tag">${role.film} <span class="character">as ${role.character}</span> (${role.year})</span>`
            ).join('');
        } else {
            rolesHTML = '<span class="film-tag">No film credits found</span>';
        }

        return `
            <div class="actor-card">
                <div class="actor-header">
                    ${imageUrl ? `<img src="${imageUrl}" alt="${actor.name}" class="actor-photo">` : ''}
                    <div class="actor-info">
                        <h3 class="actor-name">${actor.name}</h3>
                        <p class="actor-birthday">
                            <span>Birthday:</span> ${birthdayDisplay}
                        </p>
                        ${statusDisplay}
                    </div>
                </div>
                <div class="filmography">
                    <h4>${actor.matchType === 'actor' ? 'Filmography' : 'Matching Roles'}</h4>
                    <div class="film-list">
                        ${rolesHTML}
                    </div>
                </div>
            </div>
        `;
    }

    formatBirthday(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    calculateAge(birthday) {
        const birthDate = new Date(birthday);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        // If birthday hasn't occurred yet this year, subtract 1
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    }

    calculateAgeAtDeath(birthday, deathday) {
        const birthDate = new Date(birthday);
        const deathDate = new Date(deathday);

        let age = deathDate.getFullYear() - birthDate.getFullYear();
        const monthDiff = deathDate.getMonth() - birthDate.getMonth();

        // If birthday hadn't occurred yet in the year of death, subtract 1
        if (monthDiff < 0 || (monthDiff === 0 && deathDate.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    }

    showLoading() {
        this.resultsContainer.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Searching TMDB...</p>
            </div>
        `;
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
