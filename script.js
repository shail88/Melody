document.addEventListener("DOMContentLoaded", function () {
    const emailForm = document.getElementById("emailForm");

    emailForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent form from reloading the page

        // Get user input
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;

        // Validate input (optional but recommended)
        if (!name || !email) {
            alert("Please enter both name and email.");
            return;
        }

        const formData = { name, email };

        try {
            let response = await fetch(
                "https://script.google.com/macros/s/AKfycby2ASn4VtrMd4EebIA4mJuPm2yTUaHGXWpaVKTEkohYVx4MkupYj5ogjSltQZCRCO1adA/exec",
                {
                    method: "POST",
                    mode: "cors", // Fixes CORS issue
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                }
            );

            let result = await response.json();

            if (result.status === "success") {
                alert("Form submitted successfully! Check your email for the free eBook.");
                window.location.href = "https://warriorplus.com/o2/a/rvksyyf/0"; // Redirect to affiliate link
            } else {
                alert("Failed to submit the form. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while submitting the form.");
        }
    });
});
