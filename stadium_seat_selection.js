const matchData = JSON.parse(localStorage.getItem("cricketMatch"));

if (!matchData) {
    window.location.href = "cricket.html";
} else {
    // Basic population
    document.getElementById('matchTitleText').innerText = matchData.title.toUpperCase() + " - TATA IPL 2026";
    document.getElementById('matchDateTime').innerText = `${matchData.date} | ${matchData.time}`;
    
    // Set Logos (Handling missing logos gracefully)
    const logo1 = document.getElementById('logo1');
    const logo2 = document.getElementById('logo2');
    
    if (logo1) {
        logo1.onerror = function() {
            logo1.onerror = null;
            logo1.src = 'images/eventnest_logo_v2.jpg';
        };
        if (matchData.team1Logo) {
            logo1.src = matchData.team1Logo;
        } else {
            logo1.style.display = 'none';
        }
    }
    
    if (logo2) {
        logo2.onerror = function() {
            logo2.onerror = null;
            logo2.src = 'images/eventnest_logo_v2.jpg';
        };
        if (matchData.team2Logo) {
            logo2.src = matchData.team2Logo;
        } else {
            logo2.style.display = 'none';
        }
    }
}

// Layout configuration
const CENTER_X = 500;
const CENTER_Y = 500;

// Category colors and prices
const CATEGORIES = [
    { price: 1500, color: '#E91E63' }, // Pink
    { price: 1800, color: '#8E24AA' }, // Purple
    { price: 2000, color: '#00BCD4' }, // Cyan
    { price: 2200, color: '#009688' }, // Teal
    { price: 2500, color: '#F57C00' }, // Orange
    { price: 3500, color: '#9E9E9E' }, // Grey
    { price: 4500, color: '#D32F2F' }, // Red
];

// Mapped stands with coordinates preserved and premium names
const stands = [
    // --- INNER RING (r: 160 to 250) ---
    { id: 'g', name: 'West Stand A', cat: 0, r1: 160, r2: 250, a1: -25, a2: 25 },
    { id: 'f', name: 'North Stand A', cat: 4, r1: 160, r2: 250, a1: 28, a2: 70 },
    { id: 'e', name: 'East Stand A', cat: 3, r1: 160, r2: 250, a1: 73, a2: 125 },
    { id: 'd', name: 'Pavilion B', cat: 1, r1: 160, r2: 250, a1: 128, a2: 175 },
    { id: 'club1', name: 'Corporate Box A', cat: 6, r1: 160, r2: 230, a1: 178, a2: 240 },
    { id: 'l', name: 'South Stand A', cat: 1, r1: 160, r2: 250, a1: 243, a2: 265 },
    { id: 'k', name: 'West Stand B', cat: 4, r1: 160, r2: 250, a1: 268, a2: 300 },
    { id: 'h', name: 'Pavilion A', cat: 3, r1: 160, r2: 250, a1: 303, a2: 332 },

    // --- OUTER RING (r: 255 to 350) ---
    { id: 'g1', name: 'West Stand Upper', cat: 0, r1: 255, r2: 360, a1: -30, a2: 30 },
    { id: 'f1', name: 'North Stand Upper', cat: 5, r1: 255, r2: 360, a1: 33, a2: 75 },
    { id: 'd1', name: 'East Stand Upper', cat: 0, r1: 255, r2: 360, a1: 78, a2: 175 },
    
    // Bottom outer ring has slightly smaller inner radius
    { id: 'b1', name: 'VIP Box', cat: 2, r1: 235, r2: 340, a1: 178, a2: 215 },
    { id: 'club2', name: 'Corporate Box B', cat: 2, r1: 235, r2: 340, a1: 218, a2: 255 },
    { id: 'l1', name: 'South Stand Upper', cat: 2, r1: 255, r2: 360, a1: 258, a2: 327 }
];

// Add-ons tracking
let addons = {
    snack: 0,
    parking: 0,
    jersey: 0
};
const ADDON_PRICES = {
    snack: 250,
    parking: 150,
    jersey: 750
};
const ADDON_NAMES = {
    snack: "Snack Combo",
    parking: "Parking Pass",
    jersey: "Official Team Jersey"
};

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

function describeArc(x, y, innerRadius, outerRadius, startAngle, endAngle) {
    var startOuter = polarToCartesian(x, y, outerRadius, endAngle);
    var endOuter   = polarToCartesian(x, y, outerRadius, startAngle);
    var startInner = polarToCartesian(x, y, innerRadius, endAngle);
    var endInner   = polarToCartesian(x, y, innerRadius, startAngle);

    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    var d = [
        "M", startOuter.x, startOuter.y, 
        "A", outerRadius, outerRadius, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
        "L", endInner.x, endInner.y,
        "A", innerRadius, innerRadius, 0, largeArcFlag, 1, startInner.x, startInner.y,
        "Z"
    ].join(" ");
    return d;
}

// Initialize layout and price list
function initLayout() {
    const svg = document.getElementById('stadiumSvg');
    const priceList = document.getElementById('priceList');

    // 1. Draw central pitch
    svg.innerHTML = `
        <circle cx="${CENTER_X}" cy="${CENTER_Y}" r="145" fill="#2E7D32" stroke="#fff" stroke-width="4"/>
        <rect x="${CENTER_X - 12}" y="${CENTER_Y - 40}" width="24" height="80" fill="#fff"/>
    `;

    // 2. Draw Stands & Build stands-themed sidebar list
    stands.forEach(stand => {
        const cat = CATEGORIES[stand.cat];
        stand.price = cat.price;
        stand.color = cat.color;

        const pathData = describeArc(CENTER_X, CENTER_Y, stand.r1, stand.r2, stand.a1, stand.a2);
        
        // Calculate text position (middle of the arc)
        const midAngle = (stand.a1 + stand.a2) / 2;
        const midRadius = (stand.r1 + stand.r2) / 2;
        const textPos = polarToCartesian(CENTER_X, CENTER_Y, midRadius, midAngle);
        
        // Create path
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", pathData);
        path.setAttribute("fill", stand.color);
        path.setAttribute("class", "stand-path");
        path.setAttribute("id", "path-" + stand.id);
        path.setAttribute("data-cat", stand.cat);
        path.addEventListener('click', () => openStand(stand));
        
        // Hover effects
        path.onmouseover = () => highlightStand(stand.id);
        path.onmouseout = () => resetHighlight();

        // Create text
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", textPos.x);
        text.setAttribute("y", textPos.y);
        text.setAttribute("class", "stand-text light");
        
        // Rotate text to align with arc
        let rot = midAngle;
        if (rot > 90 && rot < 270) rot += 180; // Keep text upright
        text.setAttribute("transform", `rotate(${rot}, ${textPos.x}, ${textPos.y})`);
        
        // Wrap text
        const words = stand.name.split(' ');
        if(words.length > 2) {
            text.innerHTML = `<tspan x="${textPos.x}" dy="-5">${words[0]} ${words[1]}</tspan><tspan x="${textPos.x}" dy="12">${words.slice(2).join(' ')}</tspan>`;
        } else {
            text.textContent = stand.name;
        }

        // Pointer events through to path
        text.style.pointerEvents = "none";

        svg.appendChild(path);
        svg.appendChild(text);

        // Sidebar stands item construction
        const seed = stand.id.charCodeAt(0) + (stand.id.charCodeAt(stand.id.length - 1) || 0);
        const occupancy = Math.floor(75 + (seed % 21)); // Mock occupancy between 75% and 95%
        
        let badgeHTML = "";
        if (occupancy >= 91) {
            badgeHTML = `<span class="badge bg-danger ms-2" style="font-size: 0.65rem; padding: 2px 6px;">SELLING FAST</span>`;
        } else if (stand.name.toLowerCase().includes("vip") || stand.name.toLowerCase().includes("corporate")) {
            badgeHTML = `<span class="badge bg-warning text-dark ms-2" style="font-size: 0.65rem; padding: 2px 6px;">VIP VIEW</span>`;
        } else {
            badgeHTML = `<span class="badge bg-success ms-2" style="font-size: 0.65rem; padding: 2px 6px;">AVAILABLE</span>`;
        }

        const li = document.createElement('li');
        li.className = 'price-item d-flex flex-column align-items-stretch px-3 py-2 border-bottom';
        li.style.borderBottomColor = '#1f2438';
        li.dataset.standId = stand.id;
        li.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-1">
                <div class="price-left">
                    <div class="price-color-box" style="background-color: ${stand.color}"></div>
                    <div class="stand-name-text text-white fw-bold" style="font-size: 0.82rem;">${stand.name}</div>
                    ${badgeHTML}
                </div>
                <div class="price-value" style="color: ${stand.color}; font-size: 0.85rem;">₹${stand.price.toLocaleString()}</div>
            </div>
            <div class="d-flex justify-content-between align-items-center" style="font-size: 0.72rem; color: #8f9cae;">
                <span><i class="bi bi-people-fill me-1"></i> Occupancy: <strong>${occupancy}%</strong></span>
                <span class="text-secondary">Select seats <i class="bi bi-chevron-right ms-1"></i></span>
            </div>
        `;

        li.onmouseover = () => highlightStand(stand.id);
        li.onmouseout = () => resetHighlight();
        li.onclick = () => openStand(stand);

        priceList.appendChild(li);
    });
}

// Highlight single stand synchronization
function highlightStand(standId) {
    document.querySelectorAll('.price-item').forEach(item => {
        if(item.dataset.standId === standId) item.classList.add('active');
        else item.classList.remove('active');
    });

    document.querySelectorAll('.stand-path').forEach(path => {
        const pathStandId = path.getAttribute('id').replace('path-', '');
        if(pathStandId === standId) {
            path.classList.remove('dimmed');
        } else {
            path.classList.add('dimmed');
        }
    });
}

function resetHighlight() {
    document.querySelectorAll('.price-item').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.stand-path').forEach(path => path.classList.remove('dimmed'));
}


// --- SEAT SELECTION LOGIC ---
let selectedSeats = [];
let currentStand = null;

function openStand(stand) {
    currentStand = stand;
    
    document.getElementById('modalStandTitle').innerText = stand.name;
    document.getElementById('modalStandColor').style.backgroundColor = stand.color;
    document.getElementById('modalStandPrice').innerText = stand.price;
    
    const grid = document.getElementById('seatGrid');
    grid.innerHTML = '';
    
    // Generate realistic seating block (approx 8 rows, 14 cols)
    const rows = 8;
    const cols = 14;
    
    for (let r = 0; r < rows; r++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'seat-row';
        
        // Row Label
        const labelL = document.createElement('div');
        labelL.style.color = '#888';
        labelL.style.width = '20px';
        labelL.style.textAlign = 'right';
        labelL.style.paddingRight = '5px';
        labelL.style.fontWeight = 'bold';
        labelL.style.fontSize = '0.85rem';
        labelL.style.display = 'flex';
        labelL.style.alignItems = 'center';
        labelL.innerText = String.fromCharCode(65 + r);
        rowDiv.appendChild(labelL);

        for (let c = 1; c <= cols; c++) {
            // Aisle split in middle
            if (c === 8) {
                const aisle = document.createElement('div');
                aisle.style.width = '20px';
                rowDiv.appendChild(aisle);
            }

            const seatId = `${stand.id.toUpperCase()}-${String.fromCharCode(65 + r)}${c}`;
            const seatDiv = document.createElement('div');
            seatDiv.className = 'stadium-seat';
            seatDiv.innerText = c;
            seatDiv.setAttribute("data-id", seatId);
            
            // Randomly occupy some seats, deterministic
            const isOccupied = (seatId.charCodeAt(0) + seatId.charCodeAt(seatId.length-1) + c * r) % 7 === 0;
            if (isOccupied) {
                seatDiv.classList.add('occupied');
            } else {
                // Check if already selected
                const existing = selectedSeats.find(s => s.id === seatId);
                if (existing) {
                    seatDiv.classList.add('selected');
                }
                
                seatDiv.onclick = () => toggleSeat(seatDiv, seatId, stand.price);
            }
            rowDiv.appendChild(seatDiv);
        }
        grid.appendChild(rowDiv);
    }
    
    document.getElementById('seatModal').style.display = 'flex';
}

function closeStand() {
    document.getElementById('seatModal').style.display = 'none';
}

function toggleSeat(element, id, price) {
    if (element.classList.contains('occupied')) return;
    
    if (element.classList.contains('selected')) {
        element.classList.remove('selected');
        selectedSeats = selectedSeats.filter(s => s.id !== id);
    } else {
        element.classList.add('selected');
        selectedSeats.push({ id, price, stand: currentStand.name });
    }
    updateCheckout();
}

// Addon updater function
window.updateAddonQuantity = function(addonKey, change) {
    const newQty = (addons[addonKey] || 0) + change;
    if (newQty < 0) return;
    addons[addonKey] = newQty;
    
    const qtyEl = document.getElementById(`qty-${addonKey}`);
    if (qtyEl) {
        qtyEl.innerText = newQty;
    }
    
    updateCheckout();
};

function updateCheckout() {
    const count = selectedSeats.length;
    const ticketTotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
    
    // Addons calculation
    let addonsTotal = 0;
    let addonsList = [];
    for (const key in addons) {
        if (addons[key] > 0) {
            addonsTotal += addons[key] * ADDON_PRICES[key];
            addonsList.push(`${ADDON_NAMES[key]} (x${addons[key]})`);
        }
    }
    
    const grandTotal = ticketTotal + addonsTotal;
    
    document.getElementById('selectedCount').innerText = count;
    document.getElementById('totalPrice').innerText = grandTotal.toLocaleString();
    
    const panel = document.getElementById('checkoutPanel');
    
    if (count > 0) {
        document.getElementById('selectedSeatsText').innerText = selectedSeats.map(s => s.id).join(', ');
        
        const addonsTextEl = document.getElementById('selectedAddonsText');
        if (addonsTextEl) {
            if (addonsList.length > 0) {
                addonsTextEl.innerText = "+ Add-ons: " + addonsList.join(', ');
                addonsTextEl.style.display = 'block';
            } else {
                addonsTextEl.style.display = 'none';
            }
        }
        
        document.getElementById('proceedBtn').disabled = false;
        panel.style.display = 'flex';
    } else {
        document.getElementById('selectedSeatsText').innerText = 'None';
        const addonsTextEl = document.getElementById('selectedAddonsText');
        if (addonsTextEl) addonsTextEl.style.display = 'none';
        
        document.getElementById('proceedBtn').disabled = true;
        panel.style.display = 'none';
    }
}

function goToPayment() {
    if (selectedSeats.length === 0) return;
    
    const ticketTotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
    
    let addonsTotal = 0;
    let selectedAddonsList = [];
    for (const key in addons) {
        if (addons[key] > 0) {
            addonsTotal += addons[key] * ADDON_PRICES[key];
            selectedAddonsList.push({
                key: key,
                name: ADDON_NAMES[key],
                quantity: addons[key],
                price: ADDON_PRICES[key]
            });
        }
    }
    
    const grandTotal = ticketTotal + addonsTotal;
    
    // Clear other flow configurations to prevent order conflicts
    localStorage.removeItem("concertData");
    localStorage.removeItem("movie");
    
    // Populate standard checkout keys
    localStorage.setItem("seats", JSON.stringify(selectedSeats.map(s => s.id)));
    localStorage.setItem("amount", grandTotal);
    
    // Save cricket custom information
    localStorage.setItem("cricketTickets", JSON.stringify(selectedSeats));
    localStorage.setItem("cricketAddons", JSON.stringify(selectedAddonsList));
    localStorage.setItem("cricketAddonsTotal", addonsTotal);
    localStorage.setItem("cricketTicketTotal", ticketTotal);

    window.location.href = "payment.html";
}

// --- SUPABASE REALTIME DUMMY STRUCTURE (Ready for database hookup) ---
function setupRealtimeSeatListener() {
    if (typeof supabaseClient !== 'undefined' && !SUPABASE_URL.includes('YOUR-PROJECT-ID')) {
        const matchTitle = matchData ? matchData.title : "Match";
        
        // Listen to PostgreSQL changes on orders table
        supabaseClient.channel('live-stadium-seats')
            .on('postgres_changes', { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'orders',
                filter: `title=eq.${matchTitle}` 
            }, payload => {
                console.log('Live stadium seat booking detected:', payload.new);
                if (payload.new && payload.new.seats) {
                    try {
                        const seatsBooked = JSON.parse(payload.new.seats);
                        if (Array.isArray(seatsBooked)) {
                            seatsBooked.forEach(sid => {
                                const seatEl = document.querySelector(`.stadium-seat[data-id="${sid}"]`);
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
    }
}

// Bootstrap layout & realtime listener
document.addEventListener('DOMContentLoaded', () => {
    initLayout();
    setupRealtimeSeatListener();

    // Map and Weather details loading
    if (matchData) {
        const venue = matchData.venue || "";
        let city = "";
        if (venue.includes(",")) {
            city = venue.split(",").pop().trim();
        } else {
            city = venue;
        }

        const mapAddressText = document.getElementById("mapAddressText");
        const mapIframe = document.getElementById("mapIframe");
        const directionsLink = document.getElementById("directionsLink");

        if (mapAddressText) {
            mapAddressText.innerText = venue;
        }

        if (mapIframe && directionsLink) {
            if (window.API_CONFIG && API_CONFIG.GOOGLE_MAPS_API_KEY) {
                mapIframe.src = `https://www.google.com/maps/embed/v1/place?key=${API_CONFIG.GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(venue)}`;
            } else {
                mapIframe.src = `https://maps.google.com/maps?q=${encodeURIComponent(venue)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
            }
            directionsLink.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(venue)}`;
        }

        // OpenWeatherMap loading for Cricket Matches
        const weatherWidget = document.getElementById("weatherWidget");
        const weatherTemp = document.getElementById("weatherTemp");
        const weatherDesc = document.getElementById("weatherDesc");
        const weatherIcon = document.getElementById("weatherIcon");
        const weatherHumidity = document.getElementById("weatherHumidity");
        const weatherWind = document.getElementById("weatherWind");

        const hasWeatherProxy = window.API_CONFIG && !!API_CONFIG.BACKEND_API_URL;
        const hasWeatherDirect = window.API_CONFIG && !!API_CONFIG.OPENWEATHERMAP_API_KEY;
        if ((hasWeatherProxy || hasWeatherDirect) && city) {
            const weatherUrl = hasWeatherProxy
                ? `${API_CONFIG.BACKEND_API_URL}/api/weather?city=${encodeURIComponent(city)}`
                : `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_CONFIG.OPENWEATHERMAP_API_KEY}`;
            fetch(weatherUrl)
                .then(res => {
                    if (!res.ok) throw new Error("Weather API response error");
                    return res.json();
                })
                .then(wdata => {
                    if (wdata && wdata.main) {
                        if (weatherTemp) weatherTemp.innerText = `${Math.round(wdata.main.temp)}°C`;
                        if (wdata.weather && wdata.weather[0] && weatherDesc) {
                            weatherDesc.innerText = wdata.weather[0].description;
                            if (weatherIcon) {
                                weatherIcon.src = `https://openweathermap.org/img/wn/${wdata.weather[0].icon}@2x.png`;
                                weatherIcon.style.display = "block";
                            }
                        }
                        if (weatherHumidity) weatherHumidity.innerText = `${wdata.main.humidity}%`;
                        if (weatherWind) weatherWind.innerText = `${wdata.wind.speed} m/s`;
                        if (weatherWidget) weatherWidget.classList.remove("d-none");
                    }
                })
                .catch(err => {
                    console.warn("Failed to load weather from OpenWeatherMap:", err);
                    if (weatherDesc) weatherDesc.innerText = "Weather unavailable";
                    if (weatherWidget) weatherWidget.classList.remove("d-none");
                });
        } else {
            if (weatherDesc) weatherDesc.innerText = "Weather forecast unavailable (check key)";
            if (weatherWidget) weatherWidget.classList.remove("d-none");
        }
    }
});
