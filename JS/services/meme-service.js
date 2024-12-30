
const STORAGE_KEY = 'memeDB'
const SAVED_MEMES_KEY = 'savedMemes'

const gFunnyQuotes = [
    "When in doubt, take a nap",
    "I need a six month vacation, twice a year",
    "I regret nothing",
    "Challenge accepted!",
    "Weekend, is that you?",
    "Coffee first, schemes later",
    "Living my best life",
    "Plot twist!",
    "This seemed funnier in my head",
    "Currently unsupervised"
]

const gImgs = [
    { id: 1, url: 'images/1.jpg', keywords: ['funny', 'cat'] },
    { id: 2, url: 'images/2.jpg', keywords: ['dog', 'cute', 'animals'] },
    { id: 3, url: 'images/3.jpg', keywords: ['baby', 'funny', 'cute'] },
    { id: 4, url: 'images/4.jpg', keywords: ['trump', 'president'] },
    { id: 5, url: 'images/5.jpg', keywords: ['dog', 'baby'] },
    { id: 6, url: 'images/6.jpg', keywords: ['cat', 'laptop'] },
    { id: 7, url: 'images/7.jpg', keywords: ['surprised', 'what'] },
    { id: 8, url: 'images/8.jpg', keywords: ['listening', 'kid'] },
    { id: 9, url: 'images/9.jpg', keywords: ['laugh', 'kid'] },
    { id: 10, url: 'images/10.jpg', keywords: ['gay', 'kiss'] },
    { id: 11, url: 'images/11.jpg', keywords: ['gays', 'liberal'] },
    { id: 12, url: 'images/12.jpg', keywords: ['what', 'funny'] },
    { id: 13, url: 'images/13.jpg', keywords: ['cheers', 'actors'] },
    { id: 14, url: 'images/14.jpg', keywords: ['deadly', 'serious'] },
    { id: 15, url: 'images/15.jpg', keywords: ['throne', 'funny'] },
    { id: 16, url: 'images/16.jpg', keywords: ['star wars', 'what'] },
    { id: 17, url: 'images/17.jpg', keywords: ['putin', 'evil'] },
    { id: 18, url: 'images/18.jpg', keywords: ['toy store', 'kid'] },

]

let gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'Enter text here',
            size: 40,
            color: 'white',
            stroke: 'black',
            font: 'Impact',
            pos: { x: 225, y: 50 },
            isDrag: false
        }
    ]
}

function getMeme() {
    return gMeme
}

function getImgs() {
    return gImgs
}

function setLineTxt(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
}

function setImg(imgId) {
    gMeme.selectedImgId = imgId
}

function addLine() {
    const newLine = {
        txt: 'Enter text here',
        size: 40,
        color: 'white',
        stroke: 'black',
        font: 'Impact',
        align: 'center',
        pos: { x: 225, y: gMeme.lines.length === 1 ? 400 : 225 }
    }
    gMeme.lines.push(newLine)
    gMeme.selectedLineIdx = gMeme.lines.length - 1
}

function addSticker(emoji) {
    const sticker = {
        txt: emoji,
        size: 40,
        pos: { x: gElCanvas.width / 2, y: gElCanvas.height / 2 },
        isDrag: false,
        isSticker: true
    }
    gMeme.lines.push(sticker)
    gMeme.selectedLineIdx = gMeme.lines.length - 1
}

function isTextClicked(clickedPos) {
    return gMeme.lines.findIndex(line => {
        const textMetrics = gCtx.measureText(line.txt)
        const height = line.isSticker ? line.size : line.size
        const width = textMetrics.width
        
        return (
            clickedPos.x >= line.pos.x - width/2 &&
            clickedPos.x <= line.pos.x + width/2 &&
            clickedPos.y >= line.pos.y - height/2 &&
            clickedPos.y <= line.pos.y + height/2
        )
    })
}

function setLineColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color
}

function setFontSize(diff) {
    gMeme.lines[gMeme.selectedLineIdx].size += diff
}

function setTextDrag(isDrag) {
    gMeme.lines[gMeme.selectedLineIdx].isDrag = isDrag
}

function moveText(dx, dy) {
    const line = gMeme.lines[gMeme.selectedLineIdx]
    line.pos.x += dx
    line.pos.y += dy
}

function isTextClicked(clickedPos) {
    return gMeme.lines.findIndex(line => {
        const textMetrics = gCtx.measureText(line.txt)
        const textHeight = line.size
        const textWidth = textMetrics.width

        return (
            clickedPos.x >= line.pos.x - textWidth / 2 &&
            clickedPos.x <= line.pos.x + textWidth / 2 &&
            clickedPos.y >= line.pos.y - textHeight / 2 &&
            clickedPos.y <= line.pos.y + textHeight / 2
        )
    })
}

function switchLine() {
    gMeme.selectedLineIdx = (gMeme.selectedLineIdx + 1) % gMeme.lines.length
}

function setLineAlign(align) {
    gMeme.lines[gMeme.selectedLineIdx].align = align
}

function moveLinePosition(diff) {
    gMeme.lines[gMeme.selectedLineIdx].pos.y += diff
}

function deleteLine() {
    if (gMeme.lines.length <= 1) return
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    gMeme.selectedLineIdx = Math.min(gMeme.selectedLineIdx, gMeme.lines.length - 1)
}

function isLineClicked(clickedPos) {
    const { x, y } = clickedPos
    return gMeme.lines.findIndex(line => {
        const textMetrics = gCtx.measureText(line.txt)
        const textHeight = line.size
        const textWidth = textMetrics.width

        return (x >= line.pos.x - textWidth / 2 &&
            x <= line.pos.x + textWidth / 2 &&
            y >= line.pos.y - textHeight / 2 &&
            y <= line.pos.y + textHeight / 2)
    })
}

function saveMeme() {
    const canvas = document.querySelector('.meme-canvas')
    const memeImage = canvas.toDataURL('image/jpeg')

    const savedMemes = loadFromStorage(SAVED_MEMES_KEY) || []
    const memeToSave = {
        id: makeId(),
        imageData: memeImage,
        memeState: { ...gMeme }
    }

    savedMemes.push(memeToSave)
    saveToStorage(SAVED_MEMES_KEY, savedMemes)
}
function getSavedMemes() {
    return loadFromStorage(SAVED_MEMES_KEY) || []
}

function toggleMenu() {
    document.body.classList.toggle('menu-open')
}

function updateSavedMemesView() {
    const savedMemes = getSavedMemes()
    const noMemesMessage = document.querySelector('.no-memes-message')
    const container = document.querySelector('.saved-memes-container')

    if (savedMemes.length === 0) {
        noMemesMessage.style.display = 'block'
        container.style.display = 'none'
    } else {
        noMemesMessage.style.display = 'none'
        container.style.display = 'grid'
        renderSavedMemes()
    }
}

function preventZoomOnMobile() {
    const buttons = document.querySelectorAll('.control-icon, .text-action-buttons button, .bottom-action-buttons button, .nav-links button, .tag, .color-btn, .sticker')
    
    buttons.forEach(button => {
        button.classList.add('touch-action-manipulation')
    })
}

function getRandomImgId() {
    const imgs = getImgs()
    const randomIdx = getRandomInt(0, imgs.length - 1)
    return imgs[randomIdx].id
}

function getRandomQuote() {
    const randomIdx = getRandomInt(0, gFunnyQuotes.length - 1)
    return gFunnyQuotes[randomIdx]
}