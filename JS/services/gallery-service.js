'use strict'

function getFilteredImages(searchTerm = '') {
    if (!searchTerm) return getImgs()

    searchTerm = searchTerm.toLowerCase()
    return getImgs().filter(img =>
        img.keywords.some(keyword =>
            keyword.toLowerCase().includes(searchTerm)
        )
    )
}

const gKeywordSearchCountMap = loadFromStorage('keywordSearchCount') || {}

function updateKeywordsMap(searchTerm) {
    if (!searchTerm) return

    searchTerm = searchTerm.toLowerCase()
    gKeywordSearchCountMap[searchTerm] = (gKeywordSearchCountMap[searchTerm] || 0) + 1
    saveToStorage('keywordSearchCount', gKeywordSearchCountMap)
    renderKeywordSearchDatalist()
}

function renderKeywordSearchDatalist() {
    const keywords = Object.keys(gKeywordSearchCountMap)
        .sort((a, b) => gKeywordSearchCountMap[b] - gKeywordSearchCountMap[a])
        .slice(0, 5)

    const datalistEl = document.getElementById('search-keywords')
    const strHTML = keywords.map(keyword => `<option value="${keyword}">`)
    datalistEl.innerHTML = strHTML.join('')
}

function addImageToGallery(img) {
    const newImage = {
        id: gImgs.length + 1,
        url: img.src,
        keywords: ['uploaded']
    }
    gImgs.unshift(newImage)
    renderGallery()
}

function onUploadClick() {
    const fileInput = document.querySelector('.file-input') 
    fileInput.click() 
}

function onRandomMeme() {
    const randomImgId = getRandomImgId()
    const randomText = getRandomQuote()
    setImg(randomImgId)

    gMeme.lines[0].txt = randomText
    showSection('meme-editor')

    renderMeme()
}
