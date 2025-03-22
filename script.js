document.addEventListener("DOMContentLoaded", function () {
  const emailForm = document.getElementById("emailForm");

  emailForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevents default form submission

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    // Replace entry IDs with your actual Google Form entry IDs
    const googleFormUrl = `https://docs.google.com/forms/d/e/1FAIpQLSdHteV5ETYwQ_UDjJiSF4s4eVdMVVTRvc8Q5cDOoPYUyacLAg/viewform?usp=pp_url
&entry.1530354256=${encodeURIComponent(name)}
&entry.1530354256=${encodeURIComponent(email)}`;

    window.location.href = googleFormUrl; // Redirect to Google Form
  });
});
