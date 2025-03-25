document.getElementById("emailForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent page reload

    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;

    // Replace with your actual Google Apps Script Web App URL
    var webAppUrl = "https://script.google.com/macros/s/AKfycbzJkKzqvlZ3zryoqF1kZrni3vWWu0LQcMo-fFrg-ps7SSZK-cx9HrgTa2E-iJLYkxK-/exec"; 

    fetch(webAppUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: name, email: email })
    }).then(() => {
        alert("Form submitted successfully! Redirecting...");

        // Redirect to Affiliate Link after form submission
        window.location.href = "https://warriorplus.com/o2/a/rvksyyf/0"; // Replace with your affiliate link
    }).catch(error => {
        console.error("Error:", error);
        alert("Error submitting form.");
    });
});

// Update the Affiliate CTA button to redirect users
document.getElementById("affiliateCTA").addEventListener("click", function () {
    window.location.href = "YOUR_AFFILIATE_LINK"; // Replace with your affiliate link
});
