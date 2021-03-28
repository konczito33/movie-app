(function init() {
  //API URLS
  const BASE_URL = 'https://api.themoviedb.org/3/'
  const BY_POPULARITY_URL = 'discover/movie?sort_by=popularity.desc&api_key=8efd5c56d10b8332b9691c3d750ff1bb&page='
  const SEARCH_URL = 'search/movie?api_key=8efd5c56d10b8332b9691c3d750ff1bb&query='
  const IMG_URL = 'https://image.tmdb.org/t/p/w1280/'

  //DOM VARIABLES
  const container = document.querySelector('.container')
  const button = document.querySelector('.search-btn')
  const input = document.querySelector('.search')
  const form = document.querySelector('form')
  const logo = document.querySelector('.logo')
  const pageNumEl = document.querySelector('.pageNum')
  const pageNumContainer = document.querySelector('.switchPage')



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
      alert(err)
    }
  }

  //CREATE ERROR ELEMENT
  function showError() {
    errorEl = document.createElement('div')
    errorEl.classList.add('error')
    errorEl.textContent = 'We cannot found any matching movie!!!'
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
      movieHTML.innerHTML = `<img class="movie-img" src="${IMG_URL + poster_path}" alt="">
            <div class="movie-info">
            <p class="title">${title}</p>
            <span class="rating ${changeColorOfRating(vote_average)}">${vote_average}</span>
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
    if (vote >= 7) return 'green'
    if (vote >= 5) return 'orange'
    if (vote < 5) return 'red'
  }

  //PAGE SWITCHING VARIABLES
  let page = 1
  const backPageBtn = document.querySelector('.left')
  const nextPageBtn = document.querySelector('.right')

  function checkButton() {
    if (page === 1) return backPageBtn.disabled = true
    if (page > 1) return backPageBtn.disabled = false
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
  backPageBtn.addEventListener('click', () => {
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