// Global variables
let restaurants = [];
let menus = {};
const container = document.getElementById("restaurants");
const menuView = document.getElementById("menuView");
let currentSlide = 0;
let sliderInterval;

// Load data from JSON files
async function loadData() {
  try {
    const [restaurantsResponse, menusResponse] = await Promise.all([
      fetch('data/restaurants.json'),
      fetch('data/menus.json')
    ]);
    
    restaurants = await restaurantsResponse.json();
    menus = await menusResponse.json();
    
    renderRestaurants(restaurants);
    initializeSearch();
    initializeSlider();
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// Initialize hero slider with trending restaurants
function initializeSlider() {
  // Get top 5 rated restaurants for the slider
  const trendingRestaurants = [...restaurants]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);
  
  const sliderContainer = document.querySelector('.slider-container');
  const dotsContainer = document.getElementById('sliderDots');
  
  sliderContainer.innerHTML = '';
  dotsContainer.innerHTML = '';
  
  trendingRestaurants.forEach((restaurant, index) => {
    // Create slide
    const slide = document.createElement('div');
    slide.className = `slide ${index === 0 ? 'active' : ''}`;
    slide.id = `slide${index}`;
    slide.style.backgroundImage = `url('${restaurant.images[0]}')`;
    
    slide.innerHTML = `
      <div class="slide-content">
        <h2>🔥 ${restaurant.name}</h2>
        <div class="rating">⭐ ${restaurant.rating} Rating</div>
        <p class="speciality">${restaurant.speciality}</p>
        <p>📍 ${restaurant.address}</p>
        <p>🕐 ${restaurant.hours}</p>
        <div class="badges">
          ${restaurant.organic ? '<span class="badge">🌿 Organic</span>' : ''}
          ${restaurant.is_home_made ? '<span class="badge">🏠 Home-made</span>' : ''}
        </div>
      </div>
    `;
    
    sliderContainer.appendChild(slide);
    
    // Create dot
    const dot = document.createElement('span');
    dot.className = `dot ${index === 0 ? 'active' : ''}`;
    dot.onclick = () => goToSlide(index);
    dotsContainer.appendChild(dot);
  });
  
  // Start auto-slide
  startSlider();
}

// Change slide
function changeSlide(direction) {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  
  currentSlide = (currentSlide + direction + slides.length) % slides.length;
  
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
  
  // Reset auto-slide timer
  clearInterval(sliderInterval);
  startSlider();
}

// Go to specific slide
function goToSlide(index) {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  
  currentSlide = index;
  
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
  
  // Reset auto-slide timer
  clearInterval(sliderInterval);
  startSlider();
}

// Start auto-slide
function startSlider() {
  sliderInterval = setInterval(() => {
    changeSlide(1);
  }, 5000); // Change slide every 5 seconds
}

// Render restaurant cards
function renderRestaurants(list) {
  container.innerHTML = "";
  list.forEach(r => {
    const div = document.createElement("div");
    div.className = "restaurant-card";
    div.innerHTML = `
      <h2>${r.name} ⭐ ${r.rating}</h2>
      <p><strong>Speciality:</strong> ${r.speciality}</p>
      ${r.organic ? '<span class="badge organic">Organic</span>' : ''}
      ${r.is_home_made ? '<span class="badge homemade">Home-made</span>' : ''}
    `;
    div.onclick = () => showMenu(r.id, r.name);
    container.appendChild(div);
  });
}

// Show menu view
function showMenu(id, name) {
  container.style.opacity = "0";
  document.querySelector('.search-bar').style.display = 'none';
  document.getElementById('heroSlider').style.display = 'none';
  const restaurant = restaurants.find(r => r.id === id);
  
  setTimeout(() => {
    container.style.display = "none";
    menuView.style.display = "block";
    menuView.style.opacity = "0";
    
    const menuItems = menus[id].map(i => `
      <div class="menu-card">
        <img src="${i.img}" alt="${i.name}" class="item-image">
        <div class="item-content">
          <div class="item-name">${i.name}</div>
          <div class="item-details">
            <div class="item-price">${i.price}</div>
            <div class="item-rating">⭐ ${i.rating}</div>
          </div>
        </div>
      </div>
    `).join("");
    
    const dineOutMenu = menus[id].map(i => `
      <div class="dine-menu-card">
        <img src="${i.img}" alt="${i.name}">
        <div class="dine-menu-card-info">
          <div class="dine-menu-card-name">${i.name}</div>
          <div class="dine-menu-card-details">
            <span class="dine-menu-card-price">${i.price}</span>
            <span class="dine-menu-card-rating">⭐ ${i.rating}</span>
          </div>
        </div>
      </div>
    `).join("");
    
    const galleryImages = restaurant.images.map(img => `
      <img src="${img}" alt="${name} ambience" class="gallery-image">
    `).join("");
    
    menuView.innerHTML = `
      <h2>${name}</h2>
      <div class="tabs-container">
        <button class="tab-btn active" onclick="switchTab('order-online')">🛵 Order Online</button>
        <button class="tab-btn" onclick="switchTab('dine-out')">🍽️ Dine Out</button>
      </div>
      <div id="order-online" class="tab-content active">
        ${menuItems}
      </div>
      <div id="dine-out" class="tab-content">
        <div class="dine-out-container">
          <div class="restaurant-info">
            <div class="info-item">
              <strong>📍 Address:</strong>
              <span>${restaurant.address}</span>
            </div>
            <div class="info-item">
              <strong>📞 Phone:</strong>
              <span>${restaurant.phone}</span>
            </div>
            <div class="info-item">
              <strong>⏰ Hours:</strong>
              <span>${restaurant.hours}</span>
            </div>
          </div>
          <div class="action-buttons">
            <button class="action-btn call-btn" onclick="window.open('tel:${restaurant.phone}')">
              📞 Call Now
            </button>
            <button class="action-btn direction-btn" onclick="window.open('https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}', '_blank')">
              🗺️ Get Directions
            </button>
          </div>
          <div class="restaurant-gallery">
            ${galleryImages}
          </div>
          <h3 class="menu-section-title">Our Menu</h3>
          <div class="dine-out-menu">
            ${dineOutMenu}
          </div>
        </div>
      </div>
      <button class="back-btn" onclick="goBack()">⬅ Back</button>
    `;
    
    setTimeout(() => menuView.style.opacity = "1", 100);
  }, 500);
}

// Switch between tabs
function switchTab(tabName) {
  // Remove active class from all tabs and content
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  
  // Add active class to clicked tab and corresponding content
  event.target.classList.add('active');
  document.getElementById(tabName).classList.add('active');
}

// Go back to restaurant grid (from menu view)
function goBack() {
  menuView.style.opacity = "0";
  document.getElementById('contactView').style.display = 'none';
  document.getElementById('compareView').style.display = 'none';
  setTimeout(() => {
    menuView.style.display = "none";
    container.style.display = "grid";
    document.querySelector('.search-bar').style.display = 'block';
    document.getElementById('heroSlider').style.display = 'block';
    setTimeout(() => container.style.opacity = "1", 100);
  }, 500);
}

// Show home page with slider
function showHome() {
  menuView.style.opacity = "0";
  document.getElementById('contactView').style.display = 'none';
  document.getElementById('compareView').style.display = 'none';
  setTimeout(() => {
    menuView.style.display = "none";
    container.style.display = "grid";
    document.querySelector('.search-bar').style.display = 'block';
    document.getElementById('heroSlider').style.display = 'block';
    setTimeout(() => container.style.opacity = "1", 100);
  }, 500);
}

// Show only restaurant list (no slider)
function showRestaurants() {
  menuView.style.opacity = "0";
  document.getElementById('contactView').style.display = 'none';
  document.getElementById('compareView').style.display = 'none';
  document.getElementById('heroSlider').style.display = 'none';
  setTimeout(() => {
    menuView.style.display = "none";
    container.style.display = "grid";
    document.querySelector('.search-bar').style.display = 'block';
    setTimeout(() => container.style.opacity = "1", 100);
  }, 500);
}

// Show contact page
function showContact() {
  container.style.opacity = "0";
  menuView.style.display = "none";
  document.querySelector('.search-bar').style.display = 'none';
  document.getElementById('heroSlider').style.display = 'none';
  setTimeout(() => {
    container.style.display = "none";
    const contactView = document.getElementById('contactView');
    contactView.style.display = 'block';
    setTimeout(() => contactView.style.opacity = "1", 100);
  }, 500);
}

// Show compare page
function showCompare() {
  container.style.opacity = "0";
  menuView.style.display = "none";
  document.getElementById('contactView').style.display = 'none';
  document.querySelector('.search-bar').style.display = 'none';
  document.getElementById('heroSlider').style.display = 'none';
  
  setTimeout(() => {
    container.style.display = "none";
    const compareView = document.getElementById('compareView');
    compareView.style.display = 'block';
    
    // Populate restaurant dropdowns
    const select1 = document.getElementById('restaurant1');
    const select2 = document.getElementById('restaurant2');
    select1.innerHTML = '<option value="">Select Restaurant</option>';
    select2.innerHTML = '<option value="">Select Restaurant</option>';
    
    restaurants.forEach(r => {
      select1.innerHTML += `<option value="${r.id}">${r.name} ⭐ ${r.rating}</option>`;
      select2.innerHTML += `<option value="${r.id}">${r.name} ⭐ ${r.rating}</option>`;
    });
    
    setTimeout(() => compareView.style.opacity = "1", 100);
  }, 500);
}

// Update comparison when restaurants are selected
function updateComparison() {
  const id1 = document.getElementById('restaurant1').value;
  const id2 = document.getElementById('restaurant2').value;
  const resultDiv = document.getElementById('comparisonResult');
  
  if (!id1 || !id2) {
    resultDiv.innerHTML = '<p style="color:#666; margin-top:30px;">Please select both restaurants to compare</p>';
    return;
  }
  
  if (id1 === id2) {
    resultDiv.innerHTML = '<p style="color:#ff5722; margin-top:30px;">Please select different restaurants to compare</p>';
    return;
  }
  
  const restaurant1 = restaurants.find(r => r.id === parseInt(id1));
  const restaurant2 = restaurants.find(r => r.id === parseInt(id2));
  const menu1 = menus[id1];
  const menu2 = menus[id2];
  
  // Calculate average prices
  const avgPrice1 = menu1.reduce((sum, item) => sum + parseInt(item.price.replace('₹', '')), 0) / menu1.length;
  const avgPrice2 = menu2.reduce((sum, item) => sum + parseInt(item.price.replace('₹', '')), 0) / menu2.length;
  
  // Calculate average ratings
  const avgRating1 = menu1.reduce((sum, item) => sum + item.rating, 0) / menu1.length;
  const avgRating2 = menu2.reduce((sum, item) => sum + item.rating, 0) / menu2.length;
  
  resultDiv.innerHTML = `
    <div style="display:grid; grid-template-columns:1fr auto 1fr; gap:20px; margin-top:30px;">
      <!-- Restaurant 1 -->
      <div style="background:#faf7f2; padding:30px; border-radius:15px; text-align:center;">
        <h3 style="color:#ff5722; font-size:24px; margin-bottom:15px;">${restaurant1.name}</h3>
        <div style="margin-bottom:20px;">
          <div style="font-size:14px; color:#666; margin-bottom:5px;">Overall Rating</div>
          <div style="font-size:28px; color:#d4af37; font-weight:bold;">⭐ ${restaurant1.rating}</div>
        </div>
        <div style="margin-bottom:20px;">
          <div style="font-size:14px; color:#666; margin-bottom:5px;">Avg Menu Rating</div>
          <div style="font-size:24px; color:#ff9800; font-weight:bold;">${avgRating1.toFixed(1)}</div>
        </div>
        <div style="margin-bottom:20px;">
          <div style="font-size:14px; color:#666; margin-bottom:5px;">Avg Price</div>
          <div style="font-size:24px; color:#4CAF50; font-weight:bold;">₹${avgPrice1.toFixed(0)}</div>
        </div>
        <div style="margin-bottom:20px;">
          <div style="font-size:14px; color:#666; margin-bottom:5px;">Speciality</div>
          <div style="font-size:16px; color:#333; font-weight:600;">${restaurant1.speciality}</div>
        </div>
        <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
          ${restaurant1.organic ? '<span style="background:#4CAF50; color:white; padding:6px 12px; border-radius:15px; font-size:12px; font-weight:600;">Organic</span>' : ''}
          ${restaurant1.is_home_made ? '<span style="background:#FF9800; color:white; padding:6px 12px; border-radius:15px; font-size:12px; font-weight:600;">Home-made</span>' : ''}
        </div>
      </div>
      
      <!-- VS -->
      <div style="display:flex; align-items:center; justify-content:center; font-size:36px; font-weight:bold; color:#d4af37;">
        VS
      </div>
      
      <!-- Restaurant 2 -->
      <div style="background:#faf7f2; padding:30px; border-radius:15px; text-align:center;">
        <h3 style="color:#ff5722; font-size:24px; margin-bottom:15px;">${restaurant2.name}</h3>
        <div style="margin-bottom:20px;">
          <div style="font-size:14px; color:#666; margin-bottom:5px;">Overall Rating</div>
          <div style="font-size:28px; color:#d4af37; font-weight:bold;">⭐ ${restaurant2.rating}</div>
        </div>
        <div style="margin-bottom:20px;">
          <div style="font-size:14px; color:#666; margin-bottom:5px;">Avg Menu Rating</div>
          <div style="font-size:24px; color:#ff9800; font-weight:bold;">${avgRating2.toFixed(1)}</div>
        </div>
        <div style="margin-bottom:20px;">
          <div style="font-size:14px; color:#666; margin-bottom:5px;">Avg Price</div>
          <div style="font-size:24px; color:#4CAF50; font-weight:bold;">₹${avgPrice2.toFixed(0)}</div>
        </div>
        <div style="margin-bottom:20px;">
          <div style="font-size:14px; color:#666; margin-bottom:5px;">Speciality</div>
          <div style="font-size:16px; color:#333; font-weight:600;">${restaurant2.speciality}</div>
        </div>
        <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
          ${restaurant2.organic ? '<span style="background:#4CAF50; color:white; padding:6px 12px; border-radius:15px; font-size:12px; font-weight:600;">Organic</span>' : ''}
          ${restaurant2.is_home_made ? '<span style="background:#FF9800; color:white; padding:6px 12px; border-radius:15px; font-size:12px; font-weight:600;">Home-made</span>' : ''}
        </div>
      </div>
    </div>
    
    <!-- Menu Comparison -->
    <div style="margin-top:40px;">
      <h3 style="color:#d4af37; font-size:24px; margin-bottom:20px;">Menu Items Comparison</h3>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; max-height:400px; overflow-y:auto;">
        <div>
          <h4 style="color:#ff5722; margin-bottom:15px; position:sticky; top:0; background:rgba(255,255,255,0.95); padding:10px 0;">${restaurant1.name} Menu</h4>
          ${menu1.map(item => `
            <div style="background:white; padding:15px; margin-bottom:10px; border-radius:10px; border-left:4px solid #d4af37;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-weight:600; color:#333;">${item.name}</span>
                <span style="color:#4CAF50; font-weight:bold;">${item.price}</span>
              </div>
              <div style="color:#ff9800; font-size:14px; margin-top:5px;">⭐ ${item.rating}</div>
            </div>
          `).join('')}
        </div>
        
        <div>
          <h4 style="color:#ff5722; margin-bottom:15px; position:sticky; top:0; background:rgba(255,255,255,0.95); padding:10px 0;">${restaurant2.name} Menu</h4>
          ${menu2.map(item => `
            <div style="background:white; padding:15px; margin-bottom:10px; border-radius:10px; border-left:4px solid #d4af37;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-weight:600; color:#333;">${item.name}</span>
                <span style="color:#4CAF50; font-weight:bold;">${item.price}</span>
              </div>
              <div style="color:#ff9800; font-size:14px; margin-top:5px;">⭐ ${item.rating}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// Initialize search functionality
function initializeSearch() {
  document.getElementById("search").addEventListener("input", e => {
    const q = e.target.value.toLowerCase();
    const filtered = restaurants.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.speciality.toLowerCase().includes(q) ||
      String(r.rating).includes(q) ||
      (q.includes("organic") && r.organic) ||
      (q.includes("home") && r.is_home_made)
    );
    renderRestaurants(filtered);
  });
}

// Initialize app
document.addEventListener('DOMContentLoaded', loadData);
