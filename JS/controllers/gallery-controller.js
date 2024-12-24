'use strict'

function renderGallery(searchTerm = '') {
    const images = getFilteredImages(searchTerm)
    const galleryEl = document.querySelector('.image-container')
    
    const strHTML = images.map(img => `
        <img src="${img.url}" 
             onclick="onImgSelect(${img.id})" 
             alt="meme template"
             class="gallery-img"
             data-keywords="${img.keywords.join(',')}">`
    )
    
    galleryEl.innerHTML = strHTML.join('')
    renderKeywordSearchDatalist()
}

function getFilteredImages(searchTerm = '') {
    if (!searchTerm) return getImgs()
    
    searchTerm = searchTerm.toLowerCase()
    return getImgs().filter(img => 
        img.keywords.some(keyword => 
            keyword.toLowerCase().includes(searchTerm)
        )
    )
}

function onSearch(searchTerm) {
    renderGallery(searchTerm)
    updateKeywordsMap(searchTerm)
}

const gKeywordSearchCountMap = loadFromStorage('keywordSearchCount') || {}

function updateKeywordsMap(searchTerm) {
    if (!searchTerm) return
    
    searchTerm = searchTerm.toLowerCase()
    gKeywordSearchCountMap[searchTerm] = (gKeywordSearchCountMap[searchTerm] || 0) + 1
    saveToStorage('keywordSearchCount', gKeywordSearchCountMap)
    renderKeywordSearchDatalist()
}

function renderSavedMemes() {
    const savedMemes = getSavedMemes()
    const containerEl = document.querySelector('.saved-memes-container')
    if (!containerEl) return
    
    const strHTML = savedMemes.map(meme => `
        <div class="saved-meme">
            <img src="${meme.imageData}" 
                 onclick="onLoadSavedMeme('${meme.id}')" 
                 alt="saved meme">
        </div>
    `)
    
    containerEl.innerHTML = strHTML.join('')
}

function onLoadSavedMeme(memeId) {
    const savedMemes = getSavedMemes()
    const meme = savedMemes.find(meme => meme.id === memeId)
    if (meme) {
        gMeme = { ...meme.memeState }
        showSection('meme-editor')
        renderMeme()
    }
}

function renderKeywordSearchDatalist() {
    const keywords = Object.keys(gKeywordSearchCountMap)
        .sort((a, b) => gKeywordSearchCountMap[b] - gKeywordSearchCountMap[a])
        .slice(0, 5)  
        
    const datalistEl = document.getElementById('search-keywords')
    const strHTML = keywords.map(keyword => `<option value="${keyword}">`)
    datalistEl.innerHTML = strHTML.join('')
}

function onKeywordClick(keyword) {
    const searchInput = document.querySelector('.search-input')
    searchInput.value = keyword
    onSearch(keyword)
}

function initSearch() {
    const searchInput = document.querySelector('.search-input')
    searchInput.addEventListener('input', (ev) => {
        onSearch(ev.target.value)
    })
}