document.addEventListener("DOMContentLoaded", function() {
    const emailForm = document.getElementById("emailForm");
    const affiliateCTA = document.getElementById("affiliateCTA");
    
    emailForm.addEventListener("submit", function(event) {
        event.preventDefault();
        
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        
    // Send data to Google Sheets
        fetch(document.getElementById("yourFormId").addEventListener("submit", async function(event) {
  event.preventDefault(); // Prevents the form from reloading the page

  // Get user input
  let formData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value
  };

  try {
    let response = await fetch("https://script.google.com/macros/s/AKfycbx_rDVrpmgqDz_RW3PDcsfJJH-0P_1yOGMWC1AZmmH4dhXtBiGZo7IPyLFNhvmGtOClag/exec", {
      method: "POST",
      mode: "cors", // Fixes CORS issue
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    let result = await response.json();
    if (result.status === "success") {
      alert("Form submitted successfully!");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to submit the form.");
  }
});
)
        .then(response => response.text())
        .then(data => {
            alert("Success! Check your email for the free eBook.");
            window.location.href = "https://warriorplus.com/o2/a/rvksyyf/0"; // Redirect to affiliate link
        })
        .catch(error => console.error("Error:", error));
    });
});
