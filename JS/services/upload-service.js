'use strict'

async function uploadImg(imgData, onSuccess) {
    const CLOUD_NAME = 'webify'
    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
    const formData = new FormData()
    formData.append('file', imgData)
    formData.append('upload_preset', 'webify')
    
    try {
        const res = await fetch(UPLOAD_URL, {
            method: 'POST',
            body: formData
        })
        const data = await res.json()
        onSuccess(data.secure_url)
    } catch (err) {
        console.error('Error uploading image:', err)
    }
}

function loadImageFromInput(ev, onImageReady) {
    const reader = new FileReader()
    
    reader.onload = function (event) {
        const img = new Image()
        img.onload = () => onImageReady(img)
        img.src = event.target.result
    }
    reader.readAsDataURL(ev.target.files[0])
}