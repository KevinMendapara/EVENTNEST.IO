const cityTheatres = {
  "Mumbai": [
    { 
      name: "PVR ICON: Infiniti Mall, Andheri (W)", 
      screens: [
        { type: "2D Dolby Atmos", times: ["10:00 AM", "12:30 PM", "3:15 PM"] },
        { type: "IMAX 3D", times: ["6:00 PM", "9:45 PM"] }
      ] 
    },
    { 
      name: "INOX: R City, Ghatkopar", 
      screens: [
        { type: "3D", times: ["11:00 AM", "2:00 PM"] },
        { type: "4DX 3D", times: ["5:30 PM", "8:15 PM", "11:00 PM"] }
      ] 
    },
    { 
      name: "Cinepolis: Seawoods Grand Central, Navi Mumbai", 
      screens: [
        { type: "2D", times: ["09:30 AM", "1:15 PM", "4:45 PM"] },
        { type: "VIP 2D", times: ["7:30 PM", "10:30 PM"] }
      ] 
    },
    { 
      name: "PVR: IMAX, Phoenix Palladium, Lower Parel", 
      screens: [
        { type: "IMAX 2D", times: ["09:15 AM", "1:00 PM"] },
        { type: "IMAX 3D", times: ["4:30 PM", "8:15 PM", "11:45 PM"] }
      ] 
    },
    { 
      name: "INOX: Insignia at Atria Mall, Worli", 
      screens: [
        { type: "INSIGNIA 2D", times: ["11:30 AM", "3:45 PM", "7:00 PM"] },
        { type: "INSIGNIA 3D", times: ["10:15 PM"] }
      ] 
    },
    { 
      name: "PVR: Oberoi Mall, Goregaon (E)", 
      screens: [
        { type: "2D", times: ["10:30 AM", "1:45 PM", "5:00 PM"] },
        { type: "3D", times: ["8:30 PM", "11:15 PM"] }
      ] 
    },
    { 
      name: "INOX: Megaplex, Inorbit Mall, Malad (W)", 
      screens: [
        { type: "IMAX 3D", times: ["11:00 AM", "2:30 PM"] },
        { type: "ScreenX 2D", times: ["6:00 PM", "9:00 PM"] }
      ] 
    },
    { 
      name: "Cinepolis: Viviana Mall, Thane", 
      screens: [
        { type: "4DX 3D", times: ["10:00 AM", "1:15 PM", "4:30 PM"] },
        { type: "VIP 2D", times: ["7:45 PM", "10:45 PM"] }
      ] 
    },
    { 
      name: "PVR: Phoenix Marketcity, Kurla", 
      screens: [
        { type: "4DX 2D", times: ["12:00 PM", "3:30 PM"] },
        { type: "P[XL] 3D", times: ["7:00 PM", "10:30 PM"] }
      ] 
    },
    { 
      name: "Metro INOX Cinema: Marine Lines", 
      screens: [
        { type: "2D Dolby Atmos", times: ["09:45 AM", "1:30 PM", "5:15 PM", "9:00 PM"] }
      ] 
    },
    { 
      name: "Regal Cinema: Colaba", 
      screens: [
        { type: "2D", times: ["12:30 PM", "3:30 PM", "6:30 PM", "9:30 PM"] }
      ] 
    },
    { 
      name: "Miraj Cinemas: R Mall, Thane", 
      screens: [
        { type: "3D", times: ["10:15 AM", "1:45 PM", "5:15 PM"] },
        { type: "2D", times: ["8:45 PM", "11:30 PM"] }
      ] 
    },
    { 
      name: "PVR: Maison, Jio World Drive, BKC", 
      screens: [
        { type: "Director's Cut 2D", times: ["11:00 AM", "2:45 PM", "6:30 PM"] },
        { type: "Director's Cut 3D", times: ["10:00 PM"] }
      ] 
    }
  ],
  "Delhi": [
    { 
      name: "PVR: Select City Walk, Saket", 
      screens: [
        { type: "2D", times: ["10:30 AM", "1:30 PM"] },
        { type: "4DX 3D", times: ["4:30 PM", "8:00 PM", "10:45 PM"] }
      ] 
    },
    { 
      name: "INOX: Nehru Place", 
      screens: [
        { type: "IMAX 2D", times: ["11:15 AM", "2:15 PM"] },
        { type: "IMAX 3D", times: ["6:00 PM", "9:00 PM"] }
      ] 
    },
    { 
      name: "Cinepolis: DLF Avenue", 
      screens: [
        { type: "2D Dolby Atmos", times: ["09:00 AM", "12:00 PM", "3:45 PM", "7:15 PM", "10:15 PM"] }
      ] 
    }
  ],
  "Bangalore": [
    { 
      name: "PVR: Forum Mall, Koramangala", 
      screens: [
        { type: "2D", times: ["10:00 AM", "1:00 PM", "4:00 PM"] },
        { type: "IMAX 3D", times: ["7:00 PM", "10:00 PM"] }
      ] 
    },
    { 
      name: "INOX: Garuda Mall", 
      screens: [
        { type: "3D", times: ["11:30 AM", "2:45 PM", "6:15 PM"] },
        { type: "VIP 3D", times: ["9:30 PM"] }
      ] 
    },
    { 
      name: "Cinepolis: Nexus Shantiniketan", 
      screens: [
        { type: "4DX 3D", times: ["09:45 AM", "1:15 PM"] },
        { type: "2D", times: ["5:00 PM", "8:30 PM"] }
      ] 
    }
  ],
  "Default": [
    { 
      name: "PVR Cinemas (Central)", 
      screens: [
        { type: "2D", times: ["10:00 AM", "1:00 PM", "4:30 PM"] },
        { type: "IMAX 3D", times: ["8:00 PM", "10:30 PM"] }
      ] 
    },
    { 
      name: "INOX Multiplex", 
      screens: [
        { type: "3D", times: ["11:00 AM", "2:30 PM", "6:00 PM"] },
        { type: "4DX", times: ["9:15 PM"] }
      ] 
    },
    { 
      name: "Cinepolis Mega Mall", 
      screens: [
        { type: "2D Dolby Atmos", times: ["09:30 AM", "12:45 PM", "4:00 PM"] },
        { type: "VIP 2D", times: ["7:30 PM", "10:45 PM"] }
      ] 
    },
    { 
      name: "Carnival Cinemas", 
      screens: [
        { type: "IMAX 2D", times: ["10:15 AM", "1:45 PM"] },
        { type: "IMAX 3D", times: ["5:15 PM", "8:45 PM"] }
      ] 
    },
    { 
      name: "Miraj Cinemas", 
      screens: [
        { type: "2D", times: ["11:30 AM", "3:00 PM", "6:30 PM", "9:45 PM"] }
      ] 
    }
  ]
};

// Retrieve Movie Data from local storage or set fallbacks
const storedMovie = localStorage.getItem("movie");
let movieData = {
  name: "Dune: Part Two",
  genre: "Sci-Fi",
  duration: "2h 46m",
  rating: 8.8,
  img: "images/dune_part_two_ver14.jpg",
  language: "English",
  certificate: "UA",
  synopsis: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
  formats: ["2D", "3D", "IMAX"],
  price: 250
};

if (storedMovie) {
  try {
    const parsed = JSON.parse(storedMovie);
    movieData = { ...movieData, ...parsed };
  } catch(e) {
    console.error("Error parsing stored movie:", e);
  }
}

// Bind Movie Details to Header & Sidebar
document.addEventListener("DOMContentLoaded", () => {
  const movieTitleEl = document.getElementById("movieTitle");
  const movieHeaderMetaEl = document.getElementById("movieHeaderMeta");
  const backdropHeaderEl = document.getElementById("backdropHeader");
  const certBadgeEl = document.getElementById("certBadge");
  const sidebarPosterEl = document.getElementById("sidebarPoster");
  const sidebarSynopsisEl = document.getElementById("sidebarSynopsis");
  const sidebarLangEl = document.getElementById("sidebarLang");
  const sidebarFormatsEl = document.getElementById("sidebarFormats");
  const cityBadgeEl = document.getElementById("cityBadge");

  let selectedCity = localStorage.getItem("selectedCity") || "Default";
  if (!cityTheatres[selectedCity]) {
    selectedCity = "Default";
  }

  // Populate HTML elements
  if (movieTitleEl) movieTitleEl.innerText = movieData.name;
  if (movieHeaderMetaEl) {
    const displayRating = movieData.rating && movieData.rating !== "N/A" ? `⭐ ${Number(movieData.rating).toFixed(1)}/10` : "⭐ TBA";
    movieHeaderMetaEl.innerText = `${movieData.genre} • ${movieData.duration} • ${displayRating}`;
  }
  if (backdropHeaderEl && movieData.img) {
    backdropHeaderEl.style.backgroundImage = `url('${movieData.img}')`;
  }
  if (certBadgeEl) certBadgeEl.innerText = movieData.certificate;
  if (sidebarPosterEl && movieData.img) {
    sidebarPosterEl.src = movieData.img;
  }
  if (sidebarSynopsisEl) {
    sidebarSynopsisEl.innerText = movieData.synopsis || movieData.overview || "No overview available for this movie.";
  }
  if (sidebarLangEl) sidebarLangEl.innerText = movieData.language;
  if (sidebarFormatsEl) {
    sidebarFormatsEl.innerText = (movieData.formats || ["2D"]).join(", ");
  }
  if (cityBadgeEl) {
    cityBadgeEl.innerText = selectedCity === "Default" ? "Nearby" : selectedCity;
  }

  renderTheatres(selectedCity);
});

// Render premium theatre layout
function renderTheatres(selectedCity) {
  const container = document.getElementById("theatreList");
  if (!container) return;

  const theatres = cityTheatres[selectedCity];
  container.innerHTML = "";

  theatres.forEach((t, tIndex) => {
    // Deterministic distance calculation
    const distanceVal = ((t.name.length % 5) * 1.5 + 1.2).toFixed(1);
    
    // Facility tags assignment
    const facilityTags = ["Parking", "Food & Beverages"];
    if (t.name.includes("ICON") || t.name.includes("IMAX") || t.name.includes("Insignia") || t.name.includes("Maison")) {
      facilityTags.push("Recliners");
      facilityTags.push("Dolby Atmos");
      facilityTags.push("Valet Parking");
    } else if (t.name.includes("INOX") || t.name.includes("Cinepolis")) {
      facilityTags.push("Recliners");
    }

    const facilityBadgesHtml = facilityTags.map(tag => {
      let icon = "bi-check-circle";
      if (tag === "Parking" || tag === "Valet Parking") icon = "bi-p-circle-fill text-primary";
      if (tag === "Food & Beverages") icon = "bi-cup-straw text-success";
      if (tag === "Recliners") icon = "bi-chair-fill text-warning";
      if (tag === "Dolby Atmos") icon = "bi-volume-up-fill text-info";
      return `<span class="facility-badge me-2 mb-2"><i class="bi ${icon} me-1"></i> ${tag}</span>`;
    }).join("");

    // Render screen groups
    let screensHtml = t.screens.map((screen, sIndex) => {
      const format = screen.type;
      
      // Determine screen name
      let screenName = `Screen ${sIndex + 1}`;
      if (format.toLowerCase().includes("imax")) screenName = "IMAX Screen";
      else if (format.toLowerCase().includes("4dx")) screenName = "4DX Motion Screen";
      else if (format.toLowerCase().includes("vip") || format.toLowerCase().includes("insignia") || format.toLowerCase().includes("director")) screenName = "VIP Luxury Lounge";
      else if (format.toLowerCase().includes("atmos")) screenName = "Dolby Atmos Theatre";

      // Price multiplier calculation based on format and base movie price
      const baseMoviePrice = movieData.price || 250;
      let calculatedPrice = baseMoviePrice;
      if (format.includes("IMAX")) calculatedPrice += 150;
      else if (format.includes("4DX")) calculatedPrice += 200;
      else if (format.includes("VIP") || format.includes("INSIGNIA") || format.includes("Director") || format.includes("Insignia")) calculatedPrice += 250;
      else if (format.includes("3D")) calculatedPrice += 50;
      else if (format.includes("Dolby Atmos") || format.includes("ScreenX")) calculatedPrice += 30;

      const timeButtonsHtml = screen.times.map(time => {
        const safeTheatre = t.name.replace(/'/g, "\\'");
        const safeScreen = screenName.replace(/'/g, "\\'");
        const safeFormat = format.replace(/'/g, "\\'");
        
        return `<button onclick="selectTime('${safeTheatre}', '${safeScreen}', '${time}', '${safeFormat}', ${calculatedPrice})" class="showtime-btn">${time}</button>`;
      }).join("");

      return `
        <div class="screen-group mb-3">
          <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <div>
              <span class="screen-name"><i class="bi bi-display me-1"></i> ${screenName}</span>
              <span class="badge bg-dark border border-secondary text-secondary ms-2" style="font-size:0.75rem;">${format}</span>
            </div>
            <div class="text-secondary small">Ticket Price: <strong class="text-success">₹${calculatedPrice}</strong></div>
          </div>
          <div class="d-flex flex-wrap gap-2">
            ${timeButtonsHtml}
          </div>
        </div>
      `;
    }).join("");

    container.innerHTML += `
      <div class="theatre-card p-4">
        <div class="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
          <div>
            <h5 class="fw-bold text-white mb-1"><i class="bi bi-camera-reels-fill text-danger me-2"></i> ${t.name}</h5>
            <div class="text-secondary small"><i class="bi bi-geo-alt-fill me-1"></i> ${selectedCity === "Default" ? "Near you" : selectedCity} • ${distanceVal} km away</div>
          </div>
        </div>
        <div class="d-flex flex-wrap mb-4">
          ${facilityBadgesHtml}
        </div>
        <div>
          ${screensHtml}
        </div>
      </div>
    `;
  });
}

// selectTime function storing comprehensive showtime context
function selectTime(theatre, screen, time, format, price) {
  localStorage.setItem("theatre", theatre);
  localStorage.setItem("screen", screen);
  localStorage.setItem("time", time);
  localStorage.setItem("format", format);
  localStorage.setItem("price", price);
  // Support fallback
  localStorage.setItem("screenType", format);
  
  window.location.href = "seat_selection_movie.html";
}