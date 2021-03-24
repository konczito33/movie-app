const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=8efd5c56d10b8332b9691c3d750ff1bb'

const IMG_URL = 'https://image.tmdb.org/t/p/w1280/'

const SEARCH_URL = `https://api.themoviedb.org/3/search/movie?api_key=8efd5c56d10b8332b9691c3d750ff1bb&query=`

const titleHTML = document.querySelector('.title')

const container = document.querySelector('.container')

const button = document.querySelector('.search-btn')

const input = document.querySelector('.search')

const form = document.querySelector('form')

const logo = document.querySelector('.logo')

getMovie(API_URL)




input.addEventListener('input', buttonOpacity)

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const inputValue = input.value
    input.value = ''
    getMovie(SEARCH_URL + inputValue)
    if (inputValue && inputValue !== '') {
        getMovie(SEARCH_URL + inputValue)
    } else {
        window.location.reload()
    }

})



function buttonOpacity() {
    if (input.value.length < 10) button.style.opacity = '1'
    if (input.value.length >= 10) button.style.opacity = '0'
}



async function getMovie(url) {
    const res = await fetch(url)
    const data = await res.json()
    showMovie(data.results)
}

function showMovie(movies) {
    container.innerHTML = ''
    movies.forEach(movie => {
        const {
            poster_path,
            title,
            overview,
            release_date,
            vote_average
        } = movie
        const movieHTML = document.createElement('div')
        movieHTML.classList.add('movie')
        movieHTML.innerHTML = `<img class="movie-img" src="${IMG_URL + poster_path}" alt="">
            <div class="movie-info">
                <p class="title">${title}</p>
                <span class="rating ${checkVote(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
            <h3>Overview</h3>
            <p>
            ${overview}
            </p>
            <span class="date">${release_date}</span>
            </div>`

        container.appendChild(movieHTML)
    })
}

function checkVote(vote) {
    if (vote >= 7) return 'green'
    if (vote >= 5) return 'orange'
    if (vote < 5) return 'red'
}

logo.addEventListener('click', () => {
    window.location.reload()
})