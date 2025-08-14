
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
// Countdown Timer
function startCountdown(duration, display) {
    let timer = duration, hours, minutes, seconds;
    
    setInterval(function () {
        hours = parseInt(timer / 3600, 10);
        minutes = parseInt((timer % 3600) / 60, 10);
        seconds = parseInt(timer % 60, 10);
        
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        
        display.textContent = hours + ":" + minutes + ":" + seconds;
        
        if (--timer < 0) {
            timer = 0;
            // Redirect or show offer expired message
            display.textContent = "EXPIRED";
        }
    }, 1000);
}

window.onload = function () {
    const countdownDuration = 24 * 60 * 60; // 24 hours in seconds
    const display = document.querySelector('#countdown');
    startCountdown(countdownDuration, display);
};

// Add animation on scroll
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});


