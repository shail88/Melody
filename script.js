document.addEventListener("DOMContentLoaded", function () {
  const emailForm = document.getElementById("emailForm");

  emailForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    // Google Form pre-filled link (Replace YOUR_GOOGLE_FORM_ID)
    const googleFormUrl = `https://docs.google.com/forms/d/e/1FAIpQLSdHteV5ETYwQ_UDjJiSF4s4eVdMVVTRvc8Q5cDOoPYUyacLAg/viewform?usp=header=${encodeURIComponent(name)}&entry.0987654321=${encodeURIComponent(email)}`;

    // Redirect user to Google Form
    window.location.href = googleFormUrl;
  });
});
