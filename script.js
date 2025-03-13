document.addEventListener("DOMContentLoaded", function() {
    const ctaButtons = document.querySelectorAll(".cta-button");

    ctaButtons.forEach(button => {
        button.addEventListener("click", function(event) {
            event.preventDefault();
            alert("Redirecting to the offer page!");
            window.location.href = this.href;
        });
    });
});
