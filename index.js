import { catsData } from './data.js'

// Original elements
const emotionRadios = document.getElementById('emotion-radios')
const getImageBtn = document.getElementById('get-image-btn')
const gifsOnlyOption = document.getElementById('gifs-only-option')
const memeModalInner = document.getElementById('meme-modal-inner')
const memeModal = document.getElementById('meme-modal')
const memeModalCloseBtn = document.getElementById('meme-modal-close-btn')

// New elements
const emotionSearch = document.getElementById('emotion-search')
const categoryFilter = document.getElementById('category-filter')
const randomMemeBtn = document.getElementById('random-meme-btn')
const favoritesBtn = document.getElementById('favorites-btn')
const favoriteMemeBtn = document.getElementById('favorite-meme-btn')
const downloadMemeBtn = document.getElementById('download-meme-btn')
const favoritesSection = document.getElementById('favorites-section')
const favoritesContainer = document.getElementById('favorites-container')
const closeFavoritesBtn = document.getElementById('close-favorites-btn')
const themeToggleBtn = document.getElementById('theme-toggle-btn')


// Stores the meme currently shown
let currentCat = null


// ==========================
// EVENT LISTENERS
// ==========================

emotionRadios.addEventListener('change', highlightCheckedOption)

memeModalCloseBtn.addEventListener('click', closeModal)

getImageBtn.addEventListener('click', renderCat)

emotionSearch.addEventListener('input', searchEmotions)

categoryFilter.addEventListener('change', filterByCategory)

randomMemeBtn.addEventListener('click', renderRandomCat)

favoriteMemeBtn.addEventListener('click', addToFavorites)

favoritesBtn.addEventListener('click', showFavorites)

closeFavoritesBtn.addEventListener('click', closeFavorites)

downloadMemeBtn.addEventListener('click', downloadMeme)

themeToggleBtn.addEventListener('click', toggleDarkMode)


// ==========================
// ORIGINAL HIGHLIGHT LOGIC
// ==========================

function highlightCheckedOption(e) {

    const radios = document.getElementsByClassName('radio')

    for (let radio of radios) {
        radio.classList.remove('highlight')
    }

    e.target.parentElement.classList.add('highlight')
}


// ==========================
// MODAL
// ==========================

function closeModal() {
    memeModal.style.display = 'none'
}


// ==========================
// GET IMAGE
// ==========================

function renderCat() {

    const catObject = getSingleCatObject()

    if (!catObject) {
        alert('Please select an emotion first 😸')
        return
    }

    currentCat = catObject

    renderMeme(catObject)
}


function renderMeme(catObject) {

    memeModalInner.innerHTML = `
        <img
            class="cat-img"
            src="./images/${catObject.image}"
            alt="${catObject.alt}"
        >
    `

    memeModal.style.display = 'flex'
}


// ==========================
// ORIGINAL RANDOM MATCH LOGIC
// ==========================

function getSingleCatObject() {

    const catsArray = getMatchingCatsArray()

    if (!catsArray || catsArray.length === 0) {
        return null
    }

    if (catsArray.length === 1) {
        return catsArray[0]
    }

    const randomNumber = Math.floor(Math.random() * catsArray.length)

    return catsArray[randomNumber]
}


// ==========================
// MATCH CAT BY EMOTION
// ==========================

function getMatchingCatsArray() {

    const checkedRadio =
        document.querySelector('input[type="radio"]:checked')

    if (!checkedRadio) {
        return []
    }

    const selectedEmotion = checkedRadio.value

    const isGif = gifsOnlyOption.checked

    const selectedCategory = categoryFilter.value

    return catsData.filter(function(cat) {

        const emotionMatches =
            cat.emotionTags.includes(selectedEmotion)

        const gifMatches =
            !isGif || cat.isGif

        const categoryMatches =
            selectedCategory === 'all' ||
            cat.category === selectedCategory

        return emotionMatches &&
               gifMatches &&
               categoryMatches
    })
}


// ==========================
// ORIGINAL EMOTION ARRAY LOGIC
// ==========================

function getEmotionsArray(cats) {

    const emotionsArray = []

    for (let cat of cats) {

        for (let emotion of cat.emotionTags) {

            if (!emotionsArray.includes(emotion)) {
                emotionsArray.push(emotion)
            }

        }

    }

    return emotionsArray
}


// ==========================
// RENDER EMOTION RADIOS
// ==========================

function renderEmotionsRadios(cats) {

    let radioItems = ``

    const emotions = getEmotionsArray(cats)

    for (let emotion of emotions) {

        radioItems += `
            <div class="radio">

                <label for="${emotion}">
                    ${emotion}
                </label>

                <input
                    type="radio"
                    id="${emotion}"
                    value="${emotion}"
                    name="emotions"
                >

            </div>
        `
    }

    emotionRadios.innerHTML = radioItems
}


// ==========================
// SEARCH FEATURE
// ==========================

function searchEmotions() {

    const searchValue =
        emotionSearch.value.toLowerCase().trim()

    const radios =
        document.getElementsByClassName('radio')

    for (let radio of radios) {

        const emotion =
            radio.querySelector('label')
                .textContent
                .toLowerCase()

        if (emotion.includes(searchValue)) {
            radio.style.display = 'flex'
        }
        else {
            radio.style.display = 'none'
        }

    }
}


// ==========================
// CATEGORY FILTER
// ==========================

function filterByCategory() {

    const selectedCategory = categoryFilter.value

    if (selectedCategory === 'all') {

        renderEmotionsRadios(catsData)

        return
    }

    const filteredCats = catsData.filter(function(cat) {

        return cat.category === selectedCategory

    })

    renderEmotionsRadios(filteredCats)
}


// ==========================
// RANDOM MEME
// ==========================

function renderRandomCat() {

    let availableCats = [...catsData]

    const selectedCategory = categoryFilter.value

    if (selectedCategory !== 'all') {

        availableCats = availableCats.filter(function(cat) {

            return cat.category === selectedCategory

        })

    }


    if (gifsOnlyOption.checked) {

        availableCats = availableCats.filter(function(cat) {

            return cat.isGif

        })

    }


    if (availableCats.length === 0) {

        alert('No memes found 😿')

        return
    }


    const randomNumber =
        Math.floor(Math.random() * availableCats.length)

    currentCat = availableCats[randomNumber]

    renderMeme(currentCat)
}


// ==========================
// FAVORITES
// ==========================

function addToFavorites() {

    if (!currentCat) {
        return
    }


    let favorites =
        JSON.parse(localStorage.getItem('favoriteCats')) || []


    const alreadySaved = favorites.some(function(cat) {

        return cat.image === currentCat.image

    })


    if (alreadySaved) {

        alert('This meme is already in your favorites 😸')

        return
    }


    favorites.push(currentCat)


    localStorage.setItem(
        'favoriteCats',
        JSON.stringify(favorites)
    )


    favoriteMemeBtn.textContent = '❤️ Saved!'
}


// ==========================
// SHOW FAVORITES
// ==========================

function showFavorites() {

    const favorites =
        JSON.parse(localStorage.getItem('favoriteCats')) || []


    favoritesContainer.innerHTML = ''


    if (favorites.length === 0) {

        favoritesContainer.innerHTML =
            `<p>No favorites yet 😿</p>`

    }
    else {

        favorites.forEach(function(cat) {

            favoritesContainer.innerHTML += `

                <div class="favorite-card">

                    <img
                        class="favorite-img"
                        src="./images/${cat.image}"
                        alt="${cat.alt}"
                    >

                </div>

            `

        })

    }


    favoritesSection.style.display = 'block'
}


// ==========================
// CLOSE FAVORITES
// ==========================

function closeFavorites() {

    favoritesSection.style.display = 'none'

}


// ==========================
// DOWNLOAD MEME
// ==========================

function downloadMeme() {

    if (!currentCat) {
        return
    }


    const link = document.createElement('a')

    link.href = `./images/${currentCat.image}`

    link.download = currentCat.image

    document.body.appendChild(link)

    link.click()

    document.body.removeChild(link)
}


// ==========================
// DARK MODE
// ==========================

function toggleDarkMode() {

    document.body.classList.toggle('dark')

    const darkModeOn =
        document.body.classList.contains('dark')


    if (darkModeOn) {

        themeToggleBtn.textContent = '☀️'

        localStorage.setItem('theme', 'dark')

    }
    else {

        themeToggleBtn.textContent = '🌙'

        localStorage.setItem('theme', 'light')

    }

}


// ==========================
// LOAD SAVED THEME
// ==========================

function loadTheme() {

    const savedTheme =
        localStorage.getItem('theme')


    if (savedTheme === 'dark') {

        document.body.classList.add('dark')

        themeToggleBtn.textContent = '☀️'

    }

}


// ==========================
// START APP
// ==========================

renderEmotionsRadios(catsData)

loadTheme()