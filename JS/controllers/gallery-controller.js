'use strict'

function renderGallery() {
    const images = getImgs()
    const galleryEl = document.querySelector('.image-container')
    
    const strHTML = images.map(img => `
        <img src="${img.url}" 
             onclick="onImgSelect(${img.id})" 
             alt="meme template"
             class="gallery-img">
    `)
    
    galleryEl.innerHTML = strHTML.join('')
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