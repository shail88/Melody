document.addEventListener("DOMContentLoaded", function () {
  const emailForm = document.getElementById("emailForm");

  emailForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    let formData = { name: name, email: email };

    try {
      let response = await fetch("https://script.google.com/macros/s/YOUR_DEPLOYED_SCRIPT_URL/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      let result = await response.json();

      if (result.status === "success") {
        alert("Form submitted successfully!");
        window.location.href = "https://warriorplus.com/o2/a/rvksyyf/0"; // ✅ Redirect
      } else {
        alert("Submission failed: " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to submit the form.");
    }
  });
});
