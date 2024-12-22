'use strict'

let gElCanvas
let gCtx

function onInit() {
    gElCanvas = document.querySelector('.meme-canvas')
    gCtx = gElCanvas.getContext('2d')
    
    renderGallery()
    addListeners()
    showSection('gallery')
}

function addListeners() {
    window.addEventListener('resize', () => {
        resizeCanvas()
        renderMeme()
    })
}

function onImgSelect(imgId) {
    setImg(imgId)
    showSection('meme-editor')
    renderMeme()
}

function renderMeme() {
    const meme = getMeme()
    const img = new Image()
    img.src = getImgs().find(img => img.id === meme.selectedImgId).url
    
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
        
        meme.lines.forEach((line, idx) => {
            drawText(line)
            if (idx === meme.selectedLineIdx) {
                drawTextBox(line)
            }
        })
    }
}

function drawText(line) {
    gCtx.lineWidth = 2
    gCtx.strokeStyle = line.stroke
    gCtx.fillStyle = line.color
    gCtx.font = `${line.size}px ${line.font}`
    gCtx.textAlign = 'center'
    gCtx.textBaseline = 'middle'
    
    gCtx.fillText(line.txt, line.pos.x, line.pos.y)
    gCtx.strokeText(line.txt, line.pos.x, line.pos.y)
}

function drawTextBox(line) {
    const textMetrics = gCtx.measureText(line.txt)
    const padding = 10
    
    gCtx.beginPath()
    gCtx.rect(
        line.pos.x - textMetrics.width / 2 - padding,
        line.pos.y - line.size / 2 - padding,
        textMetrics.width + padding * 2,
        line.size + padding * 2
    )
    gCtx.strokeStyle = '#ffffff55'
    gCtx.stroke()
}

function onTextInput(txt) {
    setLineTxt(txt)
    renderMeme()
}

function onColorChange(color) {
    setLineColor(color)
    renderMeme()
}

function onAddLine() {
    addLine()
    renderMeme()
}

function onSwitchLine() {
    switchLine()
    renderMeme()
    updateTextInput()
}

function updateTextInput() {
    const meme = getMeme()
    const elTextInput = document.querySelector('.text-input')
    elTextInput.value = meme.lines[meme.selectedLineIdx].txt
}

function onChangeFontSize(diff) {
    setFontSize(diff)
    renderMeme()
}

function onSaveMeme() {
    saveMeme()
    alert('Meme saved successfully!')
    showSection('saved-memes')
}

function onDownloadMeme(elLink) {
    const dataUrl = gElCanvas.toDataURL()
    elLink.href = dataUrl
}

function showSection(sectionName) {
    const sections = document.querySelectorAll('section')
    sections.forEach(section => section.classList.add('hidden'))
    
    const selectedSection = document.querySelector(`.${sectionName}`)
    if (selectedSection) {
        selectedSection.classList.remove('hidden')
        if (sectionName === 'saved-memes') {
            updateSavedMemesView()
        }
    }
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetWidth
}