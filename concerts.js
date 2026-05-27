// ================= CONCERT DATA =================
let concerts = [
  {
    name: "Arijit Singh",
    tourName: "Chaleya India Tour 2026",
    genre: "Bollywood, Soulful, Pop",
    age: "All Ages",
    rating: 4.9,
    city: "Mumbai",
    month: "March",
    date: "15 March 2026",
    time: "7:00 PM",
    venue: "Jio World Garden",
    price: 500,
    img: "images/arijit.jpg",
    popularity: 98,
    dateVal: "2026-03-15",
    previewUrl: "https://www.youtube.com/embed/VwDM7g_h1wE"
  },
  {
    name: "Neha Kakkar",
    tourName: "The Selfie Queen Tour",
    genre: "Bollywood, Dance, Pop",
    age: "All Ages",
    rating: 4.3,
    city: "Delhi",
    month: "April",
    date: "10 April 2026",
    time: "6:30 PM",
    venue: "Indira Gandhi Arena",
    price: 400,
    img: "images/neha.jpg",
    popularity: 82,
    dateVal: "2026-04-10",
    previewUrl: "https://www.youtube.com/embed/xL8qH_eA19A"
  },
  {
    name: "Badshah",
    tourName: "Pagaldepan Arena Show",
    genre: "Hip Hop, Punjabi, Rap",
    age: "16+",
    rating: 4.6,
    city: "Bangalore",
    month: "May",
    date: "22 May 2026",
    time: "8:00 PM",
    venue: "Manpho Convention Centre",
    price: 600,
    img: "images/badshah.jpg",
    popularity: 88,
    dateVal: "2026-05-22",
    previewUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    name: "Shreya Ghoshal",
    tourName: "Symphony of Lights Tour",
    genre: "Classical, Bollywood, Semi-Classical",
    age: "All Ages",
    rating: 4.8,
    city: "Mumbai",
    month: "June",
    date: "05 June 2026",
    time: "7:30 PM",
    venue: "Dome, NSCI",
    price: 550,
    img: "images/shreya.jpg",
    popularity: 94,
    dateVal: "2026-06-05",
    previewUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    name: "Yo Yo Honey Singh",
    tourName: "Glory Comeback Stadium Tour",
    genre: "Rap, Punjabi Pop, Club",
    age: "18+",
    rating: 4.7,
    city: "Delhi",
    month: "May",
    date: "12 May 2026",
    time: "8:30 PM",
    venue: "JLN Stadium",
    price: 800,
    img: "images/honey-singh.jpg",
    popularity: 90,
    dateVal: "2026-05-12",
    previewUrl: "https://www.youtube.com/embed/4gCo7H8H_Sg"
  },
  {
    name: "Aditya Gadhvi",
    tourName: "Gotilo Heritage Concert Tour",
    genre: "Folk, Gujarati Fusion, Sufi",
    age: "All Ages",
    rating: 4.5,
    city: "Mumbai",
    month: "April",
    date: "25 April 2026",
    time: "7:00 PM",
    venue: "Nesco Center",
    price: 600,
    img: "images/aditya_gadhvi.jpg",
    popularity: 80,
    dateVal: "2026-04-25",
    previewUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    name: "Diljit Dosanjh",
    tourName: "Dil-Luminati Global Tour",
    genre: "Punjabi Pop, Bhangra, Dance",
    age: "All Ages",
    rating: 4.9,
    city: "Bangalore",
    month: "June",
    date: "18 June 2026",
    time: "8:00 PM",
    venue: "Bhartiya City",
    price: 1200,
    img: "images/diljit%20dosanjh.jpg",
    popularity: 99,
    dateVal: "2026-06-18",
    previewUrl: "https://www.youtube.com/embed/V6Wco2tP0Yw"
  }
];


// Comprehensive Multi-Tier Image Proxy Fallback Builder
function getImageFallbacks(primaryUrl) {
  const fallbacks = [];
  if (!primaryUrl) {
    return ['images/c_hero.jpg'];
  }
  
  if (!primaryUrl.startsWith('http')) {
    if (primaryUrl.includes('aditya_gadhvi.jpg')) {
      fallbacks.push('https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Aditya_Gadhvi_At_An_Event_In_Ahmedabad_2020.jpg/960px-Aditya_Gadhvi_At_An_Event_In_Ahmedabad_2020.jpg');
    }
    fallbacks.push('images/c_hero.jpg');
    return fallbacks;
  }

  let rawUrl = primaryUrl;
  if (primaryUrl.includes('weserv.nl/?url=')) {
    const parts = primaryUrl.split('weserv.nl/?url=');
    if (parts.length > 1) {
      rawUrl = decodeURIComponent(parts[1]);
      if (!rawUrl.startsWith('http')) {
        rawUrl = 'https://' + rawUrl;
      }
    }
  } else if (primaryUrl.includes('.wp.com/')) {
    const parts = primaryUrl.split('.wp.com/');
    if (parts.length > 1) {
      rawUrl = 'https://' + parts[1];
    }
  }

  const cleanUrl = rawUrl.replace(/^https?:\/\//, '');

  if (rawUrl !== primaryUrl) {
    fallbacks.push(rawUrl);
  }
  
  fallbacks.push(`https://i0.wp.com/${cleanUrl}`);
  fallbacks.push('images/c_hero.jpg');

  const unique = [...new Set(fallbacks)];
  return unique.filter(url => url !== primaryUrl);
}

function handleConcertImgError(img) {
  let index = parseInt(img.getAttribute('data-fallback-index') || '0', 10);
  let fallbacks = [];
  try {
    const rawFallbacks = img.getAttribute('data-fallbacks');
    if (rawFallbacks) {
      fallbacks = JSON.parse(rawFallbacks);
    }
  } catch (e) {
    console.error("Error parsing fallbacks:", e);
  }
  
  if (index < fallbacks.length) {
    const nextSrc = fallbacks[index];
    img.setAttribute('data-fallback-index', index + 1);
    console.log(`Failed to load ${img.src}. Trying fallback tier ${index + 1}: ${nextSrc}`);
    img.src = nextSrc;
  } else {
    img.onerror = null;
    img.src = 'images/c_hero.jpg';
    console.log(`All fallbacks failed for ${img.alt}. Swapped to local placeholder.`);
  }
}

// ================= LAST.FM API INTEGRATION =================
async function loadArtistLastFmData(artistName, index, localImg, imgElementId) {
  const apiKey = ''; // Kept empty client-side. Real key is in .env in backend.
  const hasProxy = typeof API_CONFIG !== 'undefined' && !!API_CONFIG.BACKEND_API_URL;
  if (!hasProxy && (!apiKey || apiKey === "YOUR_API_KEY_HERE")) {
    // If no proxy and no local key, skip fetching bio
    return;
  }
  const url = hasProxy
    ? `${API_CONFIG.BACKEND_API_URL}/api/lastfm/artist?artist=${encodeURIComponent(artistName)}`
    : `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(artistName)}&api_key=${apiKey}&format=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.artist) {
      const artist = data.artist;
      const bioElement = document.getElementById(`bio-${index}`);
      if (bioElement && artist.bio && artist.bio.summary) {
        let bioText = artist.bio.summary;
        const linkIndex = bioText.indexOf('<a href=');
        if (linkIndex !== -1) {
          bioText = bioText.substring(0, linkIndex);
        }
        bioElement.innerHTML = bioText.trim() || `Caught live! Catch ${artistName} performing their top chartbusters in an spectacular show.`;
      }
    }
  } catch (error) {
    console.warn(`Last.fm load failed for ${artistName}:`, error);
    const bioElement = document.getElementById(`bio-${index}`);
    if (bioElement) {
      bioElement.innerHTML = `An incredible musical journey! Capture the spellbinding energy of ${artistName} performing live.`;
    }
  }
}

// ================= DISPLAY CONCERTS =================
function displayConcerts(data) {
  let container = document.getElementById("concertList");
  if (!container) return;
  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = `
      <div class="w-100 text-center py-5 text-secondary" style="grid-column: 1 / -1; background: rgba(18, 11, 34, 0.65); border: 1px solid rgba(177,34,229,0.2); border-radius: 16px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
        <i class="bi bi-music-note-beamed fs-1 mb-3 d-block text-danger"></i>
        <h5 class="text-white">No live tours found</h5>
        <p class="small">Try resetting or adjusting your match day filters.</p>
      </div>
    `;
    return;
  }

  let html = "";
  data.forEach((c, index) => {
    const imgId = `concert-img-${index}`;
    const fallbacks = getImageFallbacks(c.img);

    // Color-code age badge
    let ageColor = "bg-success border border-success";
    if (c.age === "16+") ageColor = "bg-warning text-dark border border-warning";
    if (c.age === "18+") ageColor = "bg-danger border border-danger";

    html += `
    <div class="card text-white mb-4 concert-card-neon stage-card-wrapper">
      <div class="row g-0 align-items-center stage-light-glow">
        
        <!-- Image Section -->
        <div class="col-md-4 col-lg-3 position-relative" style="overflow:hidden;">
          <img src="${c.img}" 
               id="${imgId}"
               class="img-fluid" 
               alt="${c.name}" 
               style="width: 100%; height: 260px; object-fit: cover; transition: transform 0.5s ease;"
               data-fallbacks='${JSON.stringify(fallbacks)}'
               data-fallback-index="0"
               onerror="handleConcertImgError(this)"
               loading="lazy"
               referrerpolicy="no-referrer"
               onmouseover="this.style.transform='scale(1.08)'"
               onmouseout="this.style.transform='scale(1.0)'">
          <span class="badge ${ageColor} position-absolute top-3 start-3 px-3 py-2 rounded-pill fw-bold" style="font-size:0.75rem; letter-spacing:0.5px; z-index: 5;">
            <i class="bi bi-shield-fill-check me-1"></i>${c.age}
          </span>
        </div>
        
        <!-- Content Section -->
        <div class="col-md-8 col-lg-9">
          <div class="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center p-4" style="position:relative; z-index:2;">
            
            <!-- Details -->
            <div class="mb-3 mb-md-0">
              <div class="d-flex align-items-center gap-3 mb-2">
                <h3 class="card-title fw-bold mb-0 text-white" style="font-size: 1.8rem;">${c.name}</h3>
                <div class="equalizer-container" title="Live Event Active">
                  <div class="equalizer-bar"></div>
                  <div class="equalizer-bar"></div>
                  <div class="equalizer-bar"></div>
                  <div class="equalizer-bar"></div>
                </div>
              </div>
              
              <h5 class="text-info fw-bold mb-3" style="font-size: 1.05rem; letter-spacing: 0.5px; color:#b122e5 !important;">${c.tourName}</h5>
              
              <div class="d-flex flex-wrap gap-3 text-secondary mb-3" style="font-size: 0.95rem;">
                <span class="badge bg-dark bg-opacity-50 text-warning border border-warning px-2.5 py-1.5"><i class="bi bi-star-fill me-1"></i>⭐ ${c.rating ? c.rating.toFixed(1) : 'TBA'}/5</span>
                <span class="badge bg-dark bg-opacity-50 text-info border border-info px-2.5 py-1.5"><i class="bi bi-music-note me-1"></i>${c.genre}</span>
              </div>

              <div class="d-flex flex-column gap-1.5 text-light" style="font-size: 0.95rem; opacity: 0.95;">
                <div class="d-flex align-items-center">
                  <i class="bi bi-calendar-event me-2 text-danger" style="color: #ff2a5f !important;"></i>
                  <span>${c.date}</span>
                </div>
                <div class="d-flex align-items-center">
                  <i class="bi bi-clock me-2 text-danger" style="color: #ff2a5f !important;"></i>
                  <span>${c.time}</span>
                </div>
                <div class="d-flex align-items-center">
                  <i class="bi bi-geo-alt me-2 text-danger" style="color: #ff2a5f !important;"></i>
                  <span>${c.venue}, ${c.city}</span>
                </div>
              </div>
              
              <!-- Biography Container -->
              <div class="artist-bio-wrapper mt-3">
                <h6 class="text-secondary mb-1" style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1.5px; font-weight:700;">Artist Bio</h6>
                <p class="artist-bio text-white-50 text-truncate" id="bio-${index}" style="font-size: 0.85rem; max-width: 600px; line-height: 1.4; font-style: italic; margin-bottom: 0; white-space: normal; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                  Loading biography details...
                </p>
              </div>
            </div>
            
            <!-- Pricing & Action -->
            <div class="d-flex flex-column align-items-md-end text-md-end mt-3 mt-md-0">
              <span class="text-secondary small fw-bold text-uppercase mb-1">Tickets From</span>
              <p class="mb-3 text-white fw-extrabold" style="font-size: 1.8rem;">₹${c.price}</p>
              
              <div class="d-flex flex-column gap-2 w-100">
                <button onclick="goToDetails('${c.name.replace(/'/g, "\\'")}', '${c.city}', '${c.venue.replace(/'/g, "\\'")}', '${c.date}', '${c.time}', ${c.price}, document.getElementById('${imgId}').src, '${c.tourName.replace(/'/g, "\\'")}', '${c.genre.replace(/'/g, "\\'")}', '${c.age}', ${c.rating}, '${c.previewUrl}', true)" 
                        class="btn glowing-btn-concert fw-bold px-4 py-2 text-uppercase" style="letter-spacing:1px; font-size:0.88rem;">
                  <i class="bi bi-ticket-perforated-fill me-1"></i> Book Now
                </button>
                <button onclick="goToDetails('${c.name.replace(/'/g, "\\'")}', '${c.city}', '${c.venue.replace(/'/g, "\\'")}', '${c.date}', '${c.time}', ${c.price}, document.getElementById('${imgId}').src, '${c.tourName.replace(/'/g, "\\'")}', '${c.genre.replace(/'/g, "\\'")}', '${c.age}', ${c.rating}, '${c.previewUrl}', false)" 
                        class="btn btn-outline-light btn-sm fw-bold px-4 py-2 border-secondary" style="border-radius: 8px; font-size:0.8rem;">
                  More Info
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
    `;
  });
  container.innerHTML = html;

  // Run async preloading for Last.fm biographies
  data.forEach((c, index) => {
    const imgId = `concert-img-${index}`;
    loadArtistLastFmData(c.name, index, c.img, imgId);
  });
}

// ================= NAVIGATION =================
function goToDetails(name, city, venue, date, time, price, img, tourName, genre, age, rating, previewUrl, bookNow) {
  localStorage.setItem("concertData", JSON.stringify({
    name,
    city,
    venue,
    date,
    time,
    price,
    img,
    tourName,
    genre,
    age,
    rating,
    previewUrl
  }));

  if (bookNow) {
    window.location.href = "concert_details.html?book=true";
  } else {
    window.location.href = "concert_details.html";
  }
}

// ================= FILTER =================
function filterConcerts() {
  let search = document.getElementById("search")?.value.toLowerCase().trim() || "";
  let city = document.getElementById("cityFilter")?.value || "";
  let month = document.getElementById("monthFilter")?.value || "";
  let priceMax = document.getElementById("priceFilter")?.value || "";
  let sortBy = document.getElementById("sortFilter")?.value || "";

  let filtered = concerts.filter(c =>
    (c.name.toLowerCase().includes(search) || c.venue.toLowerCase().includes(search) || c.tourName.toLowerCase().includes(search)) &&
    (city === "" || c.city === city) &&
    (month === "" || c.month === month) &&
    (priceMax === "" || c.price <= Number(priceMax))
  );

  // Sorting
  if (sortBy === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === "popularity-desc") {
    filtered.sort((a, b) => b.popularity - a.popularity);
  } else if (sortBy === "date-asc") {
    filtered.sort((a, b) => new Date(a.dateVal) - new Date(b.dateVal));
  }

  displayConcerts(filtered);
}

// Reset filters
window.resetConcertFilters = function() {
  if (document.getElementById("search")) document.getElementById("search").value = "";
  if (document.getElementById("cityFilter")) document.getElementById("cityFilter").value = "";
  if (document.getElementById("monthFilter")) document.getElementById("monthFilter").value = "";
  if (document.getElementById("priceFilter")) document.getElementById("priceFilter").value = "";
  if (document.getElementById("sortFilter")) document.getElementById("sortFilter").value = "";
  filterConcerts();
};

// ================= AUTH MANAGEMENT & LISTENERS =================
function initNavbarAuth() {
  const loggedInUser = localStorage.getItem("loggedInUser");
  const loginOption = document.getElementById("loginOption");
  const ticketsOption = document.getElementById("ticketsOption");
  const logoutOption = document.getElementById("logoutOption");
  const navbarUsername = document.getElementById("navbarUsername");

  if (loggedInUser && loggedInUser !== "Guest") {
    let userName = "Profile";
    try {
      const p = JSON.parse(localStorage.getItem("userProfile"));
      if (p && p.name) userName = p.name.split(" ")[0];
      else userName = loggedInUser.split("@")[0];
    } catch(e) {
      userName = loggedInUser.split("@")[0];
    }
    if (navbarUsername) navbarUsername.innerText = userName;
    if (loginOption) loginOption.classList.add("d-none");
    if (ticketsOption) ticketsOption.classList.remove("d-none");
    if (logoutOption) logoutOption.classList.remove("d-none");
  } else {
    if (navbarUsername) navbarUsername.innerText = "Profile";
    if (loginOption) loginOption.classList.remove("d-none");
    if (ticketsOption) ticketsOption.classList.add("d-none");
    if (logoutOption) logoutOption.classList.add("d-none");
  }
}

window.logoutUser = function() {
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("userProfile");
  localStorage.removeItem("session");
  alert("Logged out successfully!");
  location.reload();
};

document.addEventListener("DOMContentLoaded", () => {
  // Bind input listeners
  document.getElementById("search")?.addEventListener("input", filterConcerts);
  document.getElementById("cityFilter")?.addEventListener("change", filterConcerts);
  document.getElementById("monthFilter")?.addEventListener("change", filterConcerts);
  document.getElementById("priceFilter")?.addEventListener("change", filterConcerts);
  document.getElementById("sortFilter")?.addEventListener("change", filterConcerts);

  initNavbarAuth();
  filterConcerts();
});