// =========================================================================
// EventNest Secure Backend Proxy & Rate Limiter Server
// =========================================================================
// This Express application serves as a secure proxy to hide third-party API keys
// (TMDB, Last.fm, OpenWeatherMap) and enforce strict route-based rate limiting.
// =========================================================================

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ================= 1. SECURITY HEADERS (HELMET) =================
// Configures HSTS, X-Frame-Options, X-Content-Type-Options, CSP, etc.
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'", 
                "https://cdn.jsdelivr.net", 
                "https://api.emailjs.com",
                "https://js.stripe.com",
                "https://checkout.razorpay.com",
                "https://cdn.onesignal.com"
            ],
            styleSrc: [
                "'self'", 
                "'unsafe-inline'", 
                "https://cdn.jsdelivr.net",
                "https://fonts.googleapis.com"
            ],
            imgSrc: [
                "'self'", 
                "data:", 
                "https://image.tmdb.org", 
                "https://openweathermap.org",
                "https://images.weserv.nl",
                "https://wsrv.nl",
                "https://*.wp.com"
            ],
            connectSrc: [
                "'self'", 
                "https://*.supabase.co", 
                "https://api.emailjs.com",
                "https://api.openweathermap.org",
                "https://ws.audioscrobbler.com",
                "https://api.themoviedb.org"
            ],
            frameSrc: [
                "'self'", 
                "https://maps.google.com", 
                "https://www.google.com",
                "https://js.stripe.com",
                "https://api.razorpay.com"
            ],
            fontSrc: [
                "'self'",
                "https://cdn.jsdelivr.net",
                "https://fonts.gstatic.com"
            ]
        }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// ================= 2. CORS CONFIGURATION =================
// Only allow trusted origins to connect to the backend
const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:3000', 'http://localhost:5500', 'http://127.0.0.1:5500'];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
            return callback(null, true);
        } else {
            return callback(new Error('CORS Policy violation: Origin not allowed'), false);
        }
    },
    credentials: true
}));

app.use(express.json());

// ================= 3. RATE LIMITING MIDDLEWARES =================

// Global Limiter: Max 100 requests per 15 minutes per IP
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests from this IP. Please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', globalLimiter);

// Auth Limiter: Max 5 attempts per 15 minutes per IP (Brute-force protection)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: 'Too many authentication attempts. Please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Checkout Limiter: Max 10 checkout requests per 15 minutes per IP (Fraud prevention)
const checkoutLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: 'Too many checkout requests. Please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});


// ================= 4. SECURE PROXY ROUTES =================

// A. OpenWeatherMap Proxy
app.get('/api/weather', async (req, res) => {
    const city = req.query.city;
    if (!city) {
        return res.status(400).json({ error: 'City query parameter is required' });
    }

    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Weather service is not configured on the server' });
    }

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
        const response = await fetch(url);
        if (!response.ok) {
            return res.status(response.status).json({ error: `Weather service error: ${response.statusText}` });
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Weather Proxy Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// B. TMDB Movie Search Proxy
app.get('/api/movies/search', async (req, res) => {
    const query = req.query.query;
    if (!query) {
        return res.status(400).json({ error: 'Search query parameter is required' });
    }

    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Movie metadata service is not configured on the server' });
    }

    try {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=en-US&page=1`;
        const response = await fetch(url);
        if (!response.ok) {
            return res.status(response.status).json({ error: `Movie metadata search error: ${response.statusText}` });
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('TMDB Search Proxy Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// C. TMDB Movie Details Proxy
app.get('/api/movies/details/:id', async (req, res) => {
    const movieId = req.params.id;
    if (!movieId) {
        return res.status(400).json({ error: 'Movie ID is required' });
    }

    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Movie details service is not configured on the server' });
    }

    try {
        const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&append_to_response=credits,videos,similar,reviews`;
        const response = await fetch(url);
        if (!response.ok) {
            return res.status(response.status).json({ error: `Movie details fetch error: ${response.statusText}` });
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('TMDB Details Proxy Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// D. Last.fm Artist Info Proxy
app.get('/api/lastfm/artist', async (req, res) => {
    const artist = req.query.artist;
    if (!artist) {
        return res.status(400).json({ error: 'Artist name parameter is required' });
    }

    const apiKey = process.env.LASTFM_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Artist metadata service is not configured on the server' });
    }

    try {
        const url = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(artist)}&api_key=${apiKey}&format=json`;
        const response = await fetch(url);
        if (!response.ok) {
            return res.status(response.status).json({ error: `Last.fm service error: ${response.statusText}` });
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Last.fm Proxy Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// ================= 5. SCAFFOLDED SECURE TRANSACTION ENDPOINTS =================
// In production, integrate these with your database and authentication systems.

app.post('/api/auth/login', authLimiter, (req, res) => {
    // Scaffolded Auth Login endpoint
    res.json({ message: 'Authentication request received securely.' });
});

app.post('/api/auth/register', authLimiter, (req, res) => {
    // Scaffolded Auth Registration endpoint
    res.json({ message: 'Registration request received securely.' });
});

app.post('/api/auth/forgot-password', authLimiter, (req, res) => {
    // Scaffolded password recovery endpoint
    res.json({ message: 'Password recovery request received securely.' });
});

app.post('/api/checkout', checkoutLimiter, (req, res) => {
    // Scaffolded secure checkout endpoint
    res.json({ message: 'Order checkout request received securely.' });
});


// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Start the server
app.listen(PORT, () => {
    console.log(`[EventNest Backend] Server is running on port ${PORT}`);
    console.log(`[EventNest Backend] Configured origins: ${allowedOrigins.join(', ')}`);
});
