let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    
    if (n > slides.length) {
        slideIndex = 1;
    }
    
    if (n < 1) {
        slideIndex = slides.length;
    }
    
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
}

// Adicionar navegação por teclado
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') {
        plusSlides(-1);
    } else if (event.key === 'ArrowRight') {
        plusSlides(1);
    }
});

// Adicionar suporte a swipe em dispositivos móveis
let touchStartX = 0;
let touchEndX = 0;

document.querySelector('.slideshow-container').addEventListener('touchstart', function(event) {
    touchStartX = event.changedTouches[0].screenX;
}, false);

document.querySelector('.slideshow-container').addEventListener('touchend', function(event) {
    touchEndX = event.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        plusSlides(1); // Swipe para a esquerda - próximo slide
    }
    
    if (touchEndX > touchStartX + 50) {
        plusSlides(-1); // Swipe para a direita - slide anterior
    }
}
