// ===== MelodyBox – Google Sheets Connected Version =====

// === CONFIG ===
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzFU0QHaT7bcv2Vxl14gsVOlpemtptISYsho8WuVgdTB4DZqvkWHli4WihD8koDc7aBOQ/exec";

// === UI ELEMENTS ===
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const closeLoginModal = document.getElementById('closeLoginModal');
const closeSignupModal = document.getElementById('closeSignupModal');
const switchToSignup = document.getElementById('switchToSignup');
const switchToLogin = document.getElementById('switchToLogin');
const notification = document.getElementById('notification');
const headerRight = document.querySelector('.header-right');
const downloadPdfBtn = document.getElementById('downloadPdfBtn');
const darkModeToggle = document.getElementById('darkModeToggle');

// === HELPERS ===
function openModal(m) { if(m) m.style.display = 'flex'; }
function closeModal(m) { if(m) m.style.display = 'none'; }

document.addEventListener('click', e => {
  if (e.target === loginModal) closeModal(loginModal);
  if (e.target === signupModal) closeModal(signupModal);
});

function showNotification(msg, type = 'success') {
  if (!notification) return;
  notification.textContent = msg;
  notification.className = `notification show ${type}`;
  setTimeout(() => notification.classList.remove('show'), 3000);
}

// Enhanced fetch with CORS proxy fallback
async function safeFetch(url, options = {}) {
  const corsProxy = 'https://corsproxy.io/?';
  const urlsToTry = [
    url, // Try direct first
    corsProxy + encodeURIComponent(url) // Fallback to CORS proxy
  ];

  for (const tryUrl of urlsToTry) {
    try {
      console.log('Trying URL:', tryUrl);
      const response = await fetch(tryUrl, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
      
      console.log('Fetch successful:', data);
      return { success: true, data };
    } catch (error) {
      console.warn(`Fetch failed for ${tryUrl}:`, error.message);
      // Continue to next URL
    }
  }
  
  return { 
    success: false, 
    error: 'All fetch attempts failed',
    data: null 
  };
}

// Safe DOM element getter
function getElementSafe(id) {
  const element = document.getElementById(id);
  if (!element) {
    console.warn(`Element with id '${id}' not found`);
  }
  return element;
}

// === USER SESSION ===
function setCurrentUser(u) { 
  localStorage.setItem('mb_current', JSON.stringify(u)); 
}
function getCurrentUser() { 
  const raw = localStorage.getItem('mb_current'); 
  return raw ? JSON.parse(raw) : null; 
}
function logoutUser() { 
  localStorage.removeItem('mb_current'); 
  showNotification('Logged out successfully!'); 
  updateHeader(); 
}

function updateHeader() {
  if (!headerRight) return;
  
  const user = getCurrentUser();
  if (user) {
    headerRight.innerHTML = `<span>👋 Welcome, <strong>${user.name || user.email}</strong></span>
      <button id="logoutBtn" class="btn btn-outline">Logout</button>`;
    const logoutBtn = getElementSafe('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', logoutUser);
  } else {
    headerRight.innerHTML = `<button id="loginBtn" class="btn btn-outline">Login</button>
      <button id="signupBtn" class="btn btn-primary">Sign Up</button>`;
    const loginBtn = getElementSafe('loginBtn');
    const signupBtn = getElementSafe('signupBtn');
    if (loginBtn) loginBtn.addEventListener('click', () => openModal(loginModal));
    if (signupBtn) signupBtn.addEventListener('click', () => openModal(signupModal));
  }
}

// === SIGNUP → Google Sheet ===
const signupForm = getElementSafe('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', async e => {
    e.preventDefault();
    const name = getElementSafe('signupName')?.value.trim() || '';
    const email = getElementSafe('signupEmail')?.value.trim().toLowerCase() || '';
    const password = getElementSafe('signupPassword')?.value.trim() || '';
    
    if (!name || !email || !password) { 
      showNotification('Please fill all fields', 'error'); 
      return; 
    }

    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn?.textContent || 'Sign Up';
    if (submitBtn) {
      submitBtn.textContent = 'Signing Up...';
      submitBtn.disabled = true;
    }

    const result = await safeFetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'signup', name, email, password })
    });

    // Restore button state
    if (submitBtn) {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }

    if (result.success && result.data.success) {
      showNotification(result.data.message, 'success');
      setCurrentUser({ name, email });
      closeModal(signupModal);
      updateHeader();
      fetchStats();
    } else {
      const errorMsg = result.success ? result.data.message : 'Network error during signup. Please try again.';
      showNotification(errorMsg, 'error');
    }
  });
}

// === LOGIN → Google Sheet ===
const loginForm = getElementSafe('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const email = getElementSafe('loginEmail')?.value.trim().toLowerCase() || '';
    const password = getElementSafe('loginPassword')?.value.trim() || '';
    
    if (!email || !password) {
      showNotification('Please fill all fields', 'error');
      return;
    }

    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn?.textContent || 'Login';
    if (submitBtn) {
      submitBtn.textContent = 'Logging In...';
      submitBtn.disabled = true;
    }

    // Get IP address (optional)
    let ipAddress = '';
    try {
      const ipResponse = await fetch("https://api.ipify.org?format=json");
      const ipData = await ipResponse.json();
      ipAddress = ipData.ip;
    } catch (ipError) {
      console.log('IP fetch failed, continuing without IP');
    }

    const result = await safeFetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'login', email, password, ipAddress })
    });

    // Restore button state
    if (submitBtn) {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }

    if (result.success && result.data.success) {
      const userData = {
        email,
        name: result.data.user?.name || email
      };
      setCurrentUser(userData);
      showNotification(result.data.message || 'Welcome back!', 'success');
      closeModal(loginModal);
      updateHeader();
      fetchStats();
    } else {
      const errorMsg = result.success ? result.data.message : 'Network error during login. Please try again.';
      showNotification(errorMsg, 'error');
    }
  });
}

// === DASHBOARD STATS ===
async function fetchStats() {
  console.log('Fetching stats...');
  
  const result = await safeFetch(GOOGLE_SCRIPT_URL);
  
  // Safe DOM updates
  const updateStat = (id, value) => {
    const element = getElementSafe(id);
    if (element) {
      element.textContent = value;
    }
  };
  
  if (result.success && result.data.success && result.data.dashboard) {
    const stats = result.data.dashboard;
    console.log('Stats received:', stats);
    
    updateStat('totalUsers', stats.totalUsers || 0);
    updateStat('totalLogins', stats.totalLogins || 0);
    updateStat('uniqueUsers', stats.uniqueUsers || stats['Unique Users'] || 0);
    updateStat('todayLogins', stats.todayLogins || 0);
    updateStat('newUsersToday', stats.newUsersToday || 0);
  } else {
    // Fallback to default values if fetch fails
    console.warn('Stats fetch failed, using fallback values');
    updateStat('totalUsers', '0');
    updateStat('totalLogins', '0');
    updateStat('uniqueUsers', '0');
    updateStat('todayLogins', '0');
    updateStat('newUsersToday', '0');
  }
}

// === NEWSLETTER ===
const newsletterForm = getElementSafe('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    const emailInput = e.target.querySelector('input[type="email"]');
    const email = emailInput?.value.trim() || '';
    
    if (!email) {
      showNotification('Please enter your email', 'error');
      return;
    }
    
    showNotification('Thanks for subscribing! 📧');
    e.target.reset();
  });
}

// === ENROLL ===
function enrollCourse(course) {
  const user = getCurrentUser();
  if (user) {
    showNotification(`You enrolled in "${course}" 🎓`);
    
    // Optional: Send enrollment data to Google Sheets
    safeFetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({ 
        action: 'enroll', 
        email: user.email, 
        course: course 
      })
    });
  } else {
    showNotification('Please log in first', 'error');
    openModal(loginModal);
  }
}

// === PDF EXPORT ===
if (downloadPdfBtn) {
  downloadPdfBtn.addEventListener('click', () => {
    document.querySelectorAll('.modal').forEach(m => closeModal(m));
    if (notification) notification.classList.remove('show');
    window.print(); // user chooses "Save as PDF"
  });
}

// === DARK MODE ===
function applyDarkMode(on) { 
  document.body.classList.toggle('dark', on);
  localStorage.setItem('mb_dark', on ? '1' : '0');
}

if (darkModeToggle) {
  darkModeToggle.addEventListener('click', () => {
    const enabled = !document.body.classList.contains('dark');
    applyDarkMode(enabled);
    showNotification(`Dark mode ${enabled ? 'enabled' : 'disabled'}`);
  });
}

// === MODAL SWITCHING ===
if (switchToSignup) {
  switchToSignup.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(loginModal);
    openModal(signupModal);
  });
}

if (switchToLogin) {
  switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(signupModal);
    openModal(loginModal);
  });
}

// === CLOSE BUTTONS ===
if (closeLoginModal) {
  closeLoginModal.addEventListener('click', () => closeModal(loginModal));
}

if (closeSignupModal) {
  closeSignupModal.addEventListener('click', () => closeModal(signupModal));
}

// === INIT ===
(function() {
  console.log('Initializing MelodyBox...');
  
  // Apply saved dark mode preference
  applyDarkMode(localStorage.getItem('mb_dark') === '1');
  
  // Initialize header and stats
  updateHeader();
  fetchStats();
  
  // Set up periodic stats refresh (every 60 seconds)
  setInterval(fetchStats, 60000);
  
  console.log('MelodyBox initialized successfully');
})();
