let selectedSeats = [];
let totalPrice = 0;

// Load info from local storage
const movieData = JSON.parse(localStorage.getItem("movie"));
const theatreData = localStorage.getItem("theatre");
const screenData = localStorage.getItem("screen") || "Screen 1";
const timeData = localStorage.getItem("time");
const formatData = localStorage.getItem("format") || localStorage.getItem("screenType") || "2D";
const ticketPrice = Number(localStorage.getItem("price"));

if (movieData) document.getElementById("movieTitleDisplay").innerText = movieData.name;
if (theatreData) document.getElementById("theatreDisplay").innerText = theatreData;
if (timeData) document.getElementById("timeDisplay").innerText = timeData;

const screenDisplay = document.getElementById("screenDisplay");
if (screenDisplay) screenDisplay.innerText = screenData;

const screenTypeDisplay = document.getElementById("screenTypeDisplay");
if (screenTypeDisplay) screenTypeDisplay.innerText = formatData;

// Calculate pricing tiers based on selected showtime format ticket price
let standardPrice, premiumPrice, vipPrice;
if (ticketPrice) {
  standardPrice = Math.floor(ticketPrice * 0.8);
  premiumPrice = ticketPrice;
  vipPrice = Math.floor(ticketPrice * 1.5);
} else {
  // Fallback to original multiplier logic
  let baseMultiplier = 1;
  if (formatData.includes("IMAX")) baseMultiplier = 1.5;
  else if (formatData.includes("4DX")) baseMultiplier = 2.0;
  else if (formatData.includes("Director's Cut") || formatData.includes("INSIGNIA") || formatData.includes("VIP") || formatData.includes("P[XL]")) baseMultiplier = 3.0;
  else if (formatData.includes("3D")) baseMultiplier = 1.2;
  else if (formatData.includes("Dolby Atmos") || formatData.includes("ScreenX")) baseMultiplier = 1.3;

  standardPrice = Math.floor(150 * baseMultiplier);
  premiumPrice = Math.floor(250 * baseMultiplier);
  vipPrice = Math.floor(400 * baseMultiplier);
}

document.getElementById("pricingDisplay").innerText = `Silver: ₹${standardPrice} | Gold: ₹${premiumPrice} | Royal VIP: ₹${vipPrice}`;

const container = document.getElementById("seatContainer");

// Layout configuration with Standard, Premium, and VIP Recliners
const rows = [
  { id: 'A', type: 'standard', seats: 20, price: standardPrice },
  { id: 'B', type: 'standard', seats: 20, price: standardPrice },
  { id: 'C', type: 'standard', seats: 24, price: standardPrice },
  { id: 'D', type: 'standard', seats: 24, price: standardPrice },
  { id: 'E', type: 'premium', seats: 26, price: premiumPrice },
  { id: 'F', type: 'premium', seats: 26, price: premiumPrice },
  { id: 'G', type: 'premium', seats: 28, price: premiumPrice },
  { id: 'H', type: 'premium', seats: 28, price: premiumPrice },
  { id: 'I', type: 'premium', seats: 30, price: premiumPrice },
  { id: 'J', type: 'premium', seats: 30, price: premiumPrice },
  { id: 'R1', type: 'vip', seats: 16, price: vipPrice },
  { id: 'R2', type: 'vip', seats: 16, price: vipPrice },
  { id: 'R3', type: 'vip', seats: 18, price: vipPrice }
];

// Generate seats
rows.forEach((row, rowIndex) => {
  // Insert section category headers dynamically
  if (rowIndex === 0) {
    const divider = document.createElement("div");
    divider.className = "w-100 text-center my-3 text-secondary text-uppercase fw-bold";
    divider.style.fontSize = "0.75rem";
    divider.style.letterSpacing = "2px";
    divider.innerHTML = `<i class="bi bi-tag-fill me-1"></i> Silver Section — ₹${standardPrice}`;
    container.appendChild(divider);
  } else if (row.type === 'premium' && rows[rowIndex-1].type === 'standard') {
    const divider = document.createElement("div");
    divider.className = "w-100 text-center my-3 text-info text-uppercase fw-bold";
    divider.style.fontSize = "0.75rem";
    divider.style.letterSpacing = "2px";
    divider.style.marginTop = "25px";
    divider.innerHTML = `<i class="bi bi-star-fill me-1"></i> Gold Section — ₹${premiumPrice}`;
    container.appendChild(divider);
  } else if (row.type === 'vip' && rows[rowIndex-1].type !== 'vip') {
    const divider = document.createElement("div");
    divider.className = "w-100 text-center my-3 text-warning text-uppercase fw-bold";
    divider.style.fontSize = "0.75rem";
    divider.style.letterSpacing = "2px";
    divider.style.marginTop = "25px";
    divider.innerHTML = `<i class="bi bi-gem me-1"></i> Royal VIP Recliner Section — ₹${vipPrice}`;
    container.appendChild(divider);
  }

  const rowDiv = document.createElement("div");
  rowDiv.classList.add("seat-row");
  if (row.type === 'vip' && rows[rowIndex-1] && rows[rowIndex-1].type !== 'vip') {
    rowDiv.classList.add("recliner-row");
  } else if (row.type === 'vip' && rowIndex === 0) {
    rowDiv.classList.add("recliner-row");
  }

  // Row Label
  const label = document.createElement("div");
  label.classList.add("row-label");
  label.innerText = row.id;
  rowDiv.appendChild(label);

  for (let i = 1; i <= row.seats; i++) {
    // Add aisle in the middle
    if (i === Math.floor(row.seats / 2) + 1) {
      const aisle = document.createElement("div");
      aisle.classList.add("aisle");
      rowDiv.appendChild(aisle);
    }

    const seat = document.createElement("div");
    seat.classList.add("seat");
    seat.classList.add(row.type); // standard, premium, vip
    if (row.type === 'vip') seat.classList.add("recliner");
    
    const seatId = `${row.id}${i}`;
    seat.innerText = i; 
    seat.setAttribute("data-id", seatId);

    // Randomly occupy some seats for realism
    if (Math.random() < 0.20) {
      seat.classList.add("occupied");
    } else {
      seat.onclick = () => toggleSeat(seat, seatId, row.price);
    }

    rowDiv.appendChild(seat);
  }
  
  // Right Row Label
  const labelRight = document.createElement("div");
  labelRight.classList.add("row-label");
  labelRight.style.marginRight = '0';
  labelRight.style.marginLeft = '15px';
  labelRight.innerText = row.id;
  rowDiv.appendChild(labelRight);

  container.appendChild(rowDiv);
});

function toggleSeat(seatElement, seatId, price) {
  if (seatElement.classList.contains("selected")) {
    seatElement.classList.remove("selected");
    selectedSeats = selectedSeats.filter(s => s.id !== seatId);
    totalPrice -= price;
  } else {
    seatElement.classList.add("selected");
    selectedSeats.push({ id: seatId, price: price });
    totalPrice += price;
  }
  updateCheckout();
}

function updateCheckout() {
  const proceedBtn = document.getElementById("proceedBtn");
  document.getElementById("total").innerText = totalPrice;
  
  if (selectedSeats.length > 0) {
    document.getElementById("selectedSeats").innerText = selectedSeats.map(s => s.id).join(", ");
    proceedBtn.disabled = false;
  } else {
    document.getElementById("selectedSeats").innerText = "None";
    proceedBtn.disabled = true;
  }
}

// --- SUPABASE REALTIME DUMMY STRUCTURE (Ready for database hookup) ---
function setupRealtimeSeatListener() {
    if (typeof supabaseClient !== 'undefined' && !SUPABASE_URL.includes('YOUR-PROJECT-ID')) {
        const movieTitle = movieData ? movieData.name : "Event";
        
        // Listen to PostgreSQL changes on orders table
        supabaseClient.channel('live-movie-seats')
            .on('postgres_changes', { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'orders',
                filter: `title=eq.${movieTitle}` 
            }, payload => {
                console.log('Live seat booking detected:', payload.new);
                if (payload.new && payload.new.seats) {
                    try {
                        const seatsBooked = JSON.parse(payload.new.seats);
                        if (Array.isArray(seatsBooked)) {
                            seatsBooked.forEach(sid => {
                                const seatEl = document.querySelector(`.seat[data-id="${sid}"]`);
                                if (seatEl && !seatEl.classList.contains("selected")) {
                                    seatEl.classList.add("occupied");
                                    seatEl.onclick = null;
                                }
                            });
                        }
                    } catch(e) {}
                }
            })
            .subscribe();
        console.log("Supabase Realtime channel subscription initialized for movie:", movieTitle);
    }
}

function goToPayment() {
  if (selectedSeats.length === 0) return;
  
  // Save formatted data for next page
  localStorage.removeItem("concertData");
  localStorage.removeItem("cricketMatch");
  localStorage.setItem("seats", JSON.stringify(selectedSeats.map(s => s.id)));
  localStorage.setItem("amount", totalPrice);

  window.location.href = "payment.html";
}

// Initialize Realtime Listener
document.addEventListener("DOMContentLoaded", () => {
    setupRealtimeSeatListener();
});