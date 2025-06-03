document.addEventListener("DOMContentLoaded", function() {
    const emailForm = document.getElementById("emailForm");
    const affiliateCTA = document.getElementById("affiliateCTA");
    
    emailForm.addEventListener("submit", function(event) {
        event.preventDefault();
        
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        
        // Send data to Google Sheets
        fetch("https://script.google.com/macros/s/AKfycbz-KhFPa4xKUpP9F51q6sBKPZFBXgUQTE7nVxHGOgI__WCMhvo0146R0MjRIFA4jdM9_A/exec", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name, email: email })
        })
        .then(response => response.text())
        .then(data => {
            alert("Success! Check your email for the free eBook.");
            window.location.href = "YOUR_AFFILIATE_LINK"; // Redirect to affiliate link
        })
        .catch(error => console.error("Error:", error));
    });
});
