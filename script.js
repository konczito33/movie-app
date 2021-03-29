(function init() {
  //API URLS
  const BASE_URL = 'https://api.themoviedb.org/3/'
  const BY_POPULARITY_URL = 'discover/movie?sort_by=popularity.desc&api_key=8efd5c56d10b8332b9691c3d750ff1bb&page='
  const SEARCH_URL = 'search/movie?api_key=8efd5c56d10b8332b9691c3d750ff1bb&query='
  const IMG_URL = 'https://image.tmdb.org/t/p/w1280/'

  //DOM VARIABLES
  const container = document.querySelector('.movies-container')
  const button = document.querySelector('.search-form__button')
  const input = document.querySelector('.search-form__input')
  const form = document.querySelector('.search-form')
  const logo = document.querySelector('.header__logo')
  const pageNumEl = document.querySelector('.pages-nav__counter')
  const pageNumContainer = document.querySelector('.pages-nav')



  //GET DATA FROM API
  async function getMovieFromApi(url) {
    try {
      const res = await fetch(url)
      const data = await res.json()
      createMovieEl(data.results)
      if (data.results == '') {
        showError()
      }
    } catch (err) {
    }
  }

  //CREATE ERROR ELEMENT
  function showError() {
    errorEl = document.createElement('div')
    errorEl.classList.add('error')
    errorEl.textContent = "We can't find any matching movie, please try again."
    container.appendChild(errorEl)
  }

  //FUNCTION THAT CREATES HTML ELEMENT FOR EACH MOVIE
  function createMovieEl(movies) {
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
      movieHTML.innerHTML = `<img class="movie__img" src="${IMG_URL + poster_path}" alt="">
            <div class="movie__info">
            <p class="movie__title">${title}</p>
            <span class="movie__rating ${changeColorOfRating(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
            <h3 class="overview__heading">Overview</h3>
            <p class="overview__text">
            ${overview}
            </p>
            <span class="overview__date">${release_date}</span>
            </div>`

      container.appendChild(movieHTML)
    })
  }


  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const inputValue = input.value
    input.value = ''
    getMovieFromApi(BASE_URL + SEARCH_URL + inputValue)
    //IF STATEMENT THAT CHECKS IF INPUT IS FILLED, IF IT IS THEN SHOWS RESULT IF NOT IT RELOADS WINDOW
    if (inputValue && inputValue !== '') {
      getMovieFromApi(BASE_URL + SEARCH_URL + inputValue)
    } else {
      window.location.reload()
    }
    //DELATES PAGE SWITCHING BUTTONS WHEN USER IS SEARCHING MOVIE BY SEARCH
    pageNumContainer.style.display = 'none'
  })

  input.addEventListener('input', hideSearchBtn)

  //FUNCTION THAT CHECKS IF TEXT THAT USER TYPED INTO INPUT DONT COVER UP SEARCH BTN
  function hideSearchBtn() {
    if (input.value.length < 10) button.style.opacity = '1'
    if (input.value.length >= 10) button.style.opacity = '0'
  }

  //CHECKS FOR COLOR OF AVERAGE RATING
  function changeColorOfRating(vote) {
    if (vote >= 7) return 'movie__rating--green'
    if (vote >= 5) return 'movie__rating--orange'
    if (vote < 5) return 'movie__rating--red'
  }

  //PAGE SWITCHING VARIABLES
  let page = 1
  const previousPageBtn = document.querySelector('.pages-nav__previous')
  const nextPageBtn = document.querySelector('.pages-nav__next')

  function checkButton() {
    if (page === 1) return previousPageBtn.disabled = true
    if (page > 1) return previousPageBtn.disabled = false
  }

  function updatePageNumber() {
    pageNumEl.textContent = page
  }

  //BACK TO MAIN PAGE BY CLICKING AT LOGO
  logo.addEventListener('click', () => {
    getMovieFromApi(BASE_URL + BY_POPULARITY_URL)
    page = 1
    updatePageNumber()
    window.scrollTo(0, 0)
    pageNumContainer.style.display = 'flex'
  })

  //BUTTON LISTENERS
  previousPageBtn.addEventListener('click', () => {
    page--
    checkButton()
    updatePageNumber()
    getMovieFromApi(BASE_URL + BY_POPULARITY_URL + page)
    window.scrollTo(0, 0)
  })

  nextPageBtn.addEventListener('click', () => {
    page++
    checkButton()
    updatePageNumber()
    getMovieFromApi(BASE_URL + BY_POPULARITY_URL + page)
    window.scrollTo(0, 0)
  })

  getMovieFromApi(BASE_URL + BY_POPULARITY_URL)
  updatePageNumber()



}())