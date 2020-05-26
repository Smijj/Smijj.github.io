
// To replace using a tags
jQuery(document).ready(function($) {
            $('*[data-href]').on('click', function() {
                window.location = $(this).data("href");
            });
        });

// For the nav bar in mobile view
function overlay() {
    el = document.getElementById("overlay");
    el.style.display = (el.style.display == "block") ? "none" : "block";
}