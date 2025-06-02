<script>
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("emailForm").addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent page reload

        var name = document.getElementById("name").value.trim();
        var email = document.getElementById("email").value.trim();

        if (!name || !email) {
            alert("❌ Please enter your name and email before submitting!");
            return;
        }

        localStorage.setItem("userName", name);
        localStorage.setItem("userEmail", email);

        var webAppUrl = "https://script.google.com/macros/s/AKfycbzJkKzqvlZ3zryoqF1kZrni3vWWu0LQcMo-fFrg-ps7SSZK-cx9HrgTa2E-iJLYkxK-/exec";

        fetch(webAppUrl, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: name, email: email })
        }).then(() => {
            alert("✅ You're all set! 🎉 Your free eBook is on the way! 🚀 Plus, check out this powerful AI music tool for exclusive access.");

            setTimeout(() => {
                window.location.href = "https://warriorplus.com/o2/a/rvksyyf/0";
            }, 2000);
        }).catch(error => {
            console.error("Error:", error);
            alert("❌ Oops! Something went wrong. Please try again later.");
        });
    });

    document.getElementById("affiliateCTA").addEventListener("click", function () {
        var storedName = localStorage.getItem("userName");
        var storedEmail = localStorage.getItem("userEmail");

        if (!storedName || !storedEmail) {
            alert("❌ Please enter your name and email before accessing the AI tool.");
            return;
        }

        window.location.href = "https://warriorplus.com/o2/a/rvksyyf/0";
    });
});
</script>
