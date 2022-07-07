// register the onscroll event
window.onscroll = function() {
    var currentScrollPos = window.pageYOffset;
    if (currentScrollPos > 200) {
        var arrow = document.getElementById("downarrow");
        if (arrow.classList.contains("fadeIn")) {
            arrow.classList.remove("fadeIn");
            arrow.classList.add("fadeOut");
        }
    } else {
        var arrow = document.getElementById("downarrow");
        if (arrow.classList.contains("fadeOut")) {
            arrow.classList.add("fadeIn");
            arrow.classList.remove("fadeOut");
        }
    }
}

function refresh() {
    window.location.reload();
}
