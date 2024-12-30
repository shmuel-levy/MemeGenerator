'use strict'

let gElCanvas
let gCtx
let gStartPos
const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

function onInit() {
    gElCanvas = document.querySelector('.meme-canvas')
    gCtx = gElCanvas.getContext('2d')
    
    preventZoomOnMobile()
    initSearch()  
    renderGallery()
    addListeners()
    showSection('gallery')
}

function addListeners() {
    addMouseListeners()
    addTouchListeners()
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
    gCtx.textAlign = line.align || 'center'
    gCtx.textBaseline = 'middle'
    let xPos = line.pos.x
    if (line.align === 'left') xPos = 50
    if (line.align === 'right') xPos = gElCanvas.width - 50
    
    gCtx.fillText(line.txt, xPos, line.pos.y)
    gCtx.strokeText(line.txt, xPos, line.pos.y)
}

function drawTextBox(line) {
    const textMetrics = gCtx.measureText(line.txt)
    const padding = 10
    
    const textHeight = line.size
    
    gCtx.save()
    
    gCtx.strokeStyle = '#ffffff' 
    gCtx.lineWidth = 2 
    gCtx.setLineDash([6, 6]) 
    
    gCtx.beginPath()
    gCtx.rect(
        line.pos.x - (textMetrics.width / 2) - padding,
        line.pos.y - (textHeight / 2) - padding,
        textMetrics.width + (padding * 2),
        textHeight + (padding * 2)
    )
    gCtx.stroke()
        gCtx.restore()
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchend', onUp)
}

function onDown(ev) {
    const pos = getEvPos(ev)
    const clickedLineIdx = isTextClicked(pos)
    
    if (clickedLineIdx === -1) return
    
    gMeme.selectedLineIdx = clickedLineIdx
    setTextDrag(true)
    gStartPos = pos
    document.body.style.cursor = 'grabbing'
    
    renderMeme()
    updateTextInput()
}

function onMove(ev) {
    const line = gMeme.lines[gMeme.selectedLineIdx]
    if (!line || !line.isDrag) return
    
    const pos = getEvPos(ev)
    const dx = pos.x - gStartPos.x
    const dy = pos.y - gStartPos.y
    
    moveText(dx, dy)
    gStartPos = pos
    renderMeme()
}

function onUp() {
    setTextDrag(false)
    document.body.style.cursor = 'grab'
}

function getEvPos(ev) {
    let pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }

    if (TOUCH_EVS.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos
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

function onAddSticker(emoji) {
    addSticker(emoji)
    renderMeme()
}

function onAlignText(align) {
    setLineAlign(align)
    renderMeme()
}

function onSwitchLine() {
    switchLine()
    renderMeme()
    updateTextInput()
}

function onCanvasClick(ev) {
    const rect = gElCanvas.getBoundingClientRect()
    const x = ev.clientX - rect.left
    const y = ev.clientY - rect.top
    
    const clickedLineIdx = isLineClicked({x, y})
    if (clickedLineIdx !== -1) {
        gMeme.selectedLineIdx = clickedLineIdx
        updateTextInput()
        renderMeme()
    }
}

function onAlignText(align) {
    setLineAlign(align)
    renderMeme()
}

function onMoveLine(diff) {
    moveLinePosition(diff)
    renderMeme()
}

function onDeleteLine() {
    const meme = getMeme()
    if (meme.lines.length > 0) {
        meme.lines.splice(meme.selectedLineIdx, 1)
        if (meme.selectedLineIdx >= meme.lines.length) {
            meme.selectedLineIdx = Math.max(0, meme.lines.length - 1)
        }
        renderMeme()
        updateTextInput()
    }
}

function onAlignText(alignment) {
    const meme = getMeme()
    if (meme.lines.length > 0) {
        meme.lines[meme.selectedLineIdx].align = alignment
        renderMeme()
    }
}

function onFontChange(font) {
    const meme = getMeme()
    if (meme.lines.length > 0) {
        meme.lines[meme.selectedLineIdx].font = font
        renderMeme()
    }
}

function onStrokeChange(color) {
    const meme = getMeme()
    if (meme.lines.length > 0) {
        meme.lines[meme.selectedLineIdx].stroke = color
        renderMeme()
    }
}

function onShareMeme() {
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
    const containerWidth = elContainer.offsetWidth

    const aspectRatio = 1 
    gElCanvas.width = containerWidth
    gElCanvas.height = containerWidth / aspectRatio

    renderMeme()
    // console.log('hey:')
}