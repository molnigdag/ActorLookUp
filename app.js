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
            'film': 'Enter film or TV series name...',
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
        // Search for both movies and TV series in parallel
        const [movieResponse, tvResponse] = await Promise.all([
            fetch(`${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(query)}`),
            fetch(`${this.baseUrl}/search/tv?api_key=${this.apiKey}&query=${encodeURIComponent(query)}`)
        ]);

        const [movieData, tvData] = await Promise.all([
            movieResponse.json(),
            tvResponse.json()
        ]);

        const mediaResults = [];

        // Process movies (limit to 3)
        if (movieData.results && movieData.results.length > 0) {
            for (const movie of movieData.results.slice(0, 3)) {
                const creditsResponse = await fetch(
                    `${this.baseUrl}/movie/${movie.id}/credits?api_key=${this.apiKey}`
                );
                const creditsData = await creditsResponse.json();

                const cast = [];
                if (creditsData.cast) {
                    for (const castMember of creditsData.cast.slice(0, 10)) {
                        const actorDetails = await this.getActorDetails(castMember.id);
                        cast.push({
                            id: castMember.id,
                            name: castMember.name,
                            character: castMember.character,
                            birthday: actorDetails.birthday,
                            deathday: actorDetails.deathday,
                            profilePath: castMember.profile_path
                        });
                    }
                }

                mediaResults.push({
                    id: movie.id,
                    title: movie.title,
                    year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
                    posterPath: movie.poster_path,
                    mediaType: 'movie',
                    cast: cast
                });
            }
        }

        // Process TV series (limit to 3)
        if (tvData.results && tvData.results.length > 0) {
            for (const show of tvData.results.slice(0, 3)) {
                const creditsResponse = await fetch(
                    `${this.baseUrl}/tv/${show.id}/credits?api_key=${this.apiKey}`
                );
                const creditsData = await creditsResponse.json();

                const cast = [];
                if (creditsData.cast) {
                    for (const castMember of creditsData.cast.slice(0, 10)) {
                        const actorDetails = await this.getActorDetails(castMember.id);
                        cast.push({
                            id: castMember.id,
                            name: castMember.name,
                            character: castMember.character,
                            birthday: actorDetails.birthday,
                            deathday: actorDetails.deathday,
                            profilePath: castMember.profile_path
                        });
                    }
                }

                mediaResults.push({
                    id: show.id,
                    title: show.name,
                    year: show.first_air_date ? show.first_air_date.split('-')[0] : 'N/A',
                    posterPath: show.poster_path,
                    mediaType: 'tv',
                    cast: cast
                });
            }
        }

        return { type: 'film', movies: mediaResults };
    }

    async searchByCharacter(query) {
        // Search for actors, movies, and TV shows
        const [personResponse, movieResponse, tvResponse] = await Promise.all([
            fetch(`${this.baseUrl}/search/person?api_key=${this.apiKey}&query=${encodeURIComponent(query)}`),
            fetch(`${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(query)}`),
            fetch(`${this.baseUrl}/search/tv?api_key=${this.apiKey}&query=${encodeURIComponent(query)}`)
        ]);

        const [personData, movieData, tvData] = await Promise.all([
            personResponse.json(),
            movieResponse.json(),
            tvResponse.json()
        ]);

        const queryLower = query.toLowerCase();
        const actorMap = new Map();

        // Check movie credits for character names
        if (movieData.results) {
            for (const movie of movieData.results.slice(0, 3)) {
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
                                title: movie.title,
                                character: castMember.character,
                                year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
                                mediaType: 'movie'
                            });
                        }
                    }
                }
            }
        }

        // Check TV credits for character names
        if (tvData.results) {
            for (const show of tvData.results.slice(0, 3)) {
                const creditsResponse = await fetch(
                    `${this.baseUrl}/tv/${show.id}/credits?api_key=${this.apiKey}`
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
                                title: show.name,
                                character: castMember.character,
                                year: show.first_air_date ? show.first_air_date.split('-')[0] : 'N/A',
                                mediaType: 'tv'
                            });
                        }
                    }
                }
            }
        }

        // Also search known actors and check their filmography for character names
        if (personData.results) {
            for (const person of personData.results.slice(0, 5)) {
                // Get both movie and TV credits
                const [movieCredits, tvCredits] = await Promise.all([
                    fetch(`${this.baseUrl}/person/${person.id}/movie_credits?api_key=${this.apiKey}`).then(r => r.json()),
                    fetch(`${this.baseUrl}/person/${person.id}/tv_credits?api_key=${this.apiKey}`).then(r => r.json())
                ]);

                const matchingRoles = [];

                if (movieCredits.cast) {
                    const movieRoles = movieCredits.cast.filter(role =>
                        role.character && role.character.toLowerCase().includes(queryLower)
                    ).map(role => ({
                        title: role.title,
                        character: role.character,
                        year: role.release_date ? role.release_date.split('-')[0] : 'N/A',
                        mediaType: 'movie'
                    }));
                    matchingRoles.push(...movieRoles);
                }

                if (tvCredits.cast) {
                    const tvRoles = tvCredits.cast.filter(role =>
                        role.character && role.character.toLowerCase().includes(queryLower)
                    ).map(role => ({
                        title: role.name,
                        character: role.character,
                        year: role.first_air_date ? role.first_air_date.split('-')[0] : 'N/A',
                        mediaType: 'tv'
                    }));
                    matchingRoles.push(...tvRoles);
                }

                if (matchingRoles.length > 0 && !actorMap.has(person.id)) {
                    const actorDetails = await this.getActorDetails(person.id);
                    actorMap.set(person.id, {
                        id: person.id,
                        name: person.name,
                        birthday: actorDetails.birthday,
                        deathday: actorDetails.deathday,
                        profilePath: person.profile_path,
                        matchedRoles: matchingRoles.slice(0, 10),
                        matchType: 'character'
                    });
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

            // Get both movie and TV credits in parallel
            const [movieCredits, tvCredits] = await Promise.all([
                fetch(`${this.baseUrl}/person/${person.id}/movie_credits?api_key=${this.apiKey}`).then(r => r.json()),
                fetch(`${this.baseUrl}/person/${person.id}/tv_credits?api_key=${this.apiKey}`).then(r => r.json())
            ]);

            const allRoles = [];

            // Add movie roles
            if (movieCredits.cast) {
                const movieRoles = movieCredits.cast.map(role => ({
                    title: role.title,
                    character: role.character || 'Unknown',
                    year: role.release_date ? role.release_date.split('-')[0] : 'N/A',
                    mediaType: 'movie',
                    popularity: role.popularity || 0
                }));
                allRoles.push(...movieRoles);
            }

            // Add TV roles
            if (tvCredits.cast) {
                const tvRoles = tvCredits.cast.map(role => ({
                    title: role.name,
                    character: role.character || 'Unknown',
                    year: role.first_air_date ? role.first_air_date.split('-')[0] : 'N/A',
                    mediaType: 'tv',
                    popularity: role.popularity || 0
                }));
                allRoles.push(...tvRoles);
            }

            // Sort by popularity and take top 15
            const roles = allRoles
                .sort((a, b) => b.popularity - a.popularity)
                .slice(0, 15);

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
        // Handle film search results (grouped by movie)
        if (results.type === 'film') {
            if (results.movies.length === 0) {
                this.showNoResults(query);
                return;
            }
            const resultsHTML = results.movies.map(movie => this.createMovieCard(movie)).join('');
            this.resultsContainer.innerHTML = resultsHTML;
            this.attachDrillDownHandlers();
            return;
        }

        // Handle actor/character search results
        if (results.length === 0) {
            this.showNoResults(query);
            return;
        }

        const resultsHTML = results.map(actor => this.createActorCard(actor)).join('');
        this.resultsContainer.innerHTML = resultsHTML;
        this.attachDrillDownHandlers();
    }

    showNoResults(query) {
        this.resultsContainer.innerHTML = `
            <div class="no-results">
                <h3>No results found</h3>
                <p>No results found matching "${query}"</p>
                <p>Try a different search term or category</p>
            </div>
        `;
    }

    createMovieCard(movie) {
        const posterUrl = movie.posterPath
            ? `https://image.tmdb.org/t/p/w185${movie.posterPath}`
            : null;

        const mediaTypeLabel = movie.mediaType === 'tv' ? 'TV Series' : 'Movie';
        const mediaTypeClass = movie.mediaType === 'tv' ? 'media-tv' : 'media-movie';

        const castHTML = movie.cast.map(actor => {
            const isDeceased = !!actor.deathday;
            const age = actor.birthday
                ? (isDeceased ? this.calculateAgeAtDeath(actor.birthday, actor.deathday) : this.calculateAge(actor.birthday))
                : null;
            const statusClass = isDeceased ? 'deceased' : 'alive';
            const statusText = isDeceased ? 'Deceased' : (age ? `Age: ${age}` : '');

            const actorPhoto = actor.profilePath
                ? `<img src="https://image.tmdb.org/t/p/w92${actor.profilePath}" alt="${actor.name}" class="cast-photo">`
                : '<div class="cast-photo-placeholder"></div>';

            return `
                <div class="cast-member">
                    ${actorPhoto}
                    <div class="cast-info">
                        <p class="cast-name">${actor.name}</p>
                        <p class="cast-character">as ${actor.character}</p>
                        ${statusText ? `<p class="cast-status ${statusClass}">${statusText}</p>` : ''}
                    </div>
                    <div class="cast-actions">
                        <button class="drill-btn drill-character" data-character="${this.escapeHtml(actor.character)}" title="Search by character">Character</button>
                        <button class="drill-btn drill-actor" data-actor="${this.escapeHtml(actor.name)}" title="Search by actor">Actor</button>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="movie-card">
                <div class="movie-header">
                    ${posterUrl ? `<img src="${posterUrl}" alt="${movie.title}" class="movie-poster">` : ''}
                    <div class="movie-info">
                        <span class="media-type-badge ${mediaTypeClass}">${mediaTypeLabel}</span>
                        <h3 class="movie-title">${movie.title} (${movie.year})</h3>
                        <p class="movie-cast-count">${movie.cast.length} cast members</p>
                    </div>
                </div>
                <div class="movie-cast">
                    <h4>Cast</h4>
                    <div class="cast-list">
                        ${castHTML}
                    </div>
                </div>
            </div>
        `;
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    attachDrillDownHandlers() {
        // Attach handlers for character drill-down buttons
        document.querySelectorAll('.drill-character').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const character = e.target.dataset.character;
                if (character) {
                    this.switchToSearchType('character');
                    this.searchInput.value = character;
                    this.performSearch();
                }
            });
        });

        // Attach handlers for actor drill-down buttons
        document.querySelectorAll('.drill-actor').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const actor = e.target.dataset.actor;
                if (actor) {
                    this.switchToSearchType('actor');
                    this.searchInput.value = actor;
                    this.performSearch();
                }
            });
        });
    }

    switchToSearchType(type) {
        this.searchType = type;
        this.tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.searchType === type);
        });
        this.updatePlaceholder();
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
            rolesHTML = rolesToShow.map(role => {
                const title = role.title || role.film;
                const mediaIcon = role.mediaType === 'tv' ? '<span class="media-icon tv">TV</span>' : '<span class="media-icon movie">Film</span>';
                return `<span class="film-tag">${mediaIcon} ${title} <span class="character">as ${role.character}</span> (${role.year})</span>`;
            }).join('');
        } else {
            rolesHTML = '<span class="film-tag">No credits found</span>';
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
