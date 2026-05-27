// Inject scoreboard-specific styling for a premium sports layout
const scoreboardStyle = document.createElement('style');
scoreboardStyle.textContent = `
    .cricket-card {
        background: #11111b !important;
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 16px !important;
        transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    }
    .cricket-card:hover {
        transform: translateY(-5px) scale(1.02);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(229, 9, 20, 0.3);
        border-color: rgba(229, 9, 20, 0.5) !important;
    }
    .cricket-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 14px 20px;
        background: rgba(255, 255, 255, 0.02);
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .tournament-badge {
        font-size: 0.75rem;
        font-weight: 700;
        color: #ff6b6b;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    .status-badge {
        font-size: 0.7rem;
        font-weight: 800;
        padding: 4px 10px;
        border-radius: 50px;
        text-transform: uppercase;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        letter-spacing: 0.5px;
    }
    .status-selling-fast {
        background: rgba(229, 9, 20, 0.15);
        color: #ff4d4d;
        border: 1px solid rgba(229, 9, 20, 0.3);
        box-shadow: 0 0 10px rgba(229, 9, 20, 0.1);
    }
    .status-almost-full {
        background: rgba(243, 156, 18, 0.15);
        color: #f39c12;
        border: 1px solid rgba(243, 156, 18, 0.3);
    }
    .status-available {
        background: rgba(46, 204, 113, 0.15);
        color: #2ecc71;
        border: 1px solid rgba(46, 204, 113, 0.3);
    }
    .status-booking-closed {
        background: rgba(149, 165, 166, 0.15);
        color: #95a5a6;
        border: 1px solid rgba(149, 165, 166, 0.3);
    }
    .match-scoreboard {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 24px 16px;
        background: linear-gradient(180deg, rgba(21, 21, 31, 0.3) 0%, rgba(13, 13, 20, 0.6) 100%);
        position: relative;
        border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    }
    .team-col {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        z-index: 2;
        max-width: 38%;
    }
    .team-logo-badge {
        position: relative;
        width: 72px;
        height: 72px;
        border-radius: 50%;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.3s ease;
    }
    .team-col:hover .team-logo-badge {
        transform: scale(1.08);
    }
    .team-initials {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
        font-size: 1.4rem;
        color: #fff;
        border: 2px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    }
    .team-logo-img {
        position: absolute;
        width: 48px;
        height: 48px;
        object-fit: contain;
        z-index: 3;
        transition: opacity 0.3s ease;
    }
    .team-name {
        font-size: 0.85rem;
        font-weight: 700;
        color: #e0e0e0;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        line-height: 1.25;
        height: 2.5em;
    }
    .vs-timer-col {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0 6px;
        z-index: 2;
        min-width: 96px;
    }
    .vs-text {
        font-size: 1rem;
        font-weight: 900;
        font-style: italic;
        color: #e50914;
        background: rgba(229, 9, 20, 0.1);
        border: 1px solid rgba(229, 9, 20, 0.3);
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 8px;
        box-shadow: 0 0 10px rgba(229, 9, 20, 0.1);
    }
    .countdown-ticker {
        font-size: 0.72rem;
        font-weight: 800;
        color: #e0e0e0;
        background: rgba(0, 0, 0, 0.5);
        padding: 4px 8px;
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        text-align: center;
        white-space: nowrap;
    }
    .countdown-ticker.live {
        color: #00ffcc;
        border-color: rgba(0, 255, 204, 0.3);
        animation: glowPulse 2s infinite alternate;
    }
    @keyframes glowPulse {
        from { box-shadow: 0 0 4px rgba(0, 255, 204, 0.1); }
        to { box-shadow: 0 0 10px rgba(0, 255, 204, 0.3); }
    }
    .cricket-card-details {
        padding: 16px 20px 20px;
    }
    .detail-item {
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.55);
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 6px;
    }
    .detail-item i {
        color: #e50914;
        width: 14px;
    }
`;
document.head.appendChild(scoreboardStyle);

const iplMatches = [
    {
        title: "Mumbai Indians vs Chennai Super Kings",
        tournament: "IPL 2026",
        format: "T20",
        popularity: 98,
        status: "Selling Fast",
        date: "28 May 2026",
        dateVal: "2026-05-28",
        time: "7:30 PM",
        venue: "Wankhede Stadium, Mumbai",
        team1Logo: "images/mi_badge.png",
        team2Logo: "images/csk_badge.png",
        bg1: "#004B8D",
        bg2: "#F9CD05",
        price: 1500
    },
    {
        title: "Royal Challengers Bengaluru vs Kolkata Knight Riders",
        tournament: "IPL 2026",
        format: "T20",
        popularity: 92,
        status: "Almost Full",
        date: "26 May 2026", // Passed match to test booking closed state
        dateVal: "2026-05-26",
        time: "7:30 PM",
        venue: "M. Chinnaswamy Stadium, Bangalore",
        team1Logo: "images/rcb_badge.png",
        team2Logo: "images/kkr_badge.png",
        bg1: "#D11C21",
        bg2: "#3A225D",
        price: 2000
    },
    {
        title: "Delhi Capitals vs Sunrisers Hyderabad",
        tournament: "IPL 2026",
        format: "T20",
        popularity: 85,
        status: "Available",
        date: "29 May 2026",
        dateVal: "2026-05-29",
        time: "3:30 PM",
        venue: "Arun Jaitley Stadium, Delhi",
        team1Logo: "images/dc_badge.png",
        team2Logo: "images/srh_badge.png",
        bg1: "#004C93",
        bg2: "#F7A721",
        price: 1200
    },
    {
        title: "Rajasthan Royals vs Gujarat Titans",
        tournament: "IPL 2026",
        format: "T20",
        popularity: 88,
        status: "Selling Fast",
        date: "30 May 2026",
        dateVal: "2026-05-30",
        time: "7:30 PM",
        venue: "Sawai Mansingh Stadium, Jaipur",
        team1Logo: "images/rr_badge.png",
        team2Logo: "images/gt_badge.png",
        bg1: "#E73895",
        bg2: "#1C1C2B",
        price: 1800
    },
    {
        title: "Punjab Kings vs Lucknow Super Giants",
        tournament: "IPL 2026",
        format: "T20",
        popularity: 76,
        status: "Available",
        date: "1 June 2026",
        dateVal: "2026-06-01",
        time: "3:30 PM",
        venue: "PCA Stadium, Mohali",
        team1Logo: "images/pbks_badge.png",
        team2Logo: "images/lsg_badge.png",
        bg1: "#DD1F2D",
        bg2: "#004B8D",
        price: 1100
    }
];

const intlMatches = [
    {
        title: "India vs Australia (Men's T20)",
        tournament: "T20 International",
        format: "T20",
        popularity: 99,
        status: "Selling Fast",
        date: "10 June 2026",
        dateVal: "2026-06-10",
        time: "7:00 PM",
        venue: "Eden Gardens, Kolkata",
        team1Logo: "images/ind.png",
        team2Logo: "images/aus.png",
        bg1: "#000080",
        bg2: "#FFCC00",
        price: 2500
    },
    {
        title: "India vs England (Women's T20)",
        tournament: "T20 International",
        format: "T20",
        popularity: 80,
        status: "Available",
        date: "15 June 2026",
        dateVal: "2026-06-15",
        time: "7:00 PM",
        venue: "Narendra Modi Stadium, Ahmedabad",
        team1Logo: "images/ind.png",
        team2Logo: "images/eng.png",
        bg1: "#000080",
        bg2: "#CF142B",
        price: 1000
    },
    {
        title: "India vs South Africa (Men's ODI)",
        tournament: "ODI Bilateral Series",
        format: "ODI",
        popularity: 91,
        status: "Almost Full",
        date: "20 June 2026",
        dateVal: "2026-06-20",
        time: "1:30 PM",
        venue: "M. A. Chidambaram Stadium, Chennai",
        team1Logo: "images/ind.png",
        team2Logo: "images/sa.png",
        bg1: "#000080",
        bg2: "#007749",
        price: 2200
    },
    {
        title: "India vs New Zealand (Men's T20)",
        tournament: "T20 International",
        format: "T20",
        popularity: 94,
        status: "Selling Fast",
        date: "25 June 2026",
        dateVal: "2026-06-25",
        time: "7:00 PM",
        venue: "Rajiv Gandhi Intl Stadium, Hyderabad",
        team1Logo: "images/ind.png",
        team2Logo: "images/nz.png",
        bg1: "#000080",
        bg2: "#000000",
        price: 2000
    }
];

// Helper to get team initials for gorgeous visual placeholders
function getTeamInitials(teamName) {
    if (!teamName) return "VS";
    let name = teamName.replace(/["']/g, '');
    const lowerName = name.toLowerCase();
    if (lowerName.includes("mumbai indians")) return "MI";
    if (lowerName.includes("chennai super kings")) return "CSK";
    if (lowerName.includes("royal challengers")) return "RCB";
    if (lowerName.includes("kolkata knight riders")) return "KKR";
    if (lowerName.includes("delhi capitals")) return "DC";
    if (lowerName.includes("sunrisers hyderabad")) return "SRH";
    if (lowerName.includes("rajasthan royals")) return "RR";
    if (lowerName.includes("gujarat titans")) return "GT";
    if (lowerName.includes("punjab kings")) return "PBKS";
    if (lowerName.includes("lucknow super giants")) return "LSG";
    if (lowerName.includes("india")) return "IND";
    if (lowerName.includes("australia")) return "AUS";
    if (lowerName.includes("england")) return "ENG";
    if (lowerName.includes("south africa")) return "SA";
    if (lowerName.includes("new zealand")) return "NZ";

    const words = name.split(/\s+/).filter(w => !['vs', 'and', 'the', 'women\'s', 'men\'s', 't20', 'odi'].includes(w.toLowerCase()));
    if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 3).toUpperCase();
}

// Custom parser to translate "28 May 2026" & "7:30 PM" to JS Date object
function parseMatchDateTime(dateStr, timeStr) {
    const parts = dateStr.trim().split(/\s+/);
    if (parts.length !== 3) return new Date();
    const day = parseInt(parts[0], 10);
    const monthName = parts[1].toLowerCase();
    const year = parseInt(parts[2], 10);

    const months = {
        jan: 0, january: 0,
        feb: 1, february: 1,
        mar: 2, march: 2,
        apr: 3, april: 3,
        may: 4,
        jun: 5, june: 5,
        jul: 6, july: 6,
        aug: 7, august: 7,
        sep: 8, september: 8,
        oct: 9, october: 9,
        nov: 10, november: 10,
        dec: 11, december: 11
    };
    const month = months[monthName.substring(0, 3)] || 0;

    let hours = 0;
    let minutes = 0;
    const timeMatch = timeStr.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
    if (timeMatch) {
        hours = parseInt(timeMatch[1], 10);
        minutes = parseInt(timeMatch[2], 10);
        const ampm = timeMatch[3].toUpperCase();
        if (ampm === "PM" && hours < 12) hours += 12;
        if (ampm === "AM" && hours === 12) hours = 0;
    }

    return new Date(year, month, day, hours, minutes, 0, 0);
}

// Generate the countdown timer string
function getCountdownString(targetDate) {
    const now = new Date();
    const diff = targetDate - now;
    if (diff <= 0) return "Passed";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (days > 1) {
        return `In ${days}d ${hours}h`;
    } else if (days === 1) {
        return `In 1d ${hours}h`;
    } else {
        const h = String(hours).padStart(2, '0');
        const m = String(minutes).padStart(2, '0');
        const s = String(seconds).padStart(2, '0');
        return `${h}:${m}:${s}`;
    }
}

// Redesigned Match Cards renderer
function displayMatches(matches, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (matches.length === 0) {
        container.innerHTML = `
        <div class="col-12 text-center py-5 text-secondary">
            <i class="bi bi-search fs-1 mb-3 d-block text-danger"></i>
            <h5 class="text-white fw-bold">No Match Matches Found</h5>
            <p class="small">Try resetting or adjusting filters.</p>
        </div>
        `;
        return;
    }

    container.innerHTML = matches.map(m => {
        const safeTitle = m.title.replace(/'/g, "\\'");
        
        // Extract teams
        const teams = m.title.split(/\s+vs\s+/i);
        const team1Name = teams[0] ? teams[0].trim() : "Team 1";
        const team2Name = teams[1] ? teams[1].replace(/\(.*\)/, '').trim() : "Team 2";

        const matchDateTime = parseMatchDateTime(m.date, m.time);
        const isPassed = matchDateTime <= new Date();

        let badgeClass = "status-available";
        let badgeIcon = "bi-check-circle";
        let statusText = m.status;

        if (isPassed) {
            badgeClass = "status-booking-closed";
            badgeIcon = "bi-slash-circle";
            statusText = "Closed";
        } else if (m.status === "Selling Fast") {
            badgeClass = "status-selling-fast";
            badgeIcon = "bi-fire";
        } else if (m.status === "Almost Full") {
            badgeClass = "status-almost-full";
            badgeIcon = "bi-exclamation-triangle";
        }

        const countdownText = isPassed ? "Closed" : getCountdownString(matchDateTime);
        const isCountdownLive = !isPassed && (matchDateTime - new Date() < 24 * 60 * 60 * 1000);

        return `
        <div class="col-md-4 col-sm-6">
            <div class="cricket-card h-100 d-flex flex-column" data-tilt data-tilt-max="10" data-tilt-speed="400" data-tilt-glare="true" data-tilt-max-glare="0.15">
                
                <!-- Card Header -->
                <div class="cricket-card-header">
                    <span class="tournament-badge">${m.tournament} • ${m.format}</span>
                    <span class="status-badge ${badgeClass}">
                        <i class="bi ${badgeIcon}"></i> ${statusText}
                    </span>
                </div>

                <!-- Match Scoreboard -->
                <div class="match-scoreboard">
                    <!-- Diagonal Slash Effect -->
                    <div style="position: absolute; left: 50%; top: -20px; bottom: -20px; width: 2px; background: rgba(255,255,255,0.06); transform: rotate(15deg); z-index: 1;"></div>
                    
                    <!-- Team 1 -->
                    <div class="team-col">
                        <div class="team-logo-badge" style="background: linear-gradient(135deg, ${m.bg1} 0%, rgba(10,10,15,0.8) 100%);">
                            <div class="team-initials">${getTeamInitials(team1Name)}</div>
                            <img src="${m.team1Logo}" class="team-logo-img" alt="${team1Name}" onerror="this.style.opacity='0';">
                        </div>
                        <div class="team-name">${team1Name}</div>
                    </div>

                    <!-- VS / Ticker Column -->
                    <div class="vs-timer-col">
                        <div class="vs-text">VS</div>
                        <div class="countdown-ticker ${isCountdownLive ? 'live' : ''}" data-match-date="${matchDateTime.toISOString()}">
                            ${countdownText}
                        </div>
                    </div>

                    <!-- Team 2 -->
                    <div class="team-col">
                        <div class="team-logo-badge" style="background: linear-gradient(135deg, ${m.bg2} 0%, rgba(10,10,15,0.8) 100%);">
                            <div class="team-initials">${getTeamInitials(team2Name)}</div>
                            <img src="${m.team2Logo}" class="team-logo-img" alt="${team2Name}" onerror="this.style.opacity='0';">
                        </div>
                        <div class="team-name">${team2Name}</div>
                    </div>
                </div>

                <!-- Card details and actions -->
                <div class="cricket-card-details d-flex flex-column flex-grow-1">
                    <div class="detail-item"><i class="bi bi-calendar-event"></i> ${m.date}</div>
                    <div class="detail-item"><i class="bi bi-clock"></i> ${m.time}</div>
                    <div class="detail-item mb-3"><i class="bi bi-geo-alt-fill"></i> ${m.venue}</div>
                    
                    <button class="book-btn ${isPassed ? 'btn-secondary text-muted' : ''}" 
                            ${isPassed ? 'disabled' : ''} 
                            style="${isPassed ? 'background: #222 !important; cursor: not-allowed; box-shadow: none;' : ''}"
                            onclick="bookMatch('${safeTitle}', '${m.venue}', '${m.date}', '${m.time}', ${m.price}, '${m.team1Logo}', '${m.team2Logo}')">
                        ${isPassed ? '<i class="bi bi-slash-circle"></i> Booking Closed' : `<i class="bi bi-ticket-perforated-fill"></i> Book Seats — ₹${m.price.toLocaleString()}+`}
                    </button>
                </div>
            </div>
        </div>
        `;
    }).join('');

    // Initialize 3D Tilt Effect on populated cards
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(container.querySelectorAll(".cricket-card"), {
            max: 8,
            speed: 300,
            glare: true,
            "max-glare": 0.15,
            scale: 1.02
        });
    }
}

function bookMatch(title, venue, date, time, basePrice, team1Logo, team2Logo) {
    localStorage.setItem("cricketMatch", JSON.stringify({ title, venue, date, time, basePrice, team1Logo, team2Logo }));
    window.location.href = "stadium_seat_selection.html";
}

function filterCricket() {
    const search = document.getElementById('search').value.toLowerCase().trim();
    const team = document.getElementById('teamFilter').value;
    const city = document.getElementById('cityFilter').value;
    const stadium = document.getElementById('stadiumFilter').value;
    const dateVal = document.getElementById('dateFilter').value;
    const priceMax = document.getElementById('priceFilter').value;
    const sortBy = document.getElementById('sortFilter').value;

    const processList = (list) => {
        let result = list.filter(m => {
            const matchSearch = search === "" || 
                m.title.toLowerCase().includes(search) || 
                m.venue.toLowerCase().includes(search) ||
                m.tournament.toLowerCase().includes(search);
            
            const matchTeam = team === "" || m.title.toLowerCase().includes(team.toLowerCase());
            const matchCity = city === "" || m.venue.toLowerCase().includes(city.toLowerCase());
            const matchStadium = stadium === "" || m.venue.toLowerCase().includes(stadium.toLowerCase());
            const matchDate = dateVal === "" || m.dateVal === dateVal;
            const matchPrice = priceMax === "" || m.price <= Number(priceMax);

            return matchSearch && matchTeam && matchCity && matchStadium && matchDate && matchPrice;
        });

        // Sorting Logic
        if (sortBy === "price-asc") {
            result.sort((a, b) => a.price - b.price);
        } else if (sortBy === "price-desc") {
            result.sort((a, b) => b.price - a.price);
        } else if (sortBy === "date-asc") {
            result.sort((a, b) => parseMatchDateTime(a.date, a.time) - parseMatchDateTime(b.date, b.time));
        } else if (sortBy === "popularity") {
            result.sort((a, b) => b.popularity - a.popularity);
        } else {
            // Default sort: soonest matches first
            result.sort((a, b) => parseMatchDateTime(a.date, a.time) - parseMatchDateTime(b.date, b.time));
        }
        return result;
    };

    const filteredIPL = processList(iplMatches);
    const filteredINTL = processList(intlMatches);

    displayMatches(filteredIPL, 'iplList');
    displayMatches(filteredINTL, 'intlList');
}

// Reset filters globally
window.resetAllFilters = function() {
    document.getElementById('search').value = "";
    document.getElementById('teamFilter').value = "";
    document.getElementById('cityFilter').value = "";
    document.getElementById('stadiumFilter').value = "";
    document.getElementById('dateFilter').value = "";
    document.getElementById('priceFilter').value = "";
    document.getElementById('sortFilter').value = "";
    filterCricket();
};

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('search').addEventListener('input', filterCricket);
    document.getElementById('teamFilter').addEventListener('change', filterCricket);
    document.getElementById('cityFilter').addEventListener('change', filterCricket);
    document.getElementById('stadiumFilter').addEventListener('change', filterCricket);
    document.getElementById('dateFilter').addEventListener('change', filterCricket);
    document.getElementById('priceFilter').addEventListener('change', filterCricket);
    document.getElementById('sortFilter').addEventListener('change', filterCricket);

    filterCricket();

    // Start 1-second ticking countdown timer for premium sport-feel
    setInterval(() => {
        document.querySelectorAll('.countdown-ticker').forEach(el => {
            const targetStr = el.getAttribute('data-match-date');
            if (targetStr) {
                const targetDate = new Date(targetStr);
                const countdownStr = getCountdownString(targetDate);
                if (countdownStr === "Passed") {
                    el.textContent = "Closed";
                    el.classList.remove('live');
                    
                    const card = el.closest('.cricket-card');
                    if (card) {
                        const btn = card.querySelector('.book-btn');
                        if (btn && !btn.disabled) {
                            btn.disabled = true;
                            btn.innerHTML = `<i class="bi bi-slash-circle"></i> Booking Closed`;
                            btn.style.background = '#222 !important';
                            btn.style.boxShadow = 'none';
                            btn.style.cursor = 'not-allowed';
                            btn.className = 'book-btn btn-secondary text-muted';
                        }
                        const statusBadge = card.querySelector('.status-badge');
                        if (statusBadge && !statusBadge.classList.contains('status-booking-closed')) {
                            statusBadge.className = 'status-badge status-booking-closed';
                            statusBadge.innerHTML = `<i class="bi bi-slash-circle"></i> Closed`;
                        }
                    }
                } else {
                    el.textContent = countdownStr;
                }
            }
        });
    }, 1000);
});
