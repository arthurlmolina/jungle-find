const audio = document.getElementById('audio-menu');
document.addEventListener('click', function () {
    audio.play()
    document.getElementById('dica').style.display = "none";
})