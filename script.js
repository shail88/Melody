<script>
document.addEventListener("DOMContentLoaded", function() {
  const emailForm = document.getElementById("emailForm");

  emailForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();

    fetch('https://script.google.com/macros/s/AKfycbwKl6Ts0loAVN9jFc9XYJlnGPp5_8GyS5FIMKR2cQMGncNwKBSMgUcPqalDefBid0Bj/exec', {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: name, email: email })
    })
    .then(() => {
      console.log('Request sent successfully!');
      alert("Thank you! Your Ebook has been sent.");
      // ✅ Clear the inputs
      document.getElementById("name").value = '';
      document.getElementById("email").value = '';
    })
    .catch(error => {
      console.error(error);
      alert("Error submitting data.");
    });
  });
});
</script>
