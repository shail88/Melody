document.addEventListener("DOMContentLoaded", function() {
    const emailForm = document.getElementById("emailForm");
    const affiliateCTA = document.getElementById("affiliateCTA");
    
    emailForm.addEventListener("submit", function(event) {
        event.preventDefault();
        
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        
    // Send data to Google Sheets
        fetch("https://script.google.com/macros/s/AKfycbwZ6dUFjxevEnFZfOY_MVvqfLw0PzrKuK4lOe5jZDuR/dev", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name, email: email })
        })
        .then(response => response.text())
        .then(data => {
            alert("Success! Check your email for the free eBook.");
            window.location.href = "https://warriorplus.com/o2/a/rvksyyf/0"; // Redirect to affiliate link
        })
        .catch(error => console.error("Error:", error));
    });
});
