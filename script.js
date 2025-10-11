// ========================
// Global State
// ========================
let currentUser = null;
let scriptUrl = localStorage.getItem('scriptUrl') || 'https://script.google.com/macros/s/AKfycbzGQAA0wpzp4o5MuxGDJeQQKoStf10wjGwCs8ySxd_HsXl6Dt2ILFjWavhaUpasTibX5A/exec';

// ========================
// Sample Data
// ========================
const courses = [
  { id: 1, title: "Web Development Bootcamp", platform: "Udemy", price: 89.99, rating: 4.8, students: 12500, image: "https://picsum.photos/seed/webdev/400/250", link: "https://www.udemy.com/course/web-development-bootcamp/" },
  { id: 2, title: "Machine Learning A-Z", platform: "Coursera", price: 129.99, rating: 4.9, students: 8900, image: "https://picsum.photos/seed/ml/400/250", link: "https://www.coursera.org/learn/machine-learning" },
  { id: 3, title: "Digital Marketing Mastery", platform: "Udemy", price: 79.99, rating: 4.7, students: 15600, image: "https://picsum.photos/seed/marketing/400/250", link: "https://www.udemy.com/course/digital-marketing-mastery/" },
  { id: 4, title: "Data Science Fundamentals", platform: "edX", price: 99.99, rating: 4.8, students: 10200, image: "https://picsum.photos/seed/datascience/400/250", link: "https://www.edx.org/learn/data-science" },
  { id: 5, title: "UI/UX Design Principles", platform: "Udemy", price: 69.99, rating: 4.6, students: 7800, image: "https://picsum.photos/seed/uiux/400/250", link: "https://www.udemy.com/course/ui-ux-design-principles/" },
  { id: 6, title: "Blockchain Development", platform: "Coursera", price: 149.99, rating: 4.9, students: 5600, image: "https://picsum.photos/seed/blockchain/400/250", link: "https://www.coursera.org/learn/blockchain-basics" }
];

const platforms = [
  { name: "Udemy", icon: "🎓", description: "50,000+ courses", link: "https://www.udemy.com" },
  { name: "Coursera", icon: "🎯", description: "University courses", link: "https://www.coursera.org" },
  { name: "edX", icon: "📚", description: "Top university programs", link: "https://www.edx.org" },
  { name: "Skillshare", icon: "🎨", description: "Creative skills", link: "https://www.skillshare.com" },
  { name: "LinkedIn Learning", icon: "💼", description: "Professional development", link: "https://www.linkedin.com/learning" },
  { name: "Pluralsight", icon: "🔧", description: "Technology courses", link: "https://www.pluralsight.com" },
  { name: "Khan Academy", icon: "📖", description: "Free education", link: "https://www.khanacademy.org" },
  { name: "Codecademy", icon: "💻", description: "Learn to code", link: "https://www.codecademy.com" }
];

// ========================
// Page Initialization
// ========================
document.addEventListener('DOMContentLoaded', () => {
  loadCourses();
  loadPlatforms();
  loadStats();
  trackSiteVisit();
  checkAuthStatus();
  syncWithGoogleSheets();
});

// ========================
// Visit Tracking
// ========================
function trackSiteVisit() {
  let visits = parseInt(localStorage.getItem('siteVisits') || '0') + 1;
  localStorage.setItem('siteVisits', visits);
  document.getElementById('siteVisits').textContent = visits;
}

// ========================
// Load Statistics
// ========================
async function loadStats() {
  let siteVisits = parseInt(localStorage.getItem('siteVisits') || '0');
  document.getElementById('siteVisits').textContent = siteVisits;

  if (!scriptUrl) return;

  try {
    const response = await callGoogleSheetsAPI('getStats');
    if (response.status === 'success' && response.stats) {
      document.getElementById('totalUsers').textContent = response.stats.totalUsers || 0;
      document.getElementById('totalLogins').textContent = response.stats.totalLogins || 0;
      document.getElementById('todayLogins').textContent = response.stats.todayLogins || 0;
    }
  } catch (error) {
    console.warn('Stats not available:', error.message);
  }
}

// ========================
// Google Sheets Sync
// ========================
async function syncWithGoogleSheets() {
  if (!scriptUrl) return;

  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    for (const user of users) {
      try {
        await callGoogleSheetsAPI('signup', user);
      } catch {
        console.log(`User already exists in Google Sheets: ${user.email}`);
      }
    }
  } catch (error) {
    console.error('Sync error:', error);
  }
}

// ========================
// Google Sheets API
// ========================
function callGoogleSheetsAPI(action, params = {}) {
  return new Promise((resolve, reject) => {
    if (!scriptUrl) return reject(new Error('Script URL not configured'));

    const url = new URL(scriptUrl);
    url.searchParams.append('action', action);
    Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));

    fetch(url)
      .then(r => r.json())
      .then(d => d.status === 'success' ? resolve(d) : reject(new Error(d.message || 'API Error')))
      .catch(reject);
  });
}

// ========================
// Authentication
// ========================
async function checkAuthStatus() {
  const saved = localStorage.getItem('currentUser');
  if (saved) {
    currentUser = JSON.parse(saved);
    updateUIForLoggedInUser();
  }
}

function updateUIForLoggedInUser() {
  document.getElementById('authButtons').style.display = 'none';
  document.getElementById('userMenu').style.display = 'flex';
  document.getElementById('userName').textContent = currentUser.name;
}

function updateUIForLoggedOutUser() {
  document.getElementById('authButtons').style.display = 'flex';
  document.getElementById('userMenu').style.display = 'none';
}

// ========================
// Login
// ========================
async function handleLogin(e) {
  e.preventDefault();
  const email = loginEmail.value;
  const password = loginPassword.value;
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) return showNotification('Invalid email or password', 'error');

  user.lastLogin = new Date().toISOString();
  localStorage.setItem('users', JSON.stringify(users));
  currentUser = { name: user.name, email: user.email };
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  updateUIForLoggedInUser();
  closeLoginModal();
  showNotification('Login successful!', 'success');
  loadStats();

  if (scriptUrl) {
    try {
      await callGoogleSheetsAPI('login', { email, password });
    } catch (err) {
      console.warn('Login sync failed:', err.message);
    }
  }
}

// ========================
// Signup
// ========================
async function handleSignup(e) {
  e.preventDefault();
  const name = signupName.value;
  const email = signupEmail.value;
  const password = signupPassword.value;
  const users = JSON.parse(localStorage.getItem('users') || '[]');

  if (users.some(u => u.email === email))
    return showNotification('Email already exists', 'error');

  const newUser = { id: Date.now(), name, email, password, joinTime: new Date().toISOString(), lastLogin: new Date().toISOString() };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));

  currentUser = { name, email };
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  updateUIForLoggedInUser();
  closeSignupModal();
  showNotification('Signup successful!', 'success');
  loadStats();

  if (scriptUrl) {
    try {
      await callGoogleSheetsAPI('signup', newUser);
    } catch (err) {
      console.warn('Signup sync failed:', err.message);
    }
  }
}

function logout() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  updateUIForLoggedOutUser();
  showNotification('Logged out successfully', 'info');
}

// ========================
// Modals & Config
// ========================
function openLoginModal() { loginModal.classList.remove('hidden'); }
function closeLoginModal() { loginModal.classList.add('hidden'); }
function openSignupModal() { signupModal.classList.remove('hidden'); }
function closeSignupModal() { signupModal.classList.add('hidden'); }

function openConfigModal() {
  configModal.classList.remove('hidden');
  scriptUrlInput.value = scriptUrl;
}
function closeConfigModal() { configModal.classList.add('hidden'); }

function saveScriptUrl() {
  const url = scriptUrlInput.value.trim();
  if (!url) return showNotification('Please enter a valid URL', 'error');
  localStorage.setItem('scriptUrl', url);
  scriptUrl = url;
  closeConfigModal();
  showNotification('Configuration saved!', 'success');
  loadStats();
}

// ========================
// Courses & Platforms
// ========================
function loadCourses() {
  coursesGrid.innerHTML = courses.map(c => `
    <div class="card card-hover">
      <img src="${c.image}" alt="${c.title}">
      <div class="card-content">
        <div style="display:flex;justify-content:space-between;margin-bottom:.5rem;">
          <span style="font-size:.75rem;background:#ede9fe;color:#7c3aed;padding:.25rem .5rem;border-radius:9999px;">${c.platform}</span>
          <span style="color:#f59e0b;">⭐ ${c.rating}</span>
        </div>
        <h3 class="card-title">${c.title}</h3>
        <p>${c.students.toLocaleString()} students enrolled</p>
        <div class="card-footer">
          <span class="price">$${c.price}</span>
          <button onclick="openCourse('${c.link}')" class="btn btn-primary">View Course</button>
        </div>
      </div>
    </div>
  `).join('');
}

function loadPlatforms() {
  platformsGrid.innerHTML = platforms.map(p => `
    <div class="platform-card" onclick="openPlatform('${p.link}')">
      <div class="platform-icon">${p.icon}</div>
      <h3>${p.name}</h3>
      <p>${p.description}</p>
    </div>
  `).join('');
}

function openCourse(link) {
  if (!currentUser) return showNotification('Please login to access courses', 'warning');
  window.open(link, '_blank');
}
function openPlatform(link) {
  if (!currentUser) return showNotification('Please login to access platforms', 'warning');
  window.open(link, '_blank');
}

// ========================
// Utilities
// ========================
function showNotification(msg, type = 'info') {
  const container = document.getElementById('notificationContainer');
  const div = document.createElement('div');
  const colors = { success: '#10b981', warning: '#f59e0b', error: '#ef4444', info: '#3b82f6' };
  const icons = { success: '✅', warning: '⚠️', error: '❌', info: 'ℹ️' };

  div.className = 'notification';
  div.style.background = colors[type];
  div.innerHTML = `<span>${icons[type]}</span> ${msg}`;
  container.appendChild(div);
  setTimeout(() => { div.style.opacity = '0'; setTimeout(() => div.remove(), 300); }, 3000);
}

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById(link.getAttribute('href').substring(1)).scrollIntoView({ behavior: 'smooth' });
  });
});
