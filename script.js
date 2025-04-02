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
        alert("You're all set! 🎉 Your free eBook is on the way! 🚀 Plus, check out this powerful AI music tool for exclusive access. Redirecting now...");

        // Redirect to Affiliate Link after 2 seconds
        setTimeout(() => {
            window.location.href = "https://warriorplus.com/o2/a/rvksyyf/0"; // Replace with your affiliate link
        }, 2000);
    }).catch(error => {
        console.error("Error:", error);
        alert("Oops! Something went wrong. Please try again later.");
    });
});

// Update the Affiliate CTA button to redirect users
document.getElementById("affiliateCTA").addEventListener("click", function () {
    window.location.href = "https://warriorplus.com/o2/a/rvksyyf/0"; // Replace with your affiliate link
});
