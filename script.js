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
function openModal(m){ m.style.display='flex'; }
function closeModal(m){ m.style.display='none'; }
document.addEventListener('click', e=>{
  if(e.target===loginModal) closeModal(loginModal);
  if(e.target===signupModal) closeModal(signupModal);
});
function showNotification(msg,type='success'){
  notification.textContent=msg;
  notification.className=`notification show ${type}`;
  setTimeout(()=>notification.classList.remove('show'),3000);
}

// === USER SESSION (local cache only) ===
function setCurrentUser(u){ localStorage.setItem('mb_current',JSON.stringify(u)); }
function getCurrentUser(){ const raw=localStorage.getItem('mb_current'); return raw?JSON.parse(raw):null; }
function logoutUser(){ localStorage.removeItem('mb_current'); showNotification('Logged out successfully!'); updateHeader(); }

function updateHeader(){
  const user=getCurrentUser();
  if(user){
    headerRight.innerHTML=`<span>👋 Welcome, <strong>${user.name}</strong></span>
      <button id="logoutBtn" class="btn btn-outline">Logout</button>`;
    document.getElementById('logoutBtn').addEventListener('click',logoutUser);
  }else{
    headerRight.innerHTML=`<button id="loginBtn" class="btn btn-outline">Login</button>
      <button id="signupBtn" class="btn btn-primary">Sign Up</button>`;
    document.getElementById('loginBtn').addEventListener('click',()=>openModal(loginModal));
    document.getElementById('signupBtn').addEventListener('click',()=>openModal(signupModal));
  }
}

// === SIGNUP → Google Sheet ===
document.getElementById('signupForm').addEventListener('submit',async e=>{
  e.preventDefault();
  const name=document.getElementById('signupName').value.trim();
  const email=document.getElementById('signupEmail').value.trim().toLowerCase();
  const password=document.getElementById('signupPassword').value.trim();
  if(!name||!email||!password){ showNotification('Please fill all fields','error'); return; }

  try{
    const res=await fetch(GOOGLE_SCRIPT_URL,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({action:'signup',name,email,password})
    });
    const text=await res.text();
    if(text.includes('User signed up')){
      showNotification('Signup successful! 🎉','success');
      setCurrentUser({name,email});
      closeModal(signupModal);
      updateHeader();
    }else if(text.includes('exists')){
      showNotification('Email already registered.','error');
    }else{
      showNotification(text,'error');
    }
  }catch(err){ showNotification('Network error during signup','error'); }
});

// === LOGIN → Google Sheet ===
document.getElementById('loginForm').addEventListener('submit',async e=>{
  e.preventDefault();
  const email=document.getElementById('loginEmail').value.trim().toLowerCase();
  const password=document.getElementById('loginPassword').value.trim();
  const ipAddress = await fetch("https://api.ipify.org?format=json").then(r=>r.json()).then(j=>j.ip).catch(()=>'');

  try{
    const res=await fetch(GOOGLE_SCRIPT_URL,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({action:'login',email,password,ipAddress})
    });
    const text=await res.text();
    if(text.includes('Login success')){
      setCurrentUser({email});
      showNotification('Welcome back!','success');
      closeModal(loginModal);
      updateHeader();
    }else{
      showNotification('Invalid credentials','error');
    }
  }catch(err){ showNotification('Network error during login','error'); }
});

// === DASHBOARD STATS ===
async function fetchStats(){
  try{
    const res=await fetch(GOOGLE_SCRIPT_URL);
    const data=await res.json();
    if(data.dashboard){
      document.getElementById('totalUsers').textContent=data.dashboard.totalUsers||0;
      document.getElementById('totalLogins').textContent=data.dashboard.totalLogins||0;
      document.getElementById('uniqueUsers').textContent=data.dashboard['Unique Users']||0;
    }
  }catch(e){ console.warn('Stats fetch failed',e); }
}

// === NEWSLETTER ===
document.getElementById('newsletterForm').addEventListener('submit',e=>{
  e.preventDefault();
  showNotification('Thanks for subscribing! 📧');
  e.target.reset();
});

// === ENROLL ===
function enrollCourse(course){
  const u=getCurrentUser();
  if(u) showNotification(`You enrolled in "${course}" 🎓`);
  else { showNotification('Please log in first','error'); openModal(loginModal); }
}

// === PDF EXPORT ===
if(downloadPdfBtn){
  downloadPdfBtn.addEventListener('click',()=>{
    document.querySelectorAll('.modal').forEach(m=>m.style.display='none');
    notification.classList.remove('show');
    window.print(); // user chooses “Save as PDF”
  });
}

// === DARK MODE ===
function applyDarkMode(on){ 
  document.body.classList.toggle('dark',on);
  localStorage.setItem('mb_dark',on?'1':'0');
}
if(darkModeToggle){
  darkModeToggle.addEventListener('click',()=>{
    const enabled=!document.body.classList.contains('dark');
    applyDarkMode(enabled);
  });
}

// === INIT ===
(function(){
  applyDarkMode(localStorage.getItem('mb_dark')==='1');
  updateHeader();
  fetchStats();
})();
