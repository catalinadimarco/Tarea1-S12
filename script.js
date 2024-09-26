let moviesData = [];

// Cargar datos de la API
fetch('https://japceibal.github.io/japflix_api/movies-data.json')
    .then(response => response.json())
    .then(data => {
        moviesData = data;
    })
    .catch(error => console.error('Error fetching data:', error));
    //funcion para buscar las peliculas
document.getElementById('btnBuscar').addEventListener('click', searchMovies);

function searchMovies() {
    const searchInput = document.getElementById('inputBuscar').value.toLowerCase();
    const results = moviesData.filter(movie => {
        const titleMatch = movie.title.toLowerCase().includes(searchInput);
        const genreMatch = movie.genres.some(genre => 
            typeof genre === 'string' && genre.toLowerCase().includes(searchInput)
        );
        const taglineMatch = movie.tagline.toLowerCase().includes(searchInput);
        const overviewMatch = movie.overview.toLowerCase().includes(searchInput);

        return titleMatch || genreMatch || taglineMatch || overviewMatch;
    });

    displayResults(results);
}

function displayResults(results) {
    const resultsContainer = document.getElementById('lista');
    resultsContainer.innerHTML = ''; // Limpiar resultados previos

    results.forEach(movie => {
        const movieElement = document.createElement('li');
        movieElement.className = 'list-group-item d-flex justify-content-between align-items-start';
        movieElement.innerHTML = `
            <div>
                <h5>${movie.title}</h5>
                <p>${movie.tagline}</p>
                <div>${renderStars(movie.vote_average)}</div>
                <button class="btn btn-secondary" onclick="showMovieDetails(${movie.id})">Ver Detalles</button>
            </div>
        `;
        resultsContainer.appendChild(movieElement);
    });
}

function renderStars(voteAverage) {
    const stars = Math.round(voteAverage / 2); // Convertir de 10 a 5 estrellas
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        starsHtml += `<span class="fa fa-star${i <= stars ? '' : '-o'}"></span>`;
    }
    return starsHtml;
}

// Mostrar los detalles de la película
function showMovieDetails(movieId) {
    const movie = moviesData.find(m => m.id === movieId);
    const detailsContainer = document.createElement('div');
    detailsContainer.className = 'offcanvas offcanvas-top show';
    detailsContainer.innerHTML = `
        <div class="offcanvas-header">
            <h5>${movie.title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
            <p>${movie.overview}</p>
            <p>Géneros: ${movie.genres.join(', ')}</p>
            <button class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Más Info</button>
            <ul class="dropdown-menu">
                <li>Año: ${new Date(movie.release_date).getFullYear()}</li>
                <li>Duración: ${movie.runtime} min</li>
                <li>Presupuesto: $${movie.budget.toLocaleString()}</li>
                <li>Ganancias: $${movie.revenue.toLocaleString()}</li>
            </ul>
        </div>
    `;
    document.body.appendChild(detailsContainer);
}