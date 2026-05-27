let data = JSON.parse(localStorage.getItem("movie"));
const initialImg = (data && data.img) ? data.img : 'images/main_hero.png';

if (window.location.protocol === 'file:') {
  console.warn("EventNest Diagnostics: Running on file:// protocol. YouTube embedded players block playback on local files due to referrer security policies. If the trailer shows a configuration error (Error 153), click the 'Watch on YouTube' button in the modal header to watch it directly.");
}

// Comprehensive Multi-Tier Image Proxy Fallback Builder
function getImageFallbacks(primaryUrl) {
  const fallbacks = [];
  if (!primaryUrl) {
    return ['images/main_hero.png'];
  }
  
  if (!primaryUrl.startsWith('http')) {
    return [primaryUrl, 'images/main_hero.png'];
  }

  // Extract the original clean URL if already proxied to prevent double proxying
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

  // Build sequential fallback list (will be attempted in this exact order on error)
  
  // 1. Direct URL (if current url is already proxied, try direct)
  if (rawUrl !== primaryUrl) {
    fallbacks.push(rawUrl);
  }
  
  // 2. WordPress Photon CDN (Extremely fast, free, never blocks referrers, rarely blocked by ISPs)
  fallbacks.push(`https://i0.wp.com/${cleanUrl}`);
  fallbacks.push(`https://i1.wp.com/${cleanUrl}`);
  
  // 3. Weserv.nl Proxy
  fallbacks.push(`https://images.weserv.nl/?url=${encodeURIComponent(cleanUrl)}`);
  
  // 4. Wsrv.nl (alternative domain for weserv.nl)
  fallbacks.push(`https://wsrv.nl/?url=${encodeURIComponent(cleanUrl)}`);
  
  // 5. Hard backup to local event placeholder
  fallbacks.push('images/main_hero.png');

  // Filter out any entries that match the primaryUrl to avoid redundant loading loops
  const unique = [...new Set(fallbacks)];
  return unique.filter(url => url !== primaryUrl);
}

const STATIC_TRAILERS = {
  "dune: part two": "Way9Dexny3w",
  "deadpool & wolverine": "73_1biulk6g",
  "inside out 2": "LEjhYKPfcUM",
  "furiosa: a mad max saga": "XJMuhwVlca4",
  "oppenheimer": "uYPbbksJxIg",
  "kalki 2898 ad": "kQDd1AhGI90",
  "fighter": "6amIq_mP4xM",
  "jawan": "COv52771860",
  "animal": "Dydmpymqp70",
  "dunki": "GBmQAkfefRY",
  "spider-man: brand new day": "JfVOs4VSpmA",
  "king": "uD31_Y88P8E",
  "avengers: doomsday": "hA6hldpSTF8",
  "dune: part three": "I0TzJb-3h88",
  "toxic": "w7WjT2t1z3A",
  "odyssey": "MlhL84hQGKI"
};

// Pre-initialize working trailer link from static map
if (data && data.name) {
  const cleanTitle = data.name.toLowerCase().trim();
  if (STATIC_TRAILERS[cleanTitle]) {
    window.trailerUrl = `https://www.youtube.com/embed/${STATIC_TRAILERS[cleanTitle]}?autoplay=1`;
  }
}

if (data) {
  document.getElementById("titleDisplay").innerText = data.name;
  document.getElementById("modalTitle").innerText = data.name + " Trailer";
  document.getElementById("heroBg").style.backgroundImage = `url('${initialImg}')`;
  document.getElementById("synopsisDisplay").innerText = data.synopsis || "A visually stunning cinematic experience that you don't want to miss in theatres.";
  document.getElementById("castDisplay").innerText = data.cast || "Various Artists";
  document.getElementById("genreDisplay").innerText = data.genre || "Entertainment";
  
  if (data.duration) document.getElementById("runtimeDisplay").innerText = data.duration;
  if (data.language) document.getElementById("languageDisplay").innerText = data.language;
  if (data.certificate) document.getElementById("certDisplay").innerText = data.certificate;
  if (data.releaseDate) document.getElementById("yearDisplay").innerText = data.releaseDate.split("-")[0];
  if (data.director) document.getElementById("directorDisplay").innerText = data.director;

  if (data.rating) {
      document.getElementById("ratingDisplay").innerHTML = `<i class="bi bi-star-fill text-warning me-1"></i> ${Number(data.rating).toFixed(1)}/10`;
  }
  if (data.audienceScore && data.audienceScore !== "N/A") {
      document.getElementById("audienceDisplay").innerText = `${data.audienceScore}% Score`;
  } else {
      document.getElementById("audienceDisplay").innerText = "TBA Score";
  }

  const formatsDisplay = document.getElementById("formatsDisplay");
  if (formatsDisplay && data.formats) {
      formatsDisplay.innerHTML = data.formats.map(f => `<span class="badge bg-dark border border-secondary" style="font-size:0.75rem;">${f}</span>`).join("");
  }
}

const TMDB_API_KEY = "867744ecc894f0582dea35e80fd71a4d";

async function fetchTMDBDetails(movieName) {
  try {
    const hasProxy = typeof API_CONFIG !== 'undefined' && !!API_CONFIG.BACKEND_API_URL;
    if (!hasProxy && (!TMDB_API_KEY || TMDB_API_KEY === "YOUR_API_KEY_HERE")) {
      console.log("TMDB API key or backend proxy is not configured.");
      return;
    }
    const searchUrl = hasProxy
      ? `${API_CONFIG.BACKEND_API_URL}/api/movies/search?query=${encodeURIComponent(movieName)}`
      : `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(movieName)}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    
    if (searchData.results && searchData.results.length > 0) {
      const movie = searchData.results[0];
      const movieId = movie.id;
      
      const detailsUrl = hasProxy
        ? `${API_CONFIG.BACKEND_API_URL}/api/movies/details/${movieId}`
        : `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,similar,reviews`;
      const detailsRes = await fetch(detailsUrl);
      const details = await detailsRes.json();
      
      // Backdrop Preloader with Multi-tier Proxy Failover
      if (details.backdrop_path) {
        const backdropUrl = `https://image.tmdb.org/t/p/original${details.backdrop_path}`;
        const cleanBackdrop = `image.tmdb.org/t/p/original${details.backdrop_path}`;
        
        // Define sequential backdrop attempts
        const backdropAttempts = [
          backdropUrl,
          `https://i0.wp.com/${cleanBackdrop}`,
          `https://i1.wp.com/${cleanBackdrop}`,
          `https://images.weserv.nl/?url=${encodeURIComponent(cleanBackdrop)}`,
          `https://wsrv.nl/?url=${encodeURIComponent(cleanBackdrop)}`
        ];
        
        let attemptIndex = 0;
        function tryLoadBackdrop() {
          if (attemptIndex >= backdropAttempts.length) {
            console.log("All TMDB backdrop attempts and proxies failed. Keeping original poster backdrop.");
            return;
          }
          const currentUrl = backdropAttempts[attemptIndex];
          const imgPreloader = new Image();
          imgPreloader.onload = function() {
            document.getElementById("heroBg").style.backgroundImage = `url('${currentUrl}')`;
          };
          imgPreloader.onerror = function() {
            attemptIndex++;
            tryLoadBackdrop();
          };
          imgPreloader.src = currentUrl;
        }
        tryLoadBackdrop();
      }
      
      // Meta
      if (details.release_date) document.getElementById("yearDisplay").innerText = details.release_date.split("-")[0];
      if (details.runtime) document.getElementById("runtimeDisplay").innerText = `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`;
      if (details.overview) document.getElementById("synopsisDisplay").innerText = details.overview;
      
      // Genres
      if (details.genres && details.genres.length > 0) {
        document.getElementById("genreDisplay").innerText = details.genres.map(g => g.name).join(", ");
      }
      
      // Cast & Director
      if (details.credits) {
        if (details.credits.cast && details.credits.cast.length > 0) {
          document.getElementById("castDisplay").innerText = details.credits.cast.slice(0, 5).map(c => c.name).join(", ");
        }
        if (details.credits.crew && details.credits.crew.length > 0) {
          const dir = details.credits.crew.find(c => c.job === "Director");
          if (dir) {
            document.getElementById("directorDisplay").innerText = dir.name;
          }
        }
      }

      // Spoken Languages
      if (details.spoken_languages && details.spoken_languages.length > 0) {
        document.getElementById("languageDisplay").innerText = details.spoken_languages.map(l => l.english_name).join(", ");
      }

      // Rating and Match Score
      if (typeof details.vote_average === 'number' && details.vote_average > 0) {
        document.getElementById("ratingDisplay").innerHTML = `<i class="bi bi-star-fill text-warning me-1"></i> ${details.vote_average.toFixed(1)}/10`;
        document.getElementById("audienceDisplay").innerText = `${Math.round(details.vote_average * 10)}% Score`;
      }
      
      // Reviews
      const reviewsContainer = document.getElementById("reviewsContainer");
      if (reviewsContainer) {
        if (details.reviews && details.reviews.results && details.reviews.results.length > 0) {
          reviewsContainer.innerHTML = "";
          details.reviews.results.slice(0, 3).forEach(rev => {
            const content = rev.content.length > 300 ? rev.content.slice(0, 300) + "..." : rev.content;
            reviewsContainer.innerHTML += `
              <div class="p-3 rounded mb-2" style="background-color: #1e1e1e; border: 1px solid #333; transition: transform 0.2s ease;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform=''">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <strong style="color: #e50914; font-size: 0.95rem;"><i class="bi bi-person-circle me-1"></i> ${rev.author}</strong>
                  <span class="text-muted" style="font-size: 0.75rem;">${new Date(rev.created_at).toLocaleDateString()}</span>
                </div>
                <p class="mb-0 text-secondary" style="font-size: 0.9rem; line-height: 1.5; font-style: italic;">"${content}"</p>
              </div>
            `;
          });
        } else {
          reviewsContainer.innerHTML = `<p class="text-muted" style="font-size: 0.95rem;">No reviews available for this movie yet.</p>`;
        }
      }
      
      // Trailer
      if (details.videos && details.videos.results) {
        const trailer = details.videos.results.find(v => v.type === "Trailer" && v.site === "YouTube") || details.videos.results.find(v => v.site === "YouTube");
        if (trailer) {
          window.trailerUrl = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
        }
      }
      
      // More Like This
      if (details.similar && details.similar.results && details.similar.results.length > 0) {
        const mltContainer = document.getElementById("moreLikeThisRow");
        mltContainer.innerHTML = "";
        details.similar.results.slice(0, 10).forEach(sim => {
          if (sim.backdrop_path) {
            const primarySimUrl = `https://image.tmdb.org/t/p/w500${sim.backdrop_path}`;
            const simFallbacks = getImageFallbacks(primarySimUrl);

            mltContainer.innerHTML += `
              <div class="mlt-card" onclick="goToDetails('${sim.title.replace(/'/g, "\\'")}', this.querySelector('img').src)">
                <img src="${primarySimUrl}" 
                     alt="${sim.title}" 
                     data-fallbacks='${JSON.stringify(simFallbacks)}' 
                     data-fallback-index="0" 
                     onerror="handleMovieImgError(this)" 
                     onload="handleMovieImgLoad(this)"
                     referrerpolicy="no-referrer">
                <div class="mlt-title">${sim.title}</div>
              </div>
            `;
          }
        });
      }
    }
  } catch (error) {
    console.error("Error fetching TMDB data:", error);
  }
}

if (data && data.name) {
  fetchTMDBDetails(data.name);
} else {
  fetchTMDBDetails("Dune: Part Two");
}

function playTrailer() {
  const container = document.getElementById("trailerContainer");
  const extBtn = document.getElementById("externalTrailerBtn");
  if (!container) return;

  // Always stop any previous iframe
  container.innerHTML = "";
  if (extBtn) {
    extBtn.classList.add("d-none");
    extBtn.href = "#";
  }

  const isFileProtocol = (window.location.protocol === "file:" || String(window.location.origin || "").startsWith("file"));

  // Extract video ID from embed URL (e.g. /embed/VIDEO_ID) or static database
  let videoId = "";
  if (window.trailerUrl) {
    const embedMatch = window.trailerUrl.match(/\/embed\/([^?#&]+)/);
    if (embedMatch && embedMatch[1]) {
      videoId = embedMatch[1];
    }
  }
  if (!videoId) {
    const cleanTitle = data && data.name ? data.name.toLowerCase().trim() : "";
    videoId = STATIC_TRAILERS[cleanTitle] || "";
  }

  const movieName = data ? data.name : "Movie";

  if (!videoId) {
    // Case 1: No Video ID available
    const movieQuery = encodeURIComponent(movieName + " official trailer");
    const searchUrl = `https://www.youtube.com/results?search_query=${movieQuery}`;
    
    container.innerHTML = `
      <div class="d-flex flex-column align-items-center justify-content-center text-center p-5" style="background: #141414; min-height: 480px; border-radius: 8px;">
        <div style="background-color: rgba(229, 9, 20, 0.1); border-radius: 50%; padding: 25px; margin-bottom: 24px; display: inline-block;">
          <i class="bi bi-question-circle" style="font-size: 3.5rem; color: #e50914; line-height: 1;"></i>
        </div>
        <h3 class="fw-bold mb-3 text-white" style="font-size: 1.8rem; font-family: 'Oswald', sans-serif; letter-spacing: 1px;">TRAILER NOT FOUND</h3>
        <p class="text-secondary mx-auto mb-4" style="max-width: 520px; font-size: 1.05rem; line-height: 1.6; font-family: 'DM Sans', sans-serif;">
          We couldn't locate a direct trailer match for <strong>${movieName}</strong> in our database or via TMDB. Click below to search for it directly on YouTube!
        </p>
        <a href="${searchUrl}" target="_blank" class="btn btn-lg px-5 py-2 fw-bold text-white shadow-lg" style="background-color: #e50914; border-radius: 4px; transition: transform 0.2s, background-color 0.2s;" onmouseover="this.style.transform='scale(1.05)'; this.style.backgroundColor='#b80710';" onmouseout="this.style.transform='scale(1)'; this.style.backgroundColor='#e50914';">
          <i class="bi bi-search me-2"></i> Search on YouTube
        </a>
      </div>
    `;
  } else if (isFileProtocol) {
    // Case 2: Running via file:// protocol (embed is blocked, causes Error 153)
    const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
    if (extBtn) {
      extBtn.href = watchUrl;
      extBtn.classList.remove("d-none");
    }

    container.innerHTML = `
      <div class="d-flex flex-column align-items-center justify-content-center text-center p-5" style="background: #141414; min-height: 480px; border-radius: 8px;">
        <div style="background-color: rgba(229, 9, 20, 0.1); border-radius: 50%; padding: 25px; margin-bottom: 24px; display: inline-block;">
          <i class="bi bi-shield-slash" style="font-size: 3.5rem; color: #e50914; line-height: 1;"></i>
        </div>
        <h3 class="fw-bold mb-3 text-white" style="font-size: 1.8rem; font-family: 'Oswald', sans-serif; letter-spacing: 1px;">LOCAL FILE RESTRICTION (file://)</h3>
        <p class="text-secondary mx-auto mb-4" style="max-width: 520px; font-size: 1.05rem; line-height: 1.6; font-family: 'DM Sans', sans-serif;">
          YouTube and modern browsers block inline video players when websites are opened directly as local files (e.g. via double-clicking).
          <br><br>
          To enable inline play, run a local development server (like VS Code Live Server). Otherwise, click the button below to watch the official HD trailer directly on YouTube!
        </p>
        <a href="${watchUrl}" target="_blank" class="btn btn-lg px-5 py-2 fw-bold text-white shadow-lg" style="background-color: #e50914; border-radius: 4px; transition: transform 0.2s, background-color 0.2s;" onmouseover="this.style.transform='scale(1.05)'; this.style.backgroundColor='#b80710';" onmouseout="this.style.transform='scale(1)'; this.style.backgroundColor='#e50914';">
          <i class="bi bi-youtube me-2"></i> Watch on YouTube
        </a>
      </div>
    `;
  } else {
    // Case 3: Running via http:// or https:// (normal server execution)
    const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
    if (extBtn) {
      extBtn.href = watchUrl;
      extBtn.classList.remove("d-none");
    }

    // Upgrade to privacy-enhanced youtube-nocookie.com to bypass adblockers and cookie consent issues
    const secureEmbedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&enablejsapi=1&playsinline=1&rel=0`;
    
    // Safely append origin parameter for added validation (only if origin is valid)
    const originParam = window.location.origin && window.location.origin !== "null" ? `&origin=${encodeURIComponent(window.location.origin)}` : "";

    container.innerHTML = `
      <iframe id="trailerIframe" 
              width="100%" 
              height="600" 
              src="${secureEmbedUrl}${originParam}" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowfullscreen 
              style="border: none; border-radius: 0 0 8px 8px; background-color: #000;">
      </iframe>
    `;
  }

  // Safely show modal using the best practice bootstrap getOrCreateInstance helper
  const modalElement = document.getElementById('trailerModal');
  if (modalElement) {
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    modal.show();
  }
}

function stopTrailer() {
  const container = document.getElementById("trailerContainer");
  const extBtn = document.getElementById("externalTrailerBtn");
  if (container) {
    container.innerHTML = "";
  }
  if (extBtn) {
    extBtn.classList.add("d-none");
  }
}

// Securely stop video playback when the Bootstrap modal is closed (via escape, backdrop click, or close button)
document.getElementById('trailerModal')?.addEventListener('hidden.bs.modal', function () {
  stopTrailer();
});

function goToTheatres() {
  window.location.href = "theatre_selection.html";
}

function goToDetails(name, img) {
  localStorage.setItem("movie", JSON.stringify({ name: name, img: img || 'images/main_hero.png' }));
  window.location.reload();
}

function handleMovieImgLoad(img) {
  const loadedSrc = img.src;
  const safeName = img.alt.replace(/'/g, "\\'");
  const card = img.closest('.mlt-card');
  if (card) {
     card.setAttribute("onclick", `goToDetails('${safeName}','${loadedSrc}')`);
  }
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
    handleMovieImgLoad(img);
  }
}

// Google Maps Integration for Nearby Theatres
document.addEventListener('DOMContentLoaded', () => {
  const selectedCity = localStorage.getItem("selectedCity") || "Mumbai";
  const query = `Movie Theatres in ${selectedCity}`;
  const mapAddressText = document.getElementById("mapAddressText");
  const mapIframe = document.getElementById("mapIframe");
  const directionsLink = document.getElementById("directionsLink");

  if (mapAddressText) {
    mapAddressText.innerText = query;
  }
  if (mapIframe && directionsLink) {
    if (window.API_CONFIG && API_CONFIG.GOOGLE_MAPS_API_KEY) {
        mapIframe.src = `https://www.google.com/maps/embed/v1/place?key=${API_CONFIG.GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(query)}`;
    } else {
        mapIframe.src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
    }
    directionsLink.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
  }
});