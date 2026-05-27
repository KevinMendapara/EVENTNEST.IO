// --- TMDB API CONFIGURATION ---
const TMDB_API_KEY = ""; // Kept as empty string client-side. Real key is moved to .env in backend.

// Helper function to fetch movie poster & rating from TMDB API dynamically
async function fetchTMDBData(movieName, fallbackImg) {
  const result = { poster: fallbackImg, rating: null, poster_path: null, overview: null, release_date: null };
  const hasProxy = typeof API_CONFIG !== 'undefined' && !!API_CONFIG.BACKEND_API_URL;
  if (!hasProxy && (!TMDB_API_KEY || TMDB_API_KEY === "YOUR_API_KEY_HERE")) {
    return result;
  }
  try {
    const url = hasProxy
      ? `${API_CONFIG.BACKEND_API_URL}/api/movies/search?query=${encodeURIComponent(movieName)}`
      : `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(movieName)}&language=en-US&page=1`;
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.results && data.results.length > 0) {
      const movie = data.results[0];
      if (movie && movie.poster_path) {
        result.poster = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        result.poster_path = movie.poster_path;
      }
      if (movie && typeof movie.vote_average === 'number') {
        result.rating = movie.vote_average;
      }
      if (movie && movie.overview) {
        result.overview = movie.overview;
      }
      if (movie && movie.release_date) {
        result.release_date = movie.release_date;
      }
    }
  } catch (error) {
    console.error("Error fetching TMDB data:", error);
  }
  if (!result.poster) result.poster = fallbackImg;
  return result;
}

// Comprehensive Multi-Tier Image Proxy Fallback Builder with CORS support
function getImageFallbacks(primaryUrl) {
  const fallbacks = [];
  if (!primaryUrl) return ['images/main_hero.png'];
  if (!primaryUrl.startsWith('http')) return [primaryUrl, 'images/main_hero.png'];

  // Add weserv.nl proxy wrapper for TMDB images (CORS-friendly)
  if (primaryUrl.includes('image.tmdb.org')) {
    const cleanUrl = primaryUrl.replace(/^https?:\/\//, '');
    fallbacks.push(`https://images.weserv.nl/?url=${cleanUrl}&output=jpg&quality=90`);
  }

  let rawUrl = primaryUrl;
  if (primaryUrl.includes('weserv.nl/?url=')) {
    const parts = primaryUrl.split('weserv.nl/?url=');
    if (parts.length > 1) {
      rawUrl = decodeURIComponent(parts[1]);
      if (!rawUrl.startsWith('http')) rawUrl = 'https://' + rawUrl;
    }
  } else if (primaryUrl.includes('.wp.com/')) {
    const parts = primaryUrl.split('.wp.com/');
    if (parts.length > 1) rawUrl = 'https://' + parts[1];
  }

  const cleanUrl = rawUrl.replace(/^https?:\/\//, '');
  if (rawUrl !== primaryUrl) fallbacks.push(rawUrl);
  fallbacks.push(`https://i0.wp.com/${cleanUrl}`);
  fallbacks.push('images/main_hero.png');

  const unique = [...new Set(fallbacks)];
  return unique.filter(url => url !== primaryUrl);
}

// Cinematic Movies List with detailed metadata
let movies = [
  {
    name: "Dune: Part Two",
    genre: "Sci-Fi",
    rating: 8.8,
    audienceScore: 95,
    img: "images/dune_part_two_ver14.jpg",
    duration: "2h 46m",
    industry: "Hollywood",
    language: "English",
    certificate: "UA",
    releaseDate: "2024-03-01",
    price: 350,
    city: "Mumbai",
    popularity: 98,
    director: "Denis Villeneuve",
    cast: "Timothée Chalamet, Zendaya, Rebecca Ferguson",
    formats: ["2D", "3D", "IMAX"]
  },
  {
    name: "Deadpool & Wolverine",
    genre: "Action",
    rating: 8.5,
    audienceScore: 94,
    img: "https://image.tmdb.org/t/p/w500/8cdWv65xpTM51wE6a04j6O7Zf5K.jpg",
    duration: "2h 7m",
    industry: "Hollywood",
    language: "English",
    certificate: "A",
    releaseDate: "2024-07-26",
    price: 400,
    city: "Delhi",
    popularity: 95,
    director: "Shawn Levy",
    cast: "Ryan Reynolds, Hugh Jackman, Emma Corrin",
    formats: ["2D", "3D", "IMAX", "4DX"]
  },
  {
    name: "Inside Out 2",
    genre: "Animation",
    rating: 8.2,
    audienceScore: 96,
    img: "https://image.tmdb.org/t/p/w500/vpnVM9B6pxm68voNM5JTtFuWIEQ.jpg",
    duration: "1h 36m",
    industry: "Hollywood",
    language: "English",
    certificate: "U",
    releaseDate: "2024-06-14",
    price: 300,
    city: "Bangalore",
    popularity: 89,
    director: "Kelsey Mann",
    cast: "Amy Poehler, Maya Hawke, Kensington Tallman",
    formats: ["2D", "3D"]
  },
  {
    name: "Furiosa: A Mad Max Saga",
    genre: "Action",
    rating: 8.0,
    audienceScore: 89,
    img: "https://image.tmdb.org/t/p/w500/iADOnt612viCHuKQj8tG3s5T266.jpg",
    duration: "2h 28m",
    industry: "Hollywood",
    language: "English",
    certificate: "A",
    releaseDate: "2024-05-24",
    price: 320,
    city: "Hyderabad",
    popularity: 85,
    director: "George Miller",
    cast: "Anya Taylor-Joy, Chris Hemsworth, Tom Burke",
    formats: ["2D", "IMAX", "4DX"]
  },
  {
    name: "Oppenheimer",
    genre: "Drama",
    rating: 8.6,
    audienceScore: 91,
    img: "https://image.tmdb.org/t/p/w500/8Gxv8gS681w7dO4w9bBrSY17c42.jpg",
    duration: "3h 0m",
    industry: "Hollywood",
    language: "English",
    certificate: "UA",
    releaseDate: "2023-07-21",
    price: 450,
    city: "Mumbai",
    popularity: 92,
    director: "Christopher Nolan",
    cast: "Cillian Murphy, Emily Blunt, Matt Damon",
    formats: ["2D", "IMAX"]
  },
  {
    name: "Kalki 2898 AD",
    genre: "Sci-Fi",
    rating: 8.5,
    audienceScore: 93,
    img: "https://image.tmdb.org/t/p/w500/tuwF471W3bDTUr4t02wGv252vlu.jpg",
    duration: "3h 1m",
    industry: "Bollywood",
    language: "Telugu",
    certificate: "UA",
    releaseDate: "2024-06-27",
    price: 380,
    city: "Chennai",
    popularity: 97,
    director: "Nag Ashwin",
    cast: "Prabhas, Amitabh Bachchan, Kamal Haasan, Deepika Padukone",
    formats: ["2D", "3D", "IMAX"]
  },
  {
    name: "Fighter",
    genre: "Action",
    rating: 7.5,
    audienceScore: 82,
    img: "https://image.tmdb.org/t/p/w500/z5CC245tOCe72vYr9nw9cs5X36f.jpg",
    duration: "2h 46m",
    industry: "Bollywood",
    language: "Hindi",
    certificate: "UA",
    releaseDate: "2024-01-25",
    price: 280,
    city: "Kolkata",
    popularity: 78,
    director: "Siddharth Anand",
    cast: "Hrithik Roshan, Deepika Padukone, Anil Kapoor",
    formats: ["2D", "3D"]
  },
  {
    name: "Jawan",
    genre: "Action",
    rating: 8.0,
    audienceScore: 87,
    img: "https://image.tmdb.org/t/p/w500/144aW4rT73Kz0a7Zg6xS4o8U1e0.jpg",
    duration: "2h 49m",
    industry: "Bollywood",
    language: "Hindi",
    certificate: "UA",
    releaseDate: "2023-09-07",
    price: 350,
    city: "Delhi",
    popularity: 88,
    director: "Atlee",
    cast: "Shah Rukh Khan, Nayanthara, Vijay Sethupathi",
    formats: ["2D", "IMAX"]
  },
  {
    name: "Animal",
    genre: "Drama",
    rating: 7.2,
    audienceScore: 78,
    img: "https://image.tmdb.org/t/p/w500/68JU5mU527jCkuwCC9nE137f4ae.jpg",
    duration: "3h 21m",
    industry: "Bollywood",
    language: "Hindi",
    certificate: "A",
    releaseDate: "2023-12-01",
    price: 300,
    city: "Mumbai",
    popularity: 72,
    director: "Sandeep Reddy Vanga",
    cast: "Ranbir Kapoor, Anil Kapoor, Bobby Deol, Rashmika Mandanna",
    formats: ["2D"]
  },
  {
    name: "Dunki",
    genre: "Comedy",
    rating: 7.5,
    audienceScore: 80,
    img: "https://image.tmdb.org/t/p/w500/khPzH2dOdfU3H2r5m9wK6A9dK6q.jpg",
    duration: "2h 41m",
    industry: "Bollywood",
    language: "Hindi",
    certificate: "UA",
    releaseDate: "2023-12-21",
    price: 250,
    city: "Bangalore",
    popularity: 76,
    director: "Rajkumar Hirani",
    cast: "Shah Rukh Khan, Taapsee Pannu, Vicky Kaushal",
    formats: ["2D"]
  }
];

let upcomingMovies = [
  {
    name: "Spider-Man: Brand New Day",
    genre: "Action",
    rating: "N/A",
    audienceScore: "N/A",
    img: "https://image.tmdb.org/t/p/w500/r54UBcUBzQ8v9J8e2d4Vd5h8xK4.jpg",
    duration: "TBA",
    industry: "Hollywood",
    language: "English",
    certificate: "UA",
    releaseDate: "2026-09-01",
    price: 350,
    city: "Mumbai",
    popularity: 99,
    director: "Jon Watts",
    cast: "Tom Holland, Zendaya, Jacob Batalon",
    formats: ["2D", "3D", "IMAX"]
  },
  {
    name: "King",
    genre: "Action",
    rating: "N/A",
    audienceScore: "N/A",
    img: "https://image.tmdb.org/t/p/w500/d5r5eP34hF68yJ7gD5W8W6iK8kP.jpg",
    duration: "TBA",
    industry: "Bollywood",
    language: "Hindi",
    certificate: "UA",
    releaseDate: "2026-10-15",
    price: 300,
    city: "Delhi",
    popularity: 90,
    director: "Sujoy Ghosh",
    cast: "Shah Rukh Khan, Suhana Khan",
    formats: ["2D", "IMAX"]
  },
  {
    name: "Avengers: Doomsday",
    genre: "Action",
    rating: "N/A",
    audienceScore: "N/A",
    img: "https://image.tmdb.org/t/p/w500/7WsyCh2kWFLgzI7Ice3LaEXHT68.jpg",
    duration: "TBA",
    industry: "Hollywood",
    language: "English",
    certificate: "UA",
    releaseDate: "2026-05-01",
    price: 500,
    city: "Bangalore",
    popularity: 100,
    director: "Anthony Russo, Joe Russo",
    cast: "Robert Downey Jr., Pedro Pascal, Vanessa Kirby",
    formats: ["2D", "3D", "IMAX", "4DX"]
  },
  {
    name: "Dune: Part Three",
    genre: "Sci-Fi",
    rating: "N/A",
    audienceScore: "N/A",
    img: "https://image.tmdb.org/t/p/w500/o79f5eP34hF68yJ7gD5W8W6iK8kP.jpg",
    duration: "TBA",
    industry: "Hollywood",
    language: "English",
    certificate: "UA",
    releaseDate: "2026-11-20",
    price: 450,
    city: "Hyderabad",
    popularity: 95,
    director: "Denis Villeneuve",
    cast: "Timothée Chalamet, Zendaya",
    formats: ["2D", "IMAX"]
  },
  {
    name: "Toxic",
    genre: "Action",
    rating: "N/A",
    audienceScore: "N/A",
    img: "https://image.tmdb.org/t/p/w500/5v5eP34hF68yJ7gD5W8W6iK8kP.jpg",
    duration: "TBA",
    industry: "Bollywood",
    language: "Kannada",
    certificate: "A",
    releaseDate: "2026-12-25",
    price: 350,
    city: "Mumbai",
    popularity: 85,
    director: "Geetu Mohandas",
    cast: "Yash, Kareena Kapoor Khan",
    formats: ["2D", "IMAX"]
  },
  {
    name: "Odyssey",
    genre: "Sci-Fi",
    rating: "N/A",
    audienceScore: "N/A",
    img: "https://image.tmdb.org/t/p/w500/gEU2QvH353eGo32b2gR3fNu36CB.jpg",
    duration: "TBA",
    industry: "Hollywood",
    language: "English",
    certificate: "U",
    releaseDate: "2026-08-15",
    price: 300,
    city: "Kolkata",
    popularity: 80,
    director: "Various",
    cast: "Various Artists",
    formats: ["2D"]
  }
];

function handleMovieImgLoad(img) {
  // Image loads successfully, nothing specific needed here as handler bindings are explicit
}

function handleMovieImgError(img) {
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
    img.src = 'images/main_hero.png';
    console.log(`All fallbacks failed for ${img.alt}. Swapped to local placeholder.`);
  }
}

// Display Movies in a premium grid with Two Action Buttons & format tags
async function displayMovies(data, containerId = "movieList") {
  let container = document.getElementById(containerId);
  if (!container) return;

  if (data.length === 0) {
    container.innerHTML = `
      <div class="w-100 text-center py-5 text-secondary" style="grid-column: 1 / -1;">
        <i class="bi bi-search fs-1 mb-3 d-block text-danger"></i>
        <h5 class="text-white fw-bold">No movies match your criteria</h5>
        <p class="small">Try resetting or adjusting the scoreboard filters.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = "";

  const movieCardsHtml = data.map((m, index) => {
    let posterImg = m.img;
    
    // Wrap TMDB images with CORS-friendly proxy
    if (posterImg.includes('image.tmdb.org')) {
      const cleanUrl = posterImg.replace(/^https?:\/\//, '');
      posterImg = `https://images.weserv.nl/?url=${cleanUrl}&output=jpg&quality=90`;
    }
    
    const fallbacks = getImageFallbacks(m.img);
    const safeName = m.name.replace(/'/g, "\\'");
    const imgId = `${containerId}-img-${index}`;

    // Format badge display
    const formatsStr = (m.formats || ["2D"]).join(" • ");
    const isUpcoming = containerId === "upcomingMovieList";

    // Rating star indicator
    const ratingDisplay = m.rating && m.rating !== "N/A" ? `⭐ ${Number(m.rating).toFixed(1)}/10` : "⭐ TBA";

    // Dynamic actions block
    let actionsHtml = "";
    if (isUpcoming) {
      actionsHtml = `
        <div class="d-flex gap-2 mt-3">
          <button class="btn btn-outline-light btn-sm flex-grow-1 fw-bold" onclick="goToDetails('${safeName}','${posterImg}')" style="border-radius: 8px; font-size: 0.78rem; padding: 8px 0;">More Info</button>
          <button class="btn btn-secondary btn-sm flex-grow-1 fw-bold text-muted" disabled style="background:#222; border:none; border-radius: 8px; font-size: 0.78rem; padding: 8px 0; cursor: not-allowed;">Coming Soon</button>
        </div>
      `;
    } else {
      actionsHtml = `
        <div class="d-flex gap-2 mt-3">
          <button class="btn btn-outline-light btn-sm flex-grow-1 fw-bold" onclick="goToDetails('${safeName}','${posterImg}')" style="border-radius: 8px; font-size: 0.78rem; padding: 8px 0; border-color: rgba(255,255,255,0.25);">More Info</button>
          <button class="btn btn-danger btn-sm flex-grow-1 fw-bold text-white" onclick="buyNowMovie('${safeName}','${posterImg}')" style="background: linear-gradient(135deg, #e50914 0%, #b20710 100%); border:none; border-radius: 8px; font-size: 0.78rem; padding: 8px 0; box-shadow: 0 4px 10px rgba(229, 9, 20, 0.2);">Buy Now</button>
        </div>
      `;
    }

    return `
      <div class="movie-card" style="background:#11111b; border: 1px solid rgba(255,255,255,0.05); border-radius:12px; overflow:hidden;">
        <div class="position-relative" style="aspect-ratio: 2/3; overflow:hidden; cursor:pointer;" onclick="goToDetails('${safeName}','${posterImg}')">
          <img src="${posterImg}" 
               id="${imgId}" 
               class="movie-img" 
               alt="${m.name}" 
               data-fallbacks='${JSON.stringify(fallbacks)}' 
               data-fallback-index="0" 
               onerror="handleMovieImgError(this)" 
               onload="handleMovieImgLoad(this)"
               referrerpolicy="no-referrer"
               style="width:100%; height:100%; object-fit:cover; transition: transform 0.5s ease;">
          <div class="position-absolute bottom-0 start-0 w-100 p-2 d-flex justify-content-between align-items-center" style="background:linear-gradient(transparent, rgba(0,0,0,0.85));">
             <span class="badge bg-dark bg-opacity-75 text-warning border border-warning" style="font-size:0.7rem;"><i class="bi bi-star-fill me-1"></i>${ratingDisplay.replace("⭐ ", "")}</span>
             <span class="badge bg-dark bg-opacity-75 text-info border border-info" style="font-size:0.7rem;">${m.certificate}</span>
          </div>
        </div>
        <div class="movie-content p-3">
          <h5 class="movie-title fw-bold text-white mb-1 text-truncate">${m.name}</h5>
          <div class="text-secondary small mb-2 d-flex justify-content-between">
             <span>${m.genre} • ${m.duration}</span>
             <span class="text-danger fw-bold">₹${m.price}</span>
          </div>
          <div class="text-secondary small mb-1" style="font-size:0.75rem;"><i class="bi bi-display me-1 text-danger"></i> ${formatsStr}</div>
          <div class="text-secondary small" style="font-size:0.75rem;"><i class="bi bi-translate me-1 text-danger"></i> ${m.language} • ${m.industry}</div>
          ${actionsHtml}
        </div>
      </div>
    `;
  });

  container.innerHTML = movieCardsHtml.join('');

  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(container.querySelectorAll(".movie-card"), {
      max: 6,
      speed: 300,
      glare: true,
      "max-glare": 0.15,
      scale: 1.02
    });
  }

  // Fetch TMDB posters and update ratings in background
  if ((typeof API_CONFIG !== 'undefined' && API_CONFIG.BACKEND_API_URL) || (TMDB_API_KEY && TMDB_API_KEY !== "YOUR_API_KEY_HERE")) {
    data.forEach(async (m, index) => {
      const imgElement = document.getElementById(`${containerId}-img-${index}`);
      if (imgElement) {
        const TMDBData = await fetchTMDBData(m.name, m.img);
        
        // Dynamically update rating value if loaded from TMDB
        if (TMDBData.rating) {
          m.rating = TMDBData.rating; // Save to local array
          const ratingBadges = imgElement.closest('.movie-card')?.querySelectorAll('.badge.text-warning');
          if (ratingBadges) {
            ratingBadges.forEach(badge => {
              badge.innerHTML = `<i class="bi bi-star-fill me-1"></i>${TMDBData.rating.toFixed(1)}/10`;
            });
          }
        }
        
        // Update overview and release dates
        if (TMDBData.overview) m.synopsis = TMDBData.overview;
        if (TMDBData.release_date) m.releaseDate = TMDBData.release_date;

        if (TMDBData.poster && TMDBData.poster !== m.img) {
          const isAlreadySamePoster = TMDBData.poster_path && m.img.includes(TMDBData.poster_path);
          if (isAlreadySamePoster) return;

          const newFallbacks = getImageFallbacks(TMDBData.poster);
          if (!newFallbacks.includes(m.img)) {
            newFallbacks.splice(newFallbacks.length - 1, 0, m.img);
          }

          imgElement.setAttribute('data-fallbacks', JSON.stringify(newFallbacks));
          imgElement.setAttribute('data-fallback-index', '0');
          imgElement.src = TMDBData.poster;
        }
      }
    });
  }
}

// More Info Action: routes to movies_details.html
function goToDetails(name, img) {
  const movieObj = movies.find(m => m.name === name) || upcomingMovies.find(m => m.name === name) || { name, img };
  localStorage.setItem("movie", JSON.stringify(movieObj));
  window.location.href = "movies_details.html";
}

// Buy Now Action: skips detail views, routes directly to theatre_selection.html
function buyNowMovie(name, img) {
  const movieObj = movies.find(m => m.name === name) || upcomingMovies.find(m => m.name === name) || { name, img };
  localStorage.setItem("movie", JSON.stringify(movieObj));
  window.location.href = "theatre_selection.html";
}

// Scoreboard Filtering & Search logic
function filterMovies() {
  const search = document.getElementById('search')?.value.toLowerCase().trim() || "";
  const language = document.getElementById('langFilter')?.value || "";
  const genre = document.getElementById('genreFilter')?.value || "";
  const format = document.getElementById('formatFilter')?.value || "";
  const ratingMin = document.getElementById('ratingFilter')?.value || "";
  const city = document.getElementById('cityFilter')?.value || "";
  const priceMax = document.getElementById('priceFilter')?.value || "";
  const sortBy = document.getElementById('sortFilter')?.value || "";

  const processList = (list) => {
    let result = list.filter(m => {
      const matchSearch = search === "" || 
                          m.name.toLowerCase().includes(search) || 
                          m.genre.toLowerCase().includes(search);
      
      const matchLang = language === "" || m.language === language;
      const matchGenre = genre === "" || m.genre === genre;
      const matchFormat = format === "" || (m.formats && m.formats.includes(format));
      
      let matchRating = true;
      if (ratingMin !== "") {
        if (m.rating === "N/A") matchRating = false;
        else matchRating = Number(m.rating) >= Number(ratingMin);
      }

      const matchCity = city === "" || !m.city || m.city.toLowerCase() === city.toLowerCase();
      const matchPrice = priceMax === "" || !m.price || m.price <= Number(priceMax);

      return matchSearch && matchLang && matchGenre && matchFormat && matchRating && matchCity && matchPrice;
    });

    // Sorting implementations
    if (sortBy === "price-asc") {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "rating-desc") {
      result.sort((a, b) => {
        const rA = a.rating === "N/A" ? 0 : parseFloat(a.rating) || 0;
        const rB = b.rating === "N/A" ? 0 : parseFloat(b.rating) || 0;
        return rB - rA;
      });
    } else if (sortBy === "date-desc") {
      result.sort((a, b) => new Date(b.releaseDate || b.date) - new Date(a.releaseDate || a.date));
    } else if (sortBy === "popularity-desc") {
      result.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    }
    return result;
  };

  const filteredMovies = processList(movies);
  const filteredUpcoming = processList(upcomingMovies);

  displayMovies(filteredMovies, "movieList");
  displayMovies(filteredUpcoming, "upcomingMovieList");
}

// Reset filters globally
window.resetAllFilters = function() {
  if (document.getElementById('search')) document.getElementById('search').value = "";
  if (document.getElementById('langFilter')) document.getElementById('langFilter').value = "";
  if (document.getElementById('genreFilter')) document.getElementById('genreFilter').value = "";
  if (document.getElementById('formatFilter')) document.getElementById('formatFilter').value = "";
  if (document.getElementById('ratingFilter')) document.getElementById('ratingFilter').value = "";
  if (document.getElementById('cityFilter')) document.getElementById('cityFilter').value = "";
  if (document.getElementById('priceFilter')) document.getElementById('priceFilter').value = "";
  if (document.getElementById('sortFilter')) document.getElementById('sortFilter').value = "";
  filterMovies();
};

document.addEventListener('DOMContentLoaded', () => {
  // Bind input listeners
  document.getElementById('search')?.addEventListener('input', filterMovies);
  document.getElementById('langFilter')?.addEventListener('change', filterMovies);
  document.getElementById('genreFilter')?.addEventListener('change', filterMovies);
  document.getElementById('formatFilter')?.addEventListener('change', filterMovies);
  document.getElementById('ratingFilter')?.addEventListener('change', filterMovies);
  document.getElementById('cityFilter')?.addEventListener('change', filterMovies);
  document.getElementById('priceFilter')?.addEventListener('change', filterMovies);
  document.getElementById('sortFilter')?.addEventListener('change', filterMovies);

  // Sync city selection with city center profile
  const cityFilter = document.getElementById('cityFilter');
  if (cityFilter) {
    const savedCity = localStorage.getItem("selectedCity");
    if (savedCity) {
      cityFilter.value = savedCity;
    }
    cityFilter.addEventListener('change', function() {
      localStorage.setItem("selectedCity", this.value);
    });
  }

  filterMovies();
});