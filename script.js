ddocument.getElementById("submitBtn").addEventListener("click", function (e) {
    e.preventDefault(); // Prevent form from reloading the page

    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;

    fetch("https://script.google.com/macros/s/AKfycbyIA2mhgKyN7IU_TQOzpJylwbnH_YIIuQkOMeuKDImgoVZoGEX7DttBjcZtFvW9RMzL/exec, { // Replace with your actual Web App URL
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: name, email: email })
    }).then(() => {
        alert("Form submitted successfully! Redirecting...");
        window.location.href = "YOUR_AFFILIATE_LINK"; // Replace with your actual affiliate link
    }).catch(error => {
        console.error("Error:", error);
        alert("Error submitting form.");
    });
});
