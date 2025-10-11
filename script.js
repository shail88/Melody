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
function openModal(m) { m.style.display = 'flex'; }
function closeModal(m) { m.style.display = 'none'; }

document.addEventListener('click', e => {
  if (e.target === loginModal) closeModal(loginModal);
  if (e.target === signupModal) closeModal(signupModal);
});

function showNotification(msg, type = 'success') {
  notification.textContent = msg;
  notification.className = `notification show ${type}`;
  setTimeout(() => notification.classList.remove('show'), 3000);
}

// Enhanced fetch with CORS handling
async function safeFetch(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Fetch error:', error);
    return { 
      success: false, 
      error: error.message,
      data: null 
    };
  }
}

// === USER SESSION (local cache only) ===
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
  const user = getCurrentUser();
  if (user) {
    headerRight.innerHTML = `<span>👋 Welcome, <strong>${user.name || user.email}</strong></span>
      <button id="logoutBtn" class="btn btn-outline">Logout</button>`;
    document.getElementById('logoutBtn').addEventListener('click', logoutUser);
  } else {
    headerRight.innerHTML = `<button id="loginBtn" class="btn btn-outline">Login</button>
      <button id="signupBtn" class="btn btn-primary">Sign Up</button>`;
    document.getElementById('loginBtn').addEventListener('click', () => openModal(loginModal));
    document.getElementById('signupBtn').addEventListener('click', () => openModal(signupModal));
  }
}

// === SIGNUP → Google Sheet ===
document.getElementById('signupForm').addEventListener('submit', async e => {
  e.preventDefault();
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim().toLowerCase();
  const password = document.getElementById('signupPassword').value.trim();
  
  if (!name || !email || !password) { 
    showNotification('Please fill all fields', 'error'); 
    return; 
  }

  // Show loading state
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Signing Up...';
  submitBtn.disabled = true;

  const result = await safeFetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'signup', name, email, password })
  });

  // Restore button state
  submitBtn.textContent = originalText;
  submitBtn.disabled = false;

  if (result.success && result.data.success) {
    showNotification(result.data.message, 'success');
    setCurrentUser({ name, email });
    closeModal(signupModal);
    updateHeader();
    // Refresh stats after signup
    fetchStats();
  } else {
    const errorMsg = result.success ? result.data.message : 'Network error during signup';
    showNotification(errorMsg, 'error');
  }
});

// === LOGIN → Google Sheet ===
document.getElementById('loginForm').addEventListener('submit', async e => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value.trim();
  
  if (!email || !password) {
    showNotification('Please fill all fields', 'error');
    return;
  }

  // Show loading state
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Logging In...';
  submitBtn.disabled = true;

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
  submitBtn.textContent = originalText;
  submitBtn.disabled = false;

  if (result.success && result.data.success) {
    const userData = {
      email,
      name: result.data.user?.name || email
    };
    setCurrentUser(userData);
    showNotification(result.data.message || 'Welcome back!', 'success');
    closeModal(loginModal);
    updateHeader();
    // Refresh stats after login
    fetchStats();
  } else {
    const errorMsg = result.success ? result.data.message : 'Network error during login';
    showNotification(errorMsg, 'error');
  }
});

// === DASHBOARD STATS ===
async function fetchStats() {
  const result = await safeFetch(GOOGLE_SCRIPT_URL);
  
  if (result.success && result.data.success && result.data.dashboard) {
    const stats = result.data.dashboard;
    document.getElementById('totalUsers').textContent = stats.totalUsers || 0;
    document.getElementById('totalLogins').textContent = stats.totalLogins || 0;
    document.getElementById('uniqueUsers').textContent = stats.uniqueUsers || stats['Unique Users'] || 0;
    
    // Update any additional stats if they exist
    if (stats.todayLogins) {
      const todayLoginsEl = document.getElementById('todayLogins');
      if (todayLoginsEl) todayLoginsEl.textContent = stats.todayLogins;
    }
    if (stats.newUsersToday) {
      const newUsersTodayEl = document.getElementById('newUsersToday');
      if (newUsersTodayEl) newUsersTodayEl.textContent = stats.newUsersToday;
    }
  } else {
    // Fallback to default values if fetch fails
    console.warn('Stats fetch failed, using fallback values');
    document.getElementById('totalUsers').textContent = '0';
    document.getElementById('totalLogins').textContent = '0';
    document.getElementById('uniqueUsers').textContent = '0';
  }
}

// === NEWSLETTER ===
document.getElementById('newsletterForm').addEventListener('submit', e => {
  e.preventDefault();
  const email = e.target.querySelector('input[type="email"]').value.trim();
  
  if (!email) {
    showNotification('Please enter your email', 'error');
    return;
  }
  
  showNotification('Thanks for subscribing! 📧');
  e.target.reset();
});

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
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
    notification.classList.remove('show');
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
  // Apply saved dark mode preference
  applyDarkMode(localStorage.getItem('mb_dark') === '1');
  
  // Initialize header and stats
  updateHeader();
  fetchStats();
  
  // Set up periodic stats refresh (every 30 seconds)
  setInterval(fetchStats, 30000);
  
  console.log('MelodyBox initialized successfully');
})();
